import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="toast-icon material-icons">
            @switch (toast.type) {
              @case ('success') { check_circle }
              @case ('error') { error }
              @case ('warning') { warning }
              @default { info }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <span class="material-icons">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;

    .toast-container {
      position: fixed;
      bottom: $spacing-xl;
      right: $spacing-xl;
      z-index: $z-toast;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md $spacing-lg;
      background: $background-medium;
      border-radius: $radius-md;
      box-shadow: $shadow-lg;
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s ease;

      &-success {
        border-left: 4px solid $success;

        .toast-icon { color: $success; }
      }

      &-error {
        border-left: 4px solid $error;

        .toast-icon { color: $error; }
      }

      &-warning {
        border-left: 4px solid $warning;

        .toast-icon { color: $warning; }
      }

      &-info {
        border-left: 4px solid $info;

        .toast-icon { color: $info; }
      }
    }

    .toast-icon {
      font-size: 24px;
    }

    .toast-message {
      flex: 1;
      font-size: $font-size-sm;
      color: $text-primary;
    }

    .toast-close {
      display: flex;
      padding: $spacing-xs;
      background: none;
      border: none;
      color: $text-muted;
      cursor: pointer;
      border-radius: $radius-sm;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: $text-primary;
      }

      .material-icons {
        font-size: 18px;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
