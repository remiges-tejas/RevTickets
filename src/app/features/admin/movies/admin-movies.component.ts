import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { ToastService } from '../../../core/services/toast.service';
import { Movie } from '../../../shared/models';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-movies">
      <div class="container">
        <div class="page-header">
          <h1>Manage Movies</h1>
          <a routerLink="/admin/movies/new" class="btn-add">
            <span class="material-icons">add</span>
            Add Movie
          </a>
        </div>

        <!-- Search & Filter -->
        <div class="filters">
          <div class="search-box">
            <span class="material-icons">search</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterMovies()"
              placeholder="Search movies..."
            />
          </div>
          <select [(ngModel)]="statusFilter" (change)="filterMovies()">
            <option value="">All Status</option>
            <option value="now_showing">Now Showing</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <!-- Movies Table -->
        <div class="movies-table">
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (movie of filteredMovies(); track movie.id) {
                <tr>
                  <td>
                    <div class="movie-cell">
                      <img [src]="movie.posterUrl" [alt]="movie.title" />
                      <div>
                        <span class="title">{{ movie.title }}</span>
                        <span class="duration">{{ movie.duration }} min</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ movie.genres.slice(0, 2).join(', ') }}</td>
                  <td>{{ movie.language }}</td>
                  <td>
                    <span class="status" [class]="movie.status">
                      {{ movie.status.replace('_', ' ') }}
                    </span>
                  </td>
                  <td>
                    <div class="rating">
                      <span class="material-icons">star</span>
                      {{ movie.rating.toFixed(1) }}
                    </div>
                  </td>
                  <td>
                    <div class="actions">
                      <a [routerLink]="['/admin/movies', movie.id, 'edit']" class="btn-icon" title="Edit">
                        <span class="material-icons">edit</span>
                      </a>
                      <button class="btn-icon delete" (click)="deleteMovie(movie)" title="Delete">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty">
                    <span class="material-icons">movie</span>
                    <p>No movies found</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .admin-movies {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);
    }

    .page-header {
      @include flex-between;
      margin-bottom: $spacing-xl;

      h1 {
        font-size: $font-size-2xl;
      }

      .btn-add {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm $spacing-lg;
        background: $primary;
        border-radius: $radius-md;
        color: $text-primary;
        font-weight: $font-weight-medium;
        text-decoration: none;

        &:hover {
          background: $primary-dark;
        }

        .material-icons {
          font-size: 20px;
        }
      }
    }

    .filters {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-xl;

      .search-box {
        flex: 1;
        max-width: 400px;
        position: relative;

        .material-icons {
          position: absolute;
          left: $spacing-md;
          top: 50%;
          transform: translateY(-50%);
          color: $text-muted;
        }

        input {
          width: 100%;
          padding: $spacing-sm $spacing-md $spacing-sm 44px;
          background: $background-medium;
          border: none;
          border-radius: $radius-md;
          color: $text-primary;

          &::placeholder {
            color: $text-muted;
          }

          &:focus {
            outline: 2px solid $primary;
          }
        }
      }

      select {
        padding: $spacing-sm $spacing-md;
        background: $background-medium;
        border: none;
        border-radius: $radius-md;
        color: $text-primary;
        cursor: pointer;

        &:focus {
          outline: 2px solid $primary;
        }
      }
    }

    .movies-table {
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .movie-cell {
          display: flex;
          align-items: center;
          gap: $spacing-md;

          img {
            width: 40px;
            height: 60px;
            object-fit: cover;
            border-radius: $radius-sm;
          }

          .title {
            display: block;
            font-weight: $font-weight-medium;
          }

          .duration {
            font-size: $font-size-xs;
            color: $text-muted;
          }
        }

        .status {
          padding: $spacing-xs $spacing-sm;
          border-radius: $radius-sm;
          font-size: $font-size-xs;
          font-weight: $font-weight-semibold;
          text-transform: capitalize;

          &.now_showing {
            background: rgba($success, 0.2);
            color: $success;
          }

          &.coming_soon {
            background: rgba($info, 0.2);
            color: $info;
          }
        }

        .rating {
          display: flex;
          align-items: center;
          gap: $spacing-xs;

          .material-icons {
            font-size: 16px;
            color: $warning;
          }
        }

        .actions {
          display: flex;
          gap: $spacing-sm;

          .btn-icon {
            @include flex-center;
            width: 32px;
            height: 32px;
            background: $background-light;
            border: none;
            border-radius: $radius-sm;
            color: $text-secondary;
            cursor: pointer;
            text-decoration: none;

            &:hover {
              background: rgba(255, 255, 255, 0.15);
              color: $text-primary;
            }

            &.delete:hover {
              background: rgba($error, 0.2);
              color: $error;
            }

            .material-icons {
              font-size: 18px;
            }
          }
        }

        .empty {
          text-align: center;
          padding: $spacing-3xl;
          color: $text-muted;

          .material-icons {
            font-size: 48px;
            margin-bottom: $spacing-md;
          }
        }
      }
    }
  `]
})
export class AdminMoviesComponent implements OnInit {
  movies = signal<Movie[]>([]);
  filteredMovies = signal<Movie[]>([]);
  searchQuery = '';
  statusFilter = '';

  constructor(
    private movieService: MovieService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies.set(movies);
      this.filteredMovies.set(movies);
    });
  }

  filterMovies(): void {
    let filtered = this.movies();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.genres.some(g => g.toLowerCase().includes(query))
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(m => m.status === this.statusFilter);
    }

    this.filteredMovies.set(filtered);
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      this.movieService.deleteMovie(movie.id).subscribe({
        next: () => {
          this.loadMovies();
          this.toastService.success('Movie deleted successfully');
        },
        error: () => {
          this.toastService.error('Failed to delete movie');
        }
      });
    }
  }
}
