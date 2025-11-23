import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { Movie, MovieFilters, MovieFormat } from '../../../shared/models';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent, SkeletonComponent],
  template: `
    <div class="movie-list-page">
      <div class="container">
        <!-- Filters -->
        <div class="filters-section">
          <div class="filter-header">
            <h1>Movies</h1>
            <span class="results-count">{{ movies().length }} movies found</span>
          </div>

          <div class="filters">
            <!-- Genre Filter -->
            <div class="filter-group">
              <label>Genre</label>
              <select [(ngModel)]="selectedGenre" (change)="applyFilters()">
                <option value="">All Genres</option>
                @for (genre of genres(); track genre) {
                  <option [value]="genre">{{ genre }}</option>
                }
              </select>
            </div>

            <!-- Language Filter -->
            <div class="filter-group">
              <label>Language</label>
              <select [(ngModel)]="selectedLanguage" (change)="applyFilters()">
                <option value="">All Languages</option>
                @for (lang of languages(); track lang) {
                  <option [value]="lang">{{ lang }}</option>
                }
              </select>
            </div>

            <!-- Format Filter -->
            <div class="filter-group">
              <label>Format</label>
              <select [(ngModel)]="selectedFormat" (change)="applyFilters()">
                <option value="">All Formats</option>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="filter-group">
              <label>Status</label>
              <select [(ngModel)]="selectedStatus" (change)="applyFilters()">
                <option value="">All</option>
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>

            @if (hasActiveFilters()) {
              <button class="clear-filters" (click)="clearFilters()">
                <span class="material-icons">close</span>
                Clear Filters
              </button>
            }
          </div>

          <!-- Active Filters -->
          @if (hasActiveFilters()) {
            <div class="active-filters">
              @if (selectedGenre) {
                <span class="filter-chip">
                  {{ selectedGenre }}
                  <button (click)="selectedGenre = ''; applyFilters()">
                    <span class="material-icons">close</span>
                  </button>
                </span>
              }
              @if (selectedLanguage) {
                <span class="filter-chip">
                  {{ selectedLanguage }}
                  <button (click)="selectedLanguage = ''; applyFilters()">
                    <span class="material-icons">close</span>
                  </button>
                </span>
              }
              @if (selectedFormat) {
                <span class="filter-chip">
                  {{ selectedFormat }}
                  <button (click)="selectedFormat = ''; applyFilters()">
                    <span class="material-icons">close</span>
                  </button>
                </span>
              }
            </div>
          }
        </div>

        <!-- Movie Grid -->
        @if (isLoading()) {
          <div class="movie-grid">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="skeleton-card">
                <app-skeleton width="100%" height="300px" borderRadius="12px" />
                <app-skeleton width="80%" height="20px" borderRadius="4px" />
                <app-skeleton width="60%" height="16px" borderRadius="4px" />
              </div>
            }
          </div>
        } @else if (movies().length === 0) {
          <div class="no-results">
            <span class="material-icons">movie</span>
            <h3>No movies found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button (click)="clearFilters()" class="btn-primary">Clear Filters</button>
          </div>
        } @else {
          <div class="movie-grid">
            @for (movie of movies(); track movie.id) {
              <app-movie-card [movie]="movie" />
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .movie-list-page {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);
    }

    .filters-section {
      margin-bottom: $spacing-2xl;
    }

    .filter-header {
      @include flex-between;
      margin-bottom: $spacing-xl;

      h1 {
        font-size: $font-size-2xl;
      }

      .results-count {
        color: $text-muted;
      }
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-md;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      label {
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      select {
        padding: $spacing-sm $spacing-md;
        background: $background-light;
        border: 1px solid transparent;
        border-radius: $radius-md;
        color: $text-primary;
        font-size: $font-size-sm;
        min-width: 150px;
        cursor: pointer;

        &:focus {
          border-color: $primary;
          outline: none;
        }
      }
    }

    .clear-filters {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;
      background: rgba($error, 0.2);
      border: none;
      border-radius: $radius-md;
      color: $error;
      font-size: $font-size-sm;
      cursor: pointer;

      &:hover {
        background: rgba($error, 0.3);
      }

      .material-icons {
        font-size: 16px;
      }
    }

    .active-filters {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      margin-top: $spacing-md;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-xs $spacing-md;
      background: $background-light;
      border-radius: $radius-full;
      font-size: $font-size-sm;

      button {
        display: flex;
        padding: 2px;
        background: none;
        border: none;
        color: $text-muted;
        cursor: pointer;

        &:hover {
          color: $error;
        }

        .material-icons {
          font-size: 14px;
        }
      }
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
      align-items: start;

      @include sm {
        grid-template-columns: repeat(3, 1fr);
      }

      @include md {
        grid-template-columns: repeat(4, 1fr);
        gap: $spacing-lg;
      }

      @include xl {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    .no-results {
      text-align: center;
      padding: $spacing-3xl;

      .material-icons {
        font-size: 64px;
        color: $text-muted;
        margin-bottom: $spacing-lg;
      }

      h3 {
        margin-bottom: $spacing-sm;
      }

      p {
        color: $text-muted;
        margin-bottom: $spacing-xl;
      }

      .btn-primary {
        @include button-primary;
      }
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies = signal<Movie[]>([]);
  genres = signal<string[]>([]);
  languages = signal<string[]>([]);
  isLoading = signal(true);

  selectedGenre = '';
  selectedLanguage = '';
  selectedFormat = '';
  selectedStatus = '';

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load filter options
    this.movieService.getGenres().subscribe(g => this.genres.set(g));
    this.movieService.getLanguages().subscribe(l => this.languages.set(l));

    // Get query params
    this.route.queryParams.subscribe(params => {
      this.selectedStatus = params['status'] || '';
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.isLoading.set(true);

    const filters: MovieFilters = {};

    if (this.selectedGenre) {
      filters.genres = [this.selectedGenre];
    }
    if (this.selectedLanguage) {
      filters.languages = [this.selectedLanguage];
    }
    if (this.selectedFormat) {
      filters.formats = [this.selectedFormat as MovieFormat];
    }
    if (this.selectedStatus) {
      filters.status = this.selectedStatus as 'now_showing' | 'coming_soon';
    }

    this.movieService.getMovies(filters).subscribe(movies => {
      this.movies.set(movies);
      this.isLoading.set(false);
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedGenre || this.selectedLanguage || this.selectedFormat || this.selectedStatus);
  }

  clearFilters(): void {
    this.selectedGenre = '';
    this.selectedLanguage = '';
    this.selectedFormat = '';
    this.selectedStatus = '';
    this.applyFilters();
  }
}
