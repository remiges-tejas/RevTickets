import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { ShowService } from '../../../core/services/show.service';
import { MovieService } from '../../../core/services/movie.service';
import { Booking, Show, Movie } from '../../../shared/models';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  template: `
    @if (isLoading()) {
      <app-loader [overlay]="true" message="Loading confirmation..." />
    } @else if (booking()) {
      <div class="confirmation-page">
        <div class="container">
          <!-- Success Message -->
          <div class="success-header">
            <div class="success-icon">
              <span class="material-icons">check_circle</span>
            </div>
            <h1>Booking Confirmed!</h1>
            <p>Your tickets have been booked successfully</p>
          </div>

          <!-- E-Ticket -->
          <div class="ticket-card">
            <div class="ticket-header">
              <span class="booking-id">{{ booking()!.bookingNumber }}</span>
              <span class="status confirmed">Confirmed</span>
            </div>

            <div class="ticket-content">
              <!-- Movie Info -->
              <div class="movie-section">
                @if (movie()) {
                  <img [src]="movie()!.posterUrl" [alt]="movie()!.title" class="poster" />
                }
                <div class="movie-details">
                  <h2>{{ movie()?.title }}</h2>
                  <span class="format">{{ show()?.format }} | {{ movie()?.language }}</span>
                </div>
              </div>

              <!-- Show Details -->
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Theater</span>
                  <span class="value">{{ show()?.theater?.name }}</span>
                  <span class="sub">{{ show()?.theater?.location }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date & Time</span>
                  <span class="value">{{ show()?.showDate | date: 'EEE, dd MMM' }}</span>
                  <span class="sub">{{ show()?.showTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Seats</span>
                  <span class="value">{{ getSeatsList() }}</span>
                  <span class="sub">{{ booking()!.totalSeats }} Ticket(s)</span>
                </div>
                <div class="detail-item">
                  <span class="label">Total Amount</span>
                  <span class="value">₹{{ booking()!.totalAmount.toFixed(2) }}</span>
                  <span class="sub">Paid</span>
                </div>
              </div>

              <!-- QR Code -->
              <div class="qr-section">
                <div class="qr-code">
                  <!-- Placeholder QR -->
                  <div class="qr-placeholder">
                    <span class="material-icons">qr_code_2</span>
                  </div>
                </div>
                <p>Show this QR code at the theater entrance</p>
              </div>
            </div>

            <div class="ticket-footer">
              <button class="btn-download" (click)="downloadTicket()">
                <span class="material-icons">download</span>
                Download Ticket
              </button>
              <button class="btn-print" (click)="printTicket()">
                <span class="material-icons">print</span>
                Print
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="page-actions">
            <a routerLink="/" class="btn-home">
              <span class="material-icons">home</span>
              Back to Home
            </a>
            <a routerLink="/profile" class="btn-bookings">
              <span class="material-icons">confirmation_number</span>
              View All Bookings
            </a>
          </div>

          <!-- Info -->
          <div class="info-section">
            <h3>Important Information</h3>
            <ul>
              <li>Please arrive at the theater at least 15 minutes before the show</li>
              <li>Carry a valid ID proof along with this ticket</li>
              <li>Outside food and beverages are not allowed inside the theater</li>
              <li>For any queries, contact: support&#64;revtickets.com</li>
            </ul>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .confirmation-page {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);
    }

    .success-header {
      text-align: center;
      margin-bottom: $spacing-2xl;

      .success-icon {
        @include flex-center;
        width: 80px;
        height: 80px;
        margin: 0 auto $spacing-lg;
        background: rgba($success, 0.2);
        border-radius: 50%;

        .material-icons {
          font-size: 48px;
          color: $success;
        }
      }

      h1 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-sm;
      }

      p {
        color: $text-muted;
      }
    }

    .ticket-card {
      background: $background-medium;
      border-radius: $radius-xl;
      overflow: hidden;
      max-width: 600px;
      margin: 0 auto $spacing-2xl;
    }

    .ticket-header {
      @include flex-between;
      padding: $spacing-lg;
      background: $background-light;

      .booking-id {
        font-weight: $font-weight-bold;
        font-family: monospace;
      }

      .status {
        padding: $spacing-xs $spacing-md;
        border-radius: $radius-full;
        font-size: $font-size-xs;
        font-weight: $font-weight-semibold;
        text-transform: uppercase;

        &.confirmed {
          background: rgba($success, 0.2);
          color: $success;
        }
      }
    }

    .ticket-content {
      padding: $spacing-xl;
    }

    .movie-section {
      display: flex;
      gap: $spacing-lg;
      padding-bottom: $spacing-xl;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
      margin-bottom: $spacing-xl;

      .poster {
        width: 80px;
        border-radius: $radius-md;
      }

      .movie-details {
        h2 {
          font-size: $font-size-lg;
          margin-bottom: $spacing-xs;
        }

        .format {
          font-size: $font-size-sm;
          color: $text-muted;
        }
      }
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-lg;
      margin-bottom: $spacing-xl;

      .detail-item {
        .label {
          display: block;
          font-size: $font-size-xs;
          color: $text-muted;
          margin-bottom: $spacing-xs;
        }

        .value {
          display: block;
          font-weight: $font-weight-semibold;
          margin-bottom: $spacing-xs;
        }

        .sub {
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }
    }

    .qr-section {
      text-align: center;
      padding-top: $spacing-xl;
      border-top: 1px dashed rgba(255, 255, 255, 0.2);

      .qr-code {
        display: inline-block;
        padding: $spacing-md;
        background: white;
        border-radius: $radius-md;
        margin-bottom: $spacing-md;

        .qr-placeholder {
          @include flex-center;
          width: 150px;
          height: 150px;

          .material-icons {
            font-size: 120px;
            color: $background-dark;
          }
        }
      }

      p {
        font-size: $font-size-sm;
        color: $text-muted;
      }
    }

    .ticket-footer {
      display: flex;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-sm;
        padding: $spacing-md;
        background: none;
        border: none;
        color: $text-secondary;
        font-weight: $font-weight-medium;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: $text-primary;
        }

        &:first-child {
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .material-icons {
          font-size: 20px;
        }
      }
    }

    .page-actions {
      display: flex;
      justify-content: center;
      gap: $spacing-md;
      margin-bottom: $spacing-2xl;

      .btn-home,
      .btn-bookings {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-md $spacing-xl;
        border-radius: $radius-md;
        font-weight: $font-weight-medium;
        text-decoration: none;
        transition: all $transition-fast;

        .material-icons {
          font-size: 20px;
        }
      }

      .btn-home {
        background: $background-light;
        color: $text-primary;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }

      .btn-bookings {
        background: $primary;
        color: $text-primary;

        &:hover {
          background: $primary-dark;
        }
      }
    }

    .info-section {
      max-width: 600px;
      margin: 0 auto;
      padding: $spacing-xl;
      background: rgba($info, 0.1);
      border-radius: $radius-lg;
      border-left: 4px solid $info;

      h3 {
        font-size: $font-size-base;
        margin-bottom: $spacing-md;
        color: $info;
      }

      ul {
        list-style: disc;
        padding-left: $spacing-xl;

        li {
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-bottom: $spacing-sm;
        }
      }
    }
  `]
})
export class ConfirmationComponent implements OnInit {
  booking = signal<Booking | null>(null);
  show = signal<Show | null>(null);
  movie = signal<Movie | null>(null);
  isLoading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private showService: ShowService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.loadBookingData(bookingId);
    }
  }

  private loadBookingData(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe(booking => {
      if (booking) {
        this.booking.set(booking);
        this.loadShowData(booking.showId);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private loadShowData(showId: string): void {
    this.showService.getShowById(showId).subscribe(show => {
      if (show) {
        this.show.set(show);
        if (show.movieId) {
          this.movieService.getMovieById(show.movieId).subscribe(movie => {
            this.movie.set(movie || null);
            this.isLoading.set(false);
          });
        }
      }
    });
  }

  getSeatsList(): string {
    return this.booking()?.seats.map(s => `${s.row}${s.number}`).join(', ') || '';
  }

  downloadTicket(): void {
    // In real app, would generate PDF
    window.print();
  }

  printTicket(): void {
    window.print();
  }
}
