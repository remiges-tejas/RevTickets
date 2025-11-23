import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Movie } from '../../../../shared/models';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="movie-form-page">
      <div class="container">
        <div class="form-header">
          <a routerLink="/admin/movies" class="back-link">
            <span class="material-icons">arrow_back</span>
            Back to Movies
          </a>
          <h1>{{ isEditMode() ? 'Edit Movie' : 'Add New Movie' }}</h1>
        </div>

        <form [formGroup]="movieForm" (ngSubmit)="onSubmit()" class="movie-form">
          <div class="form-grid">
            <!-- Basic Info -->
            <div class="form-section">
              <h2>Basic Information</h2>

              <div class="form-group">
                <label>Title *</label>
                <input type="text" formControlName="title" placeholder="Movie title" />
              </div>

              <div class="form-group">
                <label>Description *</label>
                <textarea formControlName="description" rows="4" placeholder="Movie description"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Duration (minutes) *</label>
                  <input type="number" formControlName="duration" placeholder="e.g., 150" />
                </div>
                <div class="form-group">
                  <label>Certificate *</label>
                  <select formControlName="certificate">
                    <option value="U">U</option>
                    <option value="UA">UA</option>
                    <option value="A">A</option>
                    <option value="S">S</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Release Date *</label>
                  <input type="date" formControlName="releaseDate" />
                </div>
                <div class="form-group">
                  <label>Status *</label>
                  <select formControlName="status">
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Media -->
            <div class="form-section">
              <h2>Media</h2>

              <div class="form-group">
                <label>Poster URL *</label>
                <input type="url" formControlName="posterUrl" placeholder="https://..." />
              </div>

              <div class="form-group">
                <label>Banner URL *</label>
                <input type="url" formControlName="bannerUrl" placeholder="https://..." />
              </div>

              <div class="form-group">
                <label>Trailer URL</label>
                <input type="url" formControlName="trailerUrl" placeholder="https://youtube.com/..." />
              </div>
            </div>

            <!-- Classification -->
            <div class="form-section">
              <h2>Classification</h2>

              <div class="form-group">
                <label>Genres *</label>
                <input type="text" formControlName="genres" placeholder="Action, Thriller, Sci-Fi" />
                <small>Comma-separated values</small>
              </div>

              <div class="form-group">
                <label>Language *</label>
                <input type="text" formControlName="language" placeholder="English" />
              </div>

              <div class="form-group">
                <label>Formats *</label>
                <input type="text" formControlName="format" placeholder="2D, 3D, IMAX" />
                <small>Comma-separated values</small>
              </div>

              <div class="form-group">
                <label>Director *</label>
                <input type="text" formControlName="director" placeholder="Director name" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/admin/movies" class="btn-cancel">Cancel</a>
            <button type="submit" class="btn-save" [disabled]="isSaving()">
              @if (isSaving()) {
                Saving...
              } @else {
                {{ isEditMode() ? 'Update Movie' : 'Add Movie' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../../styles/variables' as *;
    @use '../../../../../styles/mixins' as *;

    .movie-form-page {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);
    }

    .form-header {
      margin-bottom: $spacing-xl;

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: $spacing-xs;
        color: $text-muted;
        text-decoration: none;
        margin-bottom: $spacing-md;

        &:hover {
          color: $text-primary;
        }

        .material-icons {
          font-size: 20px;
        }
      }

      h1 {
        font-size: $font-size-2xl;
      }
    }

    .movie-form {
      background: $background-medium;
      border-radius: $radius-xl;
      padding: $spacing-xl;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-2xl;

      @include lg {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .form-section {
      h2 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-lg;
        padding-bottom: $spacing-md;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    .form-group {
      margin-bottom: $spacing-lg;

      label {
        display: block;
        margin-bottom: $spacing-sm;
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      input, textarea, select {
        width: 100%;
        padding: $spacing-md;
        background: $background-light;
        border: 2px solid transparent;
        border-radius: $radius-md;
        color: $text-primary;
        font-family: inherit;

        &::placeholder {
          color: $text-muted;
        }

        &:focus {
          outline: none;
          border-color: $primary;
        }
      }

      small {
        display: block;
        margin-top: $spacing-xs;
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-md;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-md;
      margin-top: $spacing-2xl;
      padding-top: $spacing-xl;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .btn-cancel,
      .btn-save {
        padding: $spacing-md $spacing-2xl;
        border-radius: $radius-md;
        font-weight: $font-weight-semibold;
        cursor: pointer;
        text-decoration: none;
      }

      .btn-cancel {
        background: transparent;
        border: 1px solid $text-muted;
        color: $text-secondary;

        &:hover {
          border-color: $text-primary;
          color: $text-primary;
        }
      }

      .btn-save {
        background: $primary;
        border: none;
        color: $text-primary;

        &:hover:not(:disabled) {
          background: $primary-dark;
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode = signal(false);
  isSaving = signal(false);
  movieId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private toastService: ToastService
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      certificate: ['UA', Validators.required],
      releaseDate: ['', Validators.required],
      status: ['now_showing', Validators.required],
      posterUrl: ['', Validators.required],
      bannerUrl: ['', Validators.required],
      trailerUrl: [''],
      genres: ['', Validators.required],
      language: ['', Validators.required],
      format: ['', Validators.required],
      director: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    if (this.movieId) {
      this.isEditMode.set(true);
      this.loadMovie(this.movieId);
    }
  }

  private loadMovie(id: string): void {
    this.movieService.getMovieById(id).subscribe(movie => {
      if (movie) {
        this.movieForm.patchValue({
          title: movie.title,
          description: movie.description,
          duration: movie.duration,
          certificate: movie.certificate,
          releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
          status: movie.status,
          posterUrl: movie.posterUrl,
          bannerUrl: movie.bannerUrl,
          trailerUrl: movie.trailerUrl || '',
          genres: movie.genres.join(', '),
          language: movie.language,
          format: movie.format.join(', '),
          director: movie.director
        });
      }
    });
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.isSaving.set(true);
    const formValue = this.movieForm.value;

    const movieData = {
      ...formValue,
      genres: formValue.genres.split(',').map((g: string) => g.trim()),
      format: formValue.format.split(',').map((f: string) => f.trim()),
      releaseDate: new Date(formValue.releaseDate),
      rating: 0,
      totalRatings: 0,
      cast: []
    };

    if (this.isEditMode() && this.movieId) {
      this.movieService.updateMovie(this.movieId, movieData).subscribe({
        next: () => {
          this.toastService.success('Movie updated successfully');
          this.router.navigate(['/admin/movies']);
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.error('Failed to update movie');
        }
      });
    } else {
      this.movieService.createMovie(movieData).subscribe({
        next: () => {
          this.toastService.success('Movie added successfully');
          this.router.navigate(['/admin/movies']);
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.error('Failed to add movie');
        }
      });
    }
  }
}
