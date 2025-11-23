import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, catchError } from 'rxjs';
import { Show, Theater, Screen, Seat, ShowFilters } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private readonly API_URL = `${environment.apiUrl}/showtimes`;
  private useMockData = true; // Set to false when backend is running

  // Mock theaters
  private mockTheaters: Theater[] = [
    {
      id: 't1',
      name: 'PVR Cinemas',
      location: 'Phoenix Mall',
      address: '462, Senapati Bapat Marg, Lower Parel',
      city: 'Mumbai',
      screens: [
        {
          id: 's1',
          name: 'Screen 1',
          theaterId: 't1',
          seatLayout: {
            rows: 10,
            columns: 15,
            categories: [
              { name: 'Premium', rows: [1, 2], price: 350, color: '#FFD700' },
              { name: 'Executive', rows: [3, 4, 5, 6], price: 280, color: '#C0C0C0' },
              { name: 'Normal', rows: [7, 8, 9, 10], price: 180, color: '#CD7F32' }
            ],
            gaps: [{ afterRow: 6 }]
          },
          totalSeats: 150,
          format: ['2D', 'IMAX']
        }
      ],
      amenities: ['Parking', 'Food Court', 'Wheelchair Access'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 't2',
      name: 'INOX',
      location: 'R City Mall',
      address: 'LBS Marg, Ghatkopar West',
      city: 'Mumbai',
      screens: [
        {
          id: 's2',
          name: 'Screen 1 - IMAX',
          theaterId: 't2',
          seatLayout: {
            rows: 12,
            columns: 20,
            categories: [
              { name: 'Recliner', rows: [1, 2], price: 800, color: '#8B0000' },
              { name: 'Premium', rows: [3, 4, 5], price: 450, color: '#FFD700' },
              { name: 'Executive', rows: [6, 7, 8, 9], price: 350, color: '#C0C0C0' },
              { name: 'Normal', rows: [10, 11, 12], price: 250, color: '#CD7F32' }
            ],
            gaps: [{ afterRow: 5 }, { afterRow: 9 }]
          },
          totalSeats: 240,
          format: ['IMAX', '3D']
        }
      ],
      amenities: ['Parking', 'M-Ticket', 'Food Counter'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Generate shows for multiple movies and dates
  private mockShows: Show[] = this.generateShows();

  private generateShows(): Show[] {
    const shows: Show[] = [];
    const movieIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const times = [
      { time: '10:00 AM', end: '12:30 PM' },
      { time: '01:30 PM', end: '04:00 PM' },
      { time: '04:30 PM', end: '07:00 PM' },
      { time: '07:30 PM', end: '10:00 PM' },
      { time: '10:30 PM', end: '01:00 AM' }
    ];
    const statuses: ('scheduled' | 'filling_fast' | 'almost_full' | 'sold_out')[] =
      ['scheduled', 'scheduled', 'filling_fast', 'almost_full', 'scheduled'];

    let showId = 1;

    // Generate shows for next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);

      movieIds.forEach((movieId, movieIndex) => {
        // Theater 1 shows
        times.slice(0, 3).forEach((slot, i) => {
          shows.push({
            id: `sh${showId++}`,
            movieId,
            theaterId: 't1',
            screenId: 's1',
            showDate: new Date(date),
            showTime: slot.time,
            endTime: slot.end,
            format: i === 1 ? 'IMAX' : '2D',
            language: 'English',
            basePrice: i === 1 ? 280 : 180,
            availableSeats: Math.floor(Math.random() * 100) + 50,
            totalSeats: 150,
            status: statuses[(movieIndex + i + day) % 5],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });

        // Theater 2 shows
        times.slice(2).forEach((slot, i) => {
          shows.push({
            id: `sh${showId++}`,
            movieId,
            theaterId: 't2',
            screenId: 's2',
            showDate: new Date(date),
            showTime: slot.time,
            endTime: slot.end,
            format: 'IMAX',
            language: 'English',
            basePrice: 350,
            availableSeats: Math.floor(Math.random() * 150) + 50,
            totalSeats: 240,
            status: statuses[(movieIndex + i + day + 2) % 5],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      });
    }

    return shows;
  }

  // Mock booked seats (showId -> seat ids)
  private bookedSeats: Map<string, string[]> = new Map([
    ['sh1', ['A1', 'A2', 'A3', 'B5', 'B6', 'C10', 'D7', 'D8']],
    ['sh2', ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3']],
    ['sh4', ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10']]
  ]);

  constructor(private http: HttpClient) {}

  getShowsByMovie(movieId: string, filters?: ShowFilters): Observable<Show[]> {
    let shows = this.mockShows.filter(s => s.movieId === movieId);

    // Filter by date if provided
    if (filters?.date) {
      const filterDate = new Date(filters.date);
      filterDate.setHours(0, 0, 0, 0);
      shows = shows.filter(s => {
        const showDate = new Date(s.showDate);
        showDate.setHours(0, 0, 0, 0);
        return showDate.getTime() === filterDate.getTime();
      });
    }

    // Filter by format if provided
    if (filters?.format) {
      shows = shows.filter(s => s.format === filters.format);
    }

    // Add theater data
    shows = shows.map(show => ({
      ...show,
      theater: this.mockTheaters.find(t => t.id === show.theaterId)
    }));

    return of(shows).pipe(delay(500));
  }

  getShowById(showId: string): Observable<Show | undefined> {
    const show = this.mockShows.find(s => s.id === showId);
    if (show) {
      return of({
        ...show,
        theater: this.mockTheaters.find(t => t.id === show.theaterId),
        screen: this.mockTheaters
          .find(t => t.id === show.theaterId)
          ?.screens.find(s => s.id === show.screenId)
      }).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  getSeatsForShow(showId: string): Observable<Seat[]> {
    const show = this.mockShows.find(s => s.id === showId);
    if (!show) {
      return of([]).pipe(delay(300));
    }

    const theater = this.mockTheaters.find(t => t.id === show.theaterId);
    const screen = theater?.screens.find(s => s.id === show.screenId);

    if (!screen) {
      return of([]).pipe(delay(300));
    }

    const booked = this.bookedSeats.get(showId) || [];
    const seats: Seat[] = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let row = 0; row < screen.seatLayout.rows; row++) {
      const rowLabel = rowLabels[row];
      const category = screen.seatLayout.categories.find(c => c.rows.includes(row + 1));

      for (let col = 1; col <= screen.seatLayout.columns; col++) {
        const seatId = `${rowLabel}${col}`;
        seats.push({
          id: seatId,
          row: rowLabel,
          number: col,
          category: category?.name || 'Normal',
          price: category?.price || show.basePrice,
          status: booked.includes(seatId) ? 'booked' : 'available'
        });
      }
    }

    return of(seats).pipe(delay(500));
  }

  getTheaters(): Observable<Theater[]> {
    return of(this.mockTheaters).pipe(delay(300));
  }

  getTheaterById(id: string): Observable<Theater | undefined> {
    return of(this.mockTheaters.find(t => t.id === id)).pipe(delay(300));
  }

  // Admin methods
  createShow(show: Omit<Show, 'id' | 'createdAt' | 'updatedAt'>): Observable<Show> {
    const newShow: Show = {
      ...show,
      id: 'sh' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockShows.push(newShow);
    return of(newShow).pipe(delay(500));
  }

  updateShow(id: string, updates: Partial<Show>): Observable<Show> {
    const index = this.mockShows.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockShows[index] = {
        ...this.mockShows[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockShows[index]).pipe(delay(500));
    }
    throw new Error('Show not found');
  }

  deleteShow(id: string): Observable<void> {
    const index = this.mockShows.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockShows.splice(index, 1);
    }
    return of(void 0).pipe(delay(500));
  }

  // Mark seats as booked for a show
  bookSeats(showId: string, seatIds: string[]): void {
    const currentBooked = this.bookedSeats.get(showId) || [];
    this.bookedSeats.set(showId, [...currentBooked, ...seatIds]);
  }

  createTheater(theater: Omit<Theater, 'id' | 'createdAt' | 'updatedAt'>): Observable<Theater> {
    const newTheater: Theater = {
      ...theater,
      id: 't' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTheaters.push(newTheater);
    return of(newTheater).pipe(delay(500));
  }
}
