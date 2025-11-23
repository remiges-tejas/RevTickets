import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Notification } from '../../shared/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="notifications-page">
      <div class="container">
        <div class="page-header">
          <h1>Notifications</h1>
          @if (notificationService.notifications().length > 0) {
            <button class="btn-mark-all" (click)="markAllRead()">
              <span class="material-icons">done_all</span>
              Mark all as read
            </button>
          }
        </div>

        @if (notificationService.notifications().length > 0) {
          <div class="notifications-list">
            @for (notification of notificationService.notifications(); track notification.id) {
              <div
                class="notification-card"
                [class.unread]="!notification.isRead"
                (click)="markAsRead(notification)"
              >
                <div class="notification-icon" [class]="getIconClass(notification.type)">
                  <span class="material-icons">{{ getIcon(notification.type) }}</span>
                </div>
                <div class="notification-content">
                  <h3>{{ notification.title }}</h3>
                  <p>{{ notification.message }}</p>
                  <span class="time">{{ getTimeAgo(notification.createdAt) }}</span>
                </div>
                <button class="btn-delete" (click)="deleteNotification($event, notification.id)">
                  <span class="material-icons">close</span>
                </button>
              </div>
            }
          </div>

          <div class="clear-all">
            <button (click)="clearAll()">Clear All Notifications</button>
          </div>
        } @else {
          <div class="empty-state">
            <span class="material-icons">notifications_none</span>
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    @use '../../../styles/mixins' as *;

    .notifications-page {
      padding: $spacing-2xl 0;
      min-height: calc(100vh - $header-height);
    }

    .page-header {
      @include flex-between;
      margin-bottom: $spacing-xl;

      h1 {
        font-size: $font-size-2xl;
      }

      .btn-mark-all {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm $spacing-md;
        background: $background-light;
        border: none;
        border-radius: $radius-md;
        color: $text-secondary;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          color: $text-primary;
        }

        .material-icons {
          font-size: 18px;
        }
      }
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    .notification-card {
      display: flex;
      align-items: flex-start;
      gap: $spacing-md;
      padding: $spacing-lg;
      background: $background-medium;
      border-radius: $radius-lg;
      cursor: pointer;
      transition: all $transition-fast;

      &:hover {
        background: $background-light;
      }

      &.unread {
        border-left: 3px solid $primary;
        background: rgba($primary, 0.05);
      }
    }

    .notification-icon {
      @include flex-center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      flex-shrink: 0;

      &.booking {
        background: rgba($success, 0.2);
        color: $success;
      }

      &.payment {
        background: rgba($info, 0.2);
        color: $info;
      }

      &.offer {
        background: rgba($warning, 0.2);
        color: $warning;
      }

      &.default {
        background: $background-light;
        color: $text-muted;
      }

      .material-icons {
        font-size: 20px;
      }
    }

    .notification-content {
      flex: 1;

      h3 {
        font-size: $font-size-base;
        margin-bottom: $spacing-xs;
      }

      p {
        font-size: $font-size-sm;
        color: $text-secondary;
        margin-bottom: $spacing-sm;
        line-height: 1.5;
      }

      .time {
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }

    .btn-delete {
      padding: $spacing-xs;
      background: none;
      border: none;
      color: $text-muted;
      cursor: pointer;
      border-radius: $radius-sm;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: $error;
      }

      .material-icons {
        font-size: 18px;
      }
    }

    .clear-all {
      text-align: center;
      margin-top: $spacing-xl;

      button {
        padding: $spacing-sm $spacing-xl;
        background: transparent;
        border: 1px solid $text-muted;
        border-radius: $radius-md;
        color: $text-secondary;
        cursor: pointer;

        &:hover {
          border-color: $error;
          color: $error;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: $spacing-3xl;
      background: $background-medium;
      border-radius: $radius-xl;

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
      }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  constructor(
    public notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Notifications are already loaded via the service
  }

  getIcon(type: string): string {
    switch (type) {
      case 'booking_confirmed': return 'confirmation_number';
      case 'booking_cancelled': return 'cancel';
      case 'payment_success': return 'check_circle';
      case 'payment_failed': return 'error';
      case 'refund_initiated':
      case 'refund_completed': return 'currency_exchange';
      case 'offer': return 'local_offer';
      case 'reminder': return 'alarm';
      default: return 'notifications';
    }
  }

  getIconClass(type: string): string {
    if (type.includes('booking')) return 'booking';
    if (type.includes('payment') || type.includes('refund')) return 'payment';
    if (type === 'offer') return 'offer';
    return 'default';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
  }

  markAllRead(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.notificationService.markAllAsRead(String(user.id)).subscribe();
    }
  }

  deleteNotification(event: Event, id: string): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id).subscribe();
  }

  clearAll(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.notificationService.clearAll(String(user.id)).subscribe();
    }
  }
}
