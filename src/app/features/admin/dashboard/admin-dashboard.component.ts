import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard">
      <div class="container">
        <h1>Admin Dashboard</h1>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon movies">
              <span class="material-icons">movie</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalMovies() }}</span>
              <span class="stat-label">Total Movies</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bookings">
              <span class="material-icons">confirmation_number</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalBookings() }}</span>
              <span class="stat-label">Total Bookings</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue">
              <span class="material-icons">currency_rupee</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">₹{{ totalRevenue().toLocaleString() }}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon theaters">
              <span class="material-icons">theaters</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalTheaters() }}</span>
              <span class="stat-label">Theaters</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <a routerLink="/admin/movies/new" class="action-card">
              <span class="material-icons">add_circle</span>
              <span>Add New Movie</span>
            </a>
            <a routerLink="/admin/showtimes" class="action-card">
              <span class="material-icons">schedule</span>
              <span>Manage Showtimes</span>
            </a>
            <a routerLink="/admin/theaters" class="action-card">
              <span class="material-icons">location_city</span>
              <span>Manage Theaters</span>
            </a>
            <a routerLink="/admin/reports" class="action-card">
              <span class="material-icons">analytics</span>
              <span>View Reports</span>
            </a>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="section">
          <h2>Recent Bookings</h2>
          <div class="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (booking of recentBookings(); track booking.id) {
                  <tr>
                    <td class="booking-id">{{ booking.bookingNumber }}</td>
                    <td>{{ booking.createdAt | date: 'dd MMM, hh:mm a' }}</td>
                    <td>{{ booking.totalSeats }}</td>
                    <td>₹{{ booking.totalAmount.toFixed(2) }}</td>
                    <td>
                      <span class="status" [class]="booking.status">
                        {{ booking.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Management Links -->
        <div class="management-grid">
          <a routerLink="/admin/movies" class="management-card">
            <div class="card-icon">
              <span class="material-icons">movie_filter</span>
            </div>
            <div class="card-content">
              <h3>Manage Movies</h3>
              <p>Add, edit, or remove movies from the catalog</p>
            </div>
            <span class="material-icons arrow">arrow_forward</span>
          </a>

          <a routerLink="/admin/showtimes" class="management-card">
            <div class="card-icon">
              <span class="material-icons">event</span>
            </div>
            <div class="card-content">
              <h3>Manage Showtimes</h3>
              <p>Schedule and manage movie showtimes</p>
            </div>
            <span class="material-icons arrow">arrow_forward</span>
          </a>

          <a routerLink="/admin/theaters" class="management-card">
            <div class="card-icon">
              <span class="material-icons">business</span>
            </div>
            <div class="card-content">
              <h3>Manage Theaters</h3>
              <p>Configure theaters and screen layouts</p>
            </div>
            <span class="material-icons arrow">arrow_forward</span>
          </a>

          <a routerLink="/admin/reports" class="management-card">
            <div class="card-icon">
              <span class="material-icons">bar_chart</span>
            </div>
            <div class="card-content">
              <h3>Reports & Analytics</h3>
              <p>View booking trends and revenue reports</p>
            </div>
            <span class="material-icons arrow">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .admin-dashboard {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);

      h1 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-2xl;
      }
    }

    // Stats Grid
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
      margin-bottom: $spacing-2xl;

      @include md {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-lg;
      background: $background-medium;
      border-radius: $radius-lg;

      .stat-icon {
        @include flex-center;
        width: 48px;
        height: 48px;
        border-radius: $radius-md;

        &.movies {
          background: rgba($primary, 0.2);
          color: $primary;
        }
        &.bookings {
          background: rgba($success, 0.2);
          color: $success;
        }
        &.revenue {
          background: rgba($warning, 0.2);
          color: $warning;
        }
        &.theaters {
          background: rgba($info, 0.2);
          color: $info;
        }

        .material-icons {
          font-size: 24px;
        }
      }

      .stat-content {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: $font-size-xl;
          font-weight: $font-weight-bold;
        }

        .stat-label {
          font-size: $font-size-sm;
          color: $text-muted;
        }
      }
    }

    // Sections
    .section {
      margin-bottom: $spacing-2xl;

      h2 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-lg;
      }
    }

    // Actions Grid
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;

      @include md {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-xl;
      background: $background-medium;
      border-radius: $radius-lg;
      text-decoration: none;
      color: $text-primary;
      transition: all $transition-fast;

      &:hover {
        background: $background-light;
        transform: translateY(-2px);
      }

      .material-icons {
        font-size: 32px;
        color: $primary;
      }

      span:last-child {
        font-size: $font-size-sm;
        text-align: center;
      }
    }

    // Bookings Table
    .bookings-table {
      background: $background-medium;
      border-radius: $radius-lg;
      overflow: hidden;

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          padding: $spacing-md;
          text-align: left;
        }

        th {
          background: $background-light;
          font-size: $font-size-sm;
          font-weight: $font-weight-semibold;
          color: $text-muted;
        }

        td {
          font-size: $font-size-sm;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .booking-id {
          font-family: monospace;
          font-weight: $font-weight-medium;
        }

        .status {
          padding: $spacing-xs $spacing-sm;
          border-radius: $radius-sm;
          font-size: $font-size-xs;
          font-weight: $font-weight-semibold;
          text-transform: uppercase;

          &.confirmed {
            background: rgba($success, 0.2);
            color: $success;
          }

          &.pending {
            background: rgba($warning, 0.2);
            color: $warning;
          }

          &.cancelled {
            background: rgba($error, 0.2);
            color: $error;
          }
        }
      }
    }

    // Management Grid
    .management-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-md;

      @include md {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .management-card {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-lg;
      background: $background-medium;
      border-radius: $radius-lg;
      text-decoration: none;
      transition: all $transition-fast;

      &:hover {
        background: $background-light;

        .arrow {
          transform: translateX(4px);
        }
      }

      .card-icon {
        @include flex-center;
        width: 48px;
        height: 48px;
        background: rgba($primary, 0.2);
        border-radius: $radius-md;

        .material-icons {
          font-size: 24px;
          color: $primary;
        }
      }

      .card-content {
        flex: 1;

        h3 {
          font-size: $font-size-base;
          color: $text-primary;
          margin-bottom: $spacing-xs;
        }

        p {
          font-size: $font-size-sm;
          color: $text-muted;
          margin: 0;
        }
      }

      .arrow {
        color: $text-muted;
        transition: transform $transition-fast;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  totalMovies = signal(0);
  totalBookings = signal(0);
  totalRevenue = signal(0);
  totalTheaters = signal(2);
  recentBookings = signal<any[]>([]);

  constructor(
    private movieService: MovieService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.totalMovies.set(movies.length);
    });

    this.bookingService.getAllBookings().subscribe(bookings => {
      this.totalBookings.set(bookings.length);
      this.totalRevenue.set(
        bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalAmount, 0)
      );
      this.recentBookings.set(bookings.slice(0, 5));
    });
  }
}
