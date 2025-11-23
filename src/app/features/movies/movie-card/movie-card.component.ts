import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../shared/models';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/movies', movie.id]" class="movie-card">
      <div class="poster-wrapper">
        <img [src]="movie.posterUrl" [alt]="movie.title" class="poster" (error)="onImageError($event)" />
        <div class="overlay">
          <span class="material-icons">play_circle</span>
        </div>
        @if (movie.rating > 0) {
          <div class="rating-badge">
            <span class="material-icons">star</span>
            {{ movie.rating.toFixed(1) }}
          </div>
        }
        @if (movie.status === 'coming_soon') {
          <div class="status-badge coming-soon">Coming Soon</div>
        }
      </div>
      <div class="card-content">
        <h3 class="title">{{ movie.title }}</h3>
        <p class="genres">{{ movie.genres?.slice(0, 2).join(', ') || 'Drama' }}</p>
        <div class="meta">
          <span class="language">{{ movie.language || 'English' }}</span>
          <span class="dot"></span>
          <span class="format">{{ movie.format?.join('/') || '2D' }}</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .movie-card {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      @include card;
    }

    .poster-wrapper {
      position: relative;
      width: 100%;
      padding-top: 150%; // 2:3 aspect ratio (3/2 * 100)
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);

      .poster {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        transition: transform $transition-slow;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        @include flex-center;
        opacity: 0;
        transition: opacity $transition-normal;

        .material-icons {
          font-size: 48px;
          color: $text-primary;
        }
      }

      &:hover {
        .poster {
          transform: scale(1.05);
        }

        .overlay {
          opacity: 1;
        }
      }

      .rating-badge {
        position: absolute;
        top: $spacing-sm;
        right: $spacing-sm;
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xs $spacing-sm;
        background: rgba(0, 0, 0, 0.8);
        border-radius: $radius-sm;
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;
        color: $text-primary;

        .material-icons {
          font-size: 14px;
          color: $warning;
        }
      }

      .status-badge {
        position: absolute;
        bottom: $spacing-sm;
        left: $spacing-sm;
        padding: $spacing-xs $spacing-sm;
        border-radius: $radius-sm;
        font-size: $font-size-xs;
        font-weight: $font-weight-semibold;
        text-transform: uppercase;

        &.coming-soon {
          background: $info;
          color: $text-primary;
        }
      }
    }

    .card-content {
      padding: $spacing-md;

      .title {
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        color: $text-primary;
        margin-bottom: $spacing-xs;
        @include text-truncate;
      }

      .genres {
        font-size: $font-size-sm;
        color: $text-muted;
        margin-bottom: $spacing-sm;
        @include text-truncate;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        font-size: $font-size-xs;
        color: $text-secondary;

        .dot {
          width: 4px;
          height: 4px;
          background: $text-muted;
          border-radius: 50%;
        }
      }
    }
  `]
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image';
  }
}
