import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking, PaymentMethod } from '../../../shared/models';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  booking = signal<Booking | null>(null);
  isLoading = signal(true);
  isProcessing = signal(false);

  selectedMethod = signal<PaymentMethod>('card');
  cardForm: FormGroup;
  upiForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      cardName: ['', Validators.required]
    });

    this.upiForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern(/^[\w.-]+@[\w]+$/)]]
    });
  }

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.loadBookingData(bookingId);
    }
  }

  private loadBookingData(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe(booking => {
      if (booking) {
        this.booking.set(booking);
        this.isLoading.set(false);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod.set(method);
  }

  processPayment(): void {
    const booking = this.booking();
    if (!booking) return;

    // Validate form based on method
    if (this.selectedMethod() === 'card' && this.cardForm.invalid) {
      this.toastService.error('Please fill in all card details correctly');
      return;
    }

    if (this.selectedMethod() === 'upi' && this.upiForm.invalid) {
      this.toastService.error('Please enter a valid UPI ID');
      return;
    }

    this.isProcessing.set(true);

    // Get payment details
    let details = {};
    if (this.selectedMethod() === 'card') {
      const cardNum = this.cardForm.value.cardNumber;
      details = {
        cardLast4: cardNum.slice(-4),
        cardType: this.getCardType(cardNum)
      };
    } else if (this.selectedMethod() === 'upi') {
      details = { upiId: this.upiForm.value.upiId };
    }

    // Process payment
    this.paymentService.processPayment(
      booking.id,
      booking.totalAmount,
      this.selectedMethod(),
      details
    ).subscribe({
      next: (payment) => {
        // Update booking status
        this.bookingService.updateBookingStatus(booking.id, 'confirmed', payment.id).subscribe({
          next: () => {
            // Add notification
            const user = this.authService.currentUser();
            if (user) {
              this.notificationService.addNotification(
                String(user.id),
                'booking_confirmed',
                'Booking Confirmed!',
                `Your booking for has been confirmed. Booking ID: ${booking.bookingNumber}`,
                { bookingId: booking.id }
              );
            }

            this.toastService.success('Payment successful!');
            this.router.navigate(['/booking', booking.id, 'confirmation']);
          }
        });
      },
      error: () => {
        this.isProcessing.set(false);
        this.toastService.error('Payment failed. Please try again.');
      }
    });
  }

  private getCardType(number: string): string {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Card';
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 16);
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
  }
}
