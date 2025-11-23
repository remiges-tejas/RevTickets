import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Payment, PaymentMethod, PaymentDetails } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = '/api/payments';

  // Mock payments storage
  private mockPayments: Payment[] = [
    {
      id: 'p1',
      bookingId: 'b1',
      userId: '1',
      amount: 710.36,
      currency: 'INR',
      method: 'card',
      status: 'completed',
      transactionId: 'TXN20240115001',
      paymentDetails: {
        cardLast4: '4242',
        cardType: 'Visa'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  constructor(private http: HttpClient) {}

  // Process payment
  processPayment(
    bookingId: string,
    amount: number,
    method: PaymentMethod,
    details: PaymentDetails
  ): Observable<Payment> {
    // Simulate payment processing
    const newPayment: Payment = {
      id: 'p' + Date.now(),
      bookingId,
      userId: '1', // Would come from auth service
      amount,
      currency: 'INR',
      method,
      status: 'completed', // Simulating success
      transactionId: 'TXN' + Date.now(),
      paymentDetails: details,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockPayments.push(newPayment);

    // Simulate processing delay (1-2 seconds)
    return of(newPayment).pipe(delay(1500));
  }

  // Get payment by ID
  getPaymentById(id: string): Observable<Payment | undefined> {
    const payment = this.mockPayments.find(p => p.id === id);
    return of(payment).pipe(delay(300));
  }

  // Get payment by booking ID
  getPaymentByBooking(bookingId: string): Observable<Payment | undefined> {
    const payment = this.mockPayments.find(p => p.bookingId === bookingId);
    return of(payment).pipe(delay(300));
  }

  // Get user payment history
  getUserPayments(userId: string): Observable<Payment[]> {
    const payments = this.mockPayments.filter(p => p.userId === userId);
    return of(payments.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )).pipe(delay(500));
  }

  // Initiate refund
  initiateRefund(paymentId: string, reason: string): Observable<Payment> {
    const index = this.mockPayments.findIndex(p => p.id === paymentId);
    if (index !== -1) {
      this.mockPayments[index] = {
        ...this.mockPayments[index],
        status: 'refund_processing',
        refundDetails: {
          refundId: 'REF' + Date.now(),
          amount: this.mockPayments[index].amount,
          reason,
          status: 'processing',
          initiatedAt: new Date()
        },
        updatedAt: new Date()
      };
      return of(this.mockPayments[index]).pipe(delay(1000));
    }
    throw new Error('Payment not found');
  }

  // Complete refund (simulate async completion)
  completeRefund(paymentId: string): Observable<Payment> {
    const index = this.mockPayments.findIndex(p => p.id === paymentId);
    if (index !== -1 && this.mockPayments[index].refundDetails) {
      this.mockPayments[index] = {
        ...this.mockPayments[index],
        status: 'refunded',
        refundDetails: {
          ...this.mockPayments[index].refundDetails!,
          status: 'completed',
          completedAt: new Date()
        },
        updatedAt: new Date()
      };
      return of(this.mockPayments[index]).pipe(delay(500));
    }
    throw new Error('Payment or refund not found');
  }

  // Get all payments (admin)
  getAllPayments(): Observable<Payment[]> {
    return of(this.mockPayments.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )).pipe(delay(500));
  }
}
