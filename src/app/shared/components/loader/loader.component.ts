import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (overlay) {
      <div class="loader-overlay">
        <div class="loader-content">
          <div class="spinner" [class]="'spinner-' + size"></div>
          @if (message) {
            <p class="loader-message">{{ message }}</p>
          }
        </div>
      </div>
    } @else {
      <div class="loader-inline" [class]="'loader-' + size">
        <div class="spinner" [class]="'spinner-' + size"></div>
        @if (message) {
          <p class="loader-message">{{ message }}</p>
        }
      </div>
    }
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .loader-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      @include flex-center;
      z-index: $z-modal;
    }

    .loader-content,
    .loader-inline {
      @include flex-column;
      align-items: center;
      gap: $spacing-md;
    }

    .spinner {
      border: 3px solid $background-light;
      border-top-color: $primary;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;

      &-sm {
        width: 20px;
        height: 20px;
        border-width: 2px;
      }

      &-md {
        width: 32px;
        height: 32px;
      }

      &-lg {
        width: 48px;
        height: 48px;
        border-width: 4px;
      }
    }

    .loader-message {
      color: $text-secondary;
      font-size: $font-size-sm;
      margin: 0;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  @Input() overlay = false;
}
