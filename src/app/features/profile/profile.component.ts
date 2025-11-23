import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';
import { ToastService } from '../../core/services/toast.service';
import { User, Booking, Payment } from '../../shared/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  activeTab = signal<'profile' | 'bookings' | 'payments'>('profile');
  isEditing = signal(false);
  isSaving = signal(false);

  user = signal<User | null>(null);
  bookings = signal<Booking[]>([]);
  payments = signal<Payment[]>([]);

  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.user.set(user);
      this.profileForm.patchValue({
        name: user.fullName,
        email: user.email,
        phone: user.phone || ''
      });
      this.loadUserData(String(user.id));
    }
  }

  private loadUserData(userId: string): void {
    this.bookingService.getUserBookings(userId).subscribe(bookings => {
      this.bookings.set(bookings);
    });

    this.paymentService.getUserPayments(userId).subscribe(payments => {
      this.payments.set(payments);
    });
  }

  setTab(tab: 'profile' | 'bookings' | 'payments'): void {
    this.activeTab.set(tab);
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) {
      // Reset form on cancel
      const user = this.authService.currentUser();
      if (user) {
        this.profileForm.patchValue({
          name: user.fullName,
          email: user.email,
          phone: user.phone || ''
        });
      }
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    const updates = this.profileForm.value;

    this.authService.updateProfile(updates).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.toastService.success('Profile updated successfully');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.error('Failed to update profile');
      }
    });
  }

  getBookingStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-success';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      case 'refund_processing': return 'status-processing';
      default: return 'status-pending';
    }
  }

  formatPaymentMethod(method: string): string {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'netbanking': return 'Net Banking';
      default: return method;
    }
  }

  formatSeats(seats: { row: string; number: number }[]): string {
    return seats.map(s => s.row + s.number).join(', ');
  }
}
