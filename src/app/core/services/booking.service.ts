import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { Booking, BookedSeat, Seat, SeatSelection } from '../../shared/models';
import { AuthService } from './auth.service';
import { ShowService } from './show.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = '/api/bookings';

  // Current booking state
  private currentSelectionSignal = signal<SeatSelection | null>(null);
  readonly currentSelection = this.currentSelectionSignal.asReadonly();

  // Mock bookings storage
  private mockBookings: Booking[] = [
    {
      id: 'b1',
      bookingNumber: 'RTK2024001',
      userId: '1',
      showId: 'sh1',
      seats: [
        { seatId: 'D4', row: 'D', number: 4, category: 'Executive', price: 280 },
        { seatId: 'D5', row: 'D', number: 5, category: 'Executive', price: 280 }
      ],
      totalSeats: 2,
      baseAmount: 560,
      convenienceFee: 42,
      taxes: 108.36,
      totalAmount: 710.36,
      status: 'confirmed',
      paymentId: 'p1',
      qrCode: 'QR_RTK2024001',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  private authService = inject(AuthService);
  private showService = inject(ShowService);

  constructor(private http: HttpClient) {}

  // Set selected seats for current booking
  setSelectedSeats(showId: string, seats: Seat[]): void {
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
    this.currentSelectionSignal.set({
      showId,
      seats,
      totalAmount
    });
  }

  // Clear current selection
  clearSelection(): void {
    this.currentSelectionSignal.set(null);
  }

  // Calculate booking totals
  calculateTotals(baseAmount: number): { convenienceFee: number; taxes: number; total: number } {
    const convenienceFee = Math.round(baseAmount * 0.075 * 100) / 100; // 7.5%
    const taxes = Math.round((baseAmount + convenienceFee) * 0.18 * 100) / 100; // 18% GST
    const total = Math.round((baseAmount + convenienceFee + taxes) * 100) / 100;
    return { convenienceFee, taxes, total };
  }

  // Create a new booking
  createBooking(showId: string, seats: Seat[]): Observable<Booking> {
    const baseAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
    const { convenienceFee, taxes, total } = this.calculateTotals(baseAmount);

    const bookedSeats: BookedSeat[] = seats.map(seat => ({
      seatId: seat.id,
      row: seat.row,
      number: seat.number,
      category: seat.category,
      price: seat.price
    }));

    // Get current user ID from auth service
    const currentUser = this.authService.currentUser();
    const userId = currentUser ? String(currentUser.id) : '1';

    const newBooking: Booking = {
      id: 'b' + Date.now(),
      bookingNumber: 'RTK' + Date.now().toString().slice(-7),
      userId,
      showId,
      seats: bookedSeats,
      totalSeats: seats.length,
      baseAmount,
      convenienceFee,
      taxes,
      totalAmount: total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockBookings.push(newBooking);
    return of(newBooking).pipe(delay(800));
  }

  // Get booking by ID
  getBookingById(id: string): Observable<Booking | undefined> {
    const booking = this.mockBookings.find(b => b.id === id);
    return of(booking).pipe(delay(300));
  }

  // Get bookings for current user
  getUserBookings(userId: string): Observable<Booking[]> {
    const bookings = this.mockBookings.filter(b => b.userId === userId);
    return of(bookings.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )).pipe(delay(500));
  }

  // Update booking status
  updateBookingStatus(id: string, status: Booking['status'], paymentId?: string): Observable<Booking> {
    const index = this.mockBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBookings[index] = {
        ...this.mockBookings[index],
        status,
        paymentId: paymentId || this.mockBookings[index].paymentId,
        qrCode: status === 'confirmed' ? `QR_${this.mockBookings[index].bookingNumber}` : undefined,
        updatedAt: new Date()
      };

      // Mark seats as booked in the show service when booking is confirmed
      if (status === 'confirmed') {
        const booking = this.mockBookings[index];
        const seatIds = booking.seats.map(s => s.seatId);
        this.showService.bookSeats(booking.showId, seatIds);
      }

      return of(this.mockBookings[index]).pipe(delay(500));
    }
    throw new Error('Booking not found');
  }

  // Cancel booking
  cancelBooking(id: string): Observable<Booking> {
    return this.updateBookingStatus(id, 'cancelled');
  }

  // Get all bookings (admin)
  getAllBookings(): Observable<Booking[]> {
    return of(this.mockBookings.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )).pipe(delay(500));
  }
}
