import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowService } from '../../../core/services/show.service';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { Show, Seat } from '../../../shared/models';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.scss'
})
export class SeatSelectionComponent implements OnInit {
  show = signal<Show | null>(null);
  seats = signal<Seat[]>([]);
  selectedSeats = signal<Seat[]>([]);
  isLoading = signal(true);
  isProcessing = signal(false);

  // Computed values
  totalAmount = computed(() =>
    this.selectedSeats().reduce((sum, seat) => sum + seat.price, 0)
  );

  seatsByRow = computed(() => {
    const grouped = new Map<string, Seat[]>();
    this.seats().forEach(seat => {
      if (!grouped.has(seat.row)) {
        grouped.set(seat.row, []);
      }
      grouped.get(seat.row)!.push(seat);
    });
    return Array.from(grouped.entries());
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private bookingService: BookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const showId = this.route.snapshot.paramMap.get('showId');
    if (showId) {
      this.loadShowData(showId);
    }
  }

  private loadShowData(showId: string): void {
    // Load show details
    this.showService.getShowById(showId).subscribe(show => {
      if (show) {
        this.show.set(show);
        this.loadSeats(showId);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private loadSeats(showId: string): void {
    this.showService.getSeatsForShow(showId).subscribe(seats => {
      this.seats.set(seats);
      this.isLoading.set(false);
    });
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'booked' || seat.status === 'blocked') {
      return;
    }

    const selected = this.selectedSeats();
    const index = selected.findIndex(s => s.id === seat.id);

    if (index !== -1) {
      // Deselect
      this.selectedSeats.set(selected.filter(s => s.id !== seat.id));
      seat.status = 'available';
    } else {
      // Select (max 10 seats)
      if (selected.length >= 10) {
        this.toastService.warning('You can select maximum 10 seats');
        return;
      }
      this.selectedSeats.set([...selected, seat]);
      seat.status = 'selected';
    }
  }

  getSeatClass(seat: Seat): string {
    const classes = ['seat', seat.category.toLowerCase().replace(' ', '-')];

    if (seat.status === 'booked') {
      classes.push('booked');
    } else if (seat.status === 'selected') {
      classes.push('selected');
    } else {
      classes.push('available');
    }

    return classes.join(' ');
  }

  getCategoryColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'recliner': return '#8B0000';
      case 'premium': return '#FFD700';
      case 'executive': return '#C0C0C0';
      default: return '#CD7F32';
    }
  }

  getUniqueCategories(): { name: string; price: number; color: string }[] {
    const categories = new Map<string, { name: string; price: number; color: string }>();

    this.seats().forEach(seat => {
      if (!categories.has(seat.category)) {
        categories.set(seat.category, {
          name: seat.category,
          price: seat.price,
          color: this.getCategoryColor(seat.category)
        });
      }
    });

    return Array.from(categories.values());
  }

  proceedToCheckout(): void {
    if (this.selectedSeats().length === 0) {
      this.toastService.warning('Please select at least one seat');
      return;
    }

    this.isProcessing.set(true);

    // Create booking
    this.bookingService.createBooking(this.show()!.id, this.selectedSeats()).subscribe({
      next: (booking) => {
        this.bookingService.setSelectedSeats(this.show()!.id, this.selectedSeats());
        this.router.navigate(['/booking', booking.id, 'summary']);
      },
      error: () => {
        this.isProcessing.set(false);
        this.toastService.error('Failed to create booking. Please try again.');
      }
    });
  }
}
