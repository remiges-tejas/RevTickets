import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { Notification, NotificationType } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = '/api/notifications';

  // Notifications state
  private notificationsSignal = signal<Notification[]>([
    {
      id: 'n1',
      userId: '1',
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: 'Your booking for Inception at PVR Cinemas has been confirmed. Booking ID: RTK2024001',
      data: { bookingId: 'b1' },
      isRead: false,
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'n2',
      userId: '1',
      type: 'offer',
      title: 'Weekend Special!',
      message: 'Get 20% off on all bookings this weekend. Use code: WEEKEND20',
      isRead: false,
      createdAt: new Date('2024-01-14T09:00:00')
    },
    {
      id: 'n3',
      userId: '1',
      type: 'payment_success',
      title: 'Payment Successful',
      message: 'Payment of ₹710.36 completed successfully. Transaction ID: TXN20240115001',
      data: { paymentId: 'p1' },
      isRead: true,
      createdAt: new Date('2024-01-15T10:28:00')
    }
  ]);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = computed(() =>
    this.notificationsSignal().filter(n => !n.isRead).length
  );

  constructor(private http: HttpClient) {}

  // Get all notifications for user
  getNotifications(userId: string): Observable<Notification[]> {
    const notifications = this.notificationsSignal().filter(n => n.userId === userId);
    return of(notifications.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )).pipe(delay(300));
  }

  // Mark notification as read
  markAsRead(notificationId: string): Observable<void> {
    const notifications = this.notificationsSignal();
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const updated = [...notifications];
      updated[index] = { ...updated[index], isRead: true };
      this.notificationsSignal.set(updated);
    }
    return of(void 0).pipe(delay(200));
  }

  // Mark all as read
  markAllAsRead(userId: string): Observable<void> {
    const notifications = this.notificationsSignal().map(n =>
      n.userId === userId ? { ...n, isRead: true } : n
    );
    this.notificationsSignal.set(notifications);
    return of(void 0).pipe(delay(300));
  }

  // Add new notification (called internally when events happen)
  addNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, unknown>
  ): void {
    const newNotification: Notification = {
      id: 'n' + Date.now(),
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: new Date()
    };

    this.notificationsSignal.update(notifications => [newNotification, ...notifications]);
  }

  // Delete notification
  deleteNotification(notificationId: string): Observable<void> {
    const notifications = this.notificationsSignal().filter(n => n.id !== notificationId);
    this.notificationsSignal.set(notifications);
    return of(void 0).pipe(delay(200));
  }

  // Clear all notifications
  clearAll(userId: string): Observable<void> {
    const notifications = this.notificationsSignal().filter(n => n.userId !== userId);
    this.notificationsSignal.set(notifications);
    return of(void 0).pipe(delay(300));
  }
}
