import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [class.readonly]="readonly">
      @for (star of stars; track star) {
        <button
          type="button"
          class="star"
          [class.filled]="star <= (hoverRating || rating)"
          [class.half]="star - 0.5 === rating && !hoverRating"
          (click)="onStarClick(star)"
          (mouseenter)="onStarHover(star)"
          (mouseleave)="onStarLeave()"
          [disabled]="readonly"
        >
          <span class="material-icons">
            {{ star <= (hoverRating || rating) ? 'star' : 'star_border' }}
          </span>
        </button>
      }
      @if (showValue) {
        <span class="rating-value">{{ rating.toFixed(1) }}</span>
      }
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;

    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;

      &.readonly {
        .star {
          cursor: default;
          pointer-events: none;
        }
      }
    }

    .star {
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      transition: transform 0.1s ease;

      &:hover:not(:disabled) {
        transform: scale(1.1);
      }

      .material-icons {
        font-size: 24px;
        color: $text-muted;
      }

      &.filled .material-icons {
        color: $warning;
      }
    }

    .rating-value {
      margin-left: $spacing-sm;
      font-weight: $font-weight-semibold;
      color: $text-primary;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() readonly = false;
  @Input() showValue = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating = 0;

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(star);
    }
  }

  onStarHover(star: number): void {
    if (!this.readonly) {
      this.hoverRating = star;
    }
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }
}
