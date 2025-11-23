import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { ShowService } from '../../../core/services/show.service';
import { MovieService } from '../../../core/services/movie.service';
import { Booking, Show, Movie } from '../../../shared/models';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  template: `
    @if (isLoading()) {
      <app-loader [overlay]="true" message="Loading booking details..." />
    } @else if (booking()) {
      <div class="booking-summary-page">
        <div class="container">
          <div class="summary-layout">
            <!-- Booking Details -->
            <div class="booking-details">
              <h1>Booking Summary</h1>

              <!-- Movie & Show Info -->
              <div class="info-card">
                <div class="movie-info">
                  @if (movie()) {
                    <img [src]="movie()!.posterUrl" [alt]="movie()!.title" class="poster" />
                  }
                  <div class="details">
                    <h2>{{ movie()?.title }}</h2>
                    <p class="format">{{ show()?.format }} | {{ movie()?.language }}</p>
                  </div>
                </div>

                <div class="show-info">
                  <div class="info-row">
                    <span class="material-icons">location_on</span>
                    <div>
                      <strong>{{ show()?.theater?.name }}</strong>
                      <span>{{ show()?.theater?.location }}</span>
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="material-icons">calendar_today</span>
                    <div>
                      <strong>{{ show()?.showDate | date: 'EEEE, dd MMMM yyyy' }}</strong>
                      <span>{{ show()?.showTime }}</span>
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="material-icons">event_seat</span>
                    <div>
                      <strong>Seats</strong>
                      <span>{{ getSeatsList() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Important Info -->
              <div class="important-info">
                <h3>Important Information</h3>
                <ul>
                  <li>Tickets once booked cannot be exchanged or refunded</li>
                  <li>Children above 3 years require a separate ticket</li>
                  <li>Please arrive at least 15 minutes before the show</li>
                  <li>Outside food and beverages are not allowed</li>
                </ul>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="payment-summary">
              <div class="summary-card">
                <h3>Payment Details</h3>

                <div class="price-breakdown">
                  <div class="price-row">
                    <span>Ticket Price ({{ booking()!.totalSeats }})</span>
                    <span>₹{{ booking()!.baseAmount.toFixed(2) }}</span>
                  </div>
                  <div class="price-row">
                    <span>Convenience Fee</span>
                    <span>₹{{ booking()!.convenienceFee.toFixed(2) }}</span>
                  </div>
                  <div class="price-row">
                    <span>GST (18%)</span>
                    <span>₹{{ booking()!.taxes.toFixed(2) }}</span>
                  </div>
                </div>

                <div class="total-row">
                  <span>Total Amount</span>
                  <span>₹{{ booking()!.totalAmount.toFixed(2) }}</span>
                </div>

                <a [routerLink]="['/booking', booking()!.id, 'payment']" class="btn-pay">
                  Proceed to Payment
                </a>

                <p class="cancel-note">
                  <span class="material-icons">info</span>
                  You can cancel this booking within 30 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .booking-summary-page {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);
    }

    .summary-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-2xl;

      @include lg {
        grid-template-columns: 1fr 380px;
      }
    }

    .booking-details {
      h1 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-xl;
      }
    }

    .info-card {
      background: $background-medium;
      border-radius: $radius-xl;
      padding: $spacing-xl;
      margin-bottom: $spacing-xl;
    }

    .movie-info {
      display: flex;
      gap: $spacing-lg;
      padding-bottom: $spacing-xl;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: $spacing-xl;

      .poster {
        width: 80px;
        border-radius: $radius-md;
      }

      .details {
        h2 {
          font-size: $font-size-lg;
          margin-bottom: $spacing-xs;
        }

        .format {
          color: $text-muted;
          font-size: $font-size-sm;
        }
      }
    }

    .show-info {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .info-row {
      display: flex;
      gap: $spacing-md;

      .material-icons {
        color: $primary;
        font-size: 20px;
      }

      div {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;

        strong {
          font-size: $font-size-sm;
        }

        span {
          font-size: $font-size-sm;
          color: $text-muted;
        }
      }
    }

    .important-info {
      background: rgba($warning, 0.1);
      border-radius: $radius-lg;
      padding: $spacing-lg;
      border-left: 4px solid $warning;

      h3 {
        font-size: $font-size-base;
        margin-bottom: $spacing-md;
        color: $warning;
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

    .payment-summary {
      @include lg {
        position: sticky;
        top: calc($header-height + $spacing-xl);
        height: fit-content;
      }
    }

    .summary-card {
      background: $background-medium;
      border-radius: $radius-xl;
      padding: $spacing-xl;

      h3 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-xl;
      }
    }

    .price-breakdown {
      margin-bottom: $spacing-lg;

      .price-row {
        @include flex-between;
        padding: $spacing-sm 0;
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }

    .total-row {
      @include flex-between;
      padding: $spacing-lg 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
    }

    .btn-pay {
      display: block;
      width: 100%;
      padding: $spacing-md;
      background: $primary;
      border-radius: $radius-md;
      color: $text-primary;
      text-align: center;
      font-weight: $font-weight-semibold;
      text-decoration: none;
      transition: background $transition-fast;

      &:hover {
        background: $primary-dark;
      }
    }

    .cancel-note {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-top: $spacing-lg;
      font-size: $font-size-xs;
      color: $text-muted;

      .material-icons {
        font-size: 16px;
      }
    }
  `]
})
export class BookingSummaryComponent implements OnInit {
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
}
