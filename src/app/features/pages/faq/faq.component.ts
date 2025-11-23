import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions</p>
      </div>

      <div class="faq-list">
        @for (faq of faqs; track faq.question; let i = $index) {
          <div class="faq-item" [class.active]="activeIndex() === i">
            <button class="faq-question" (click)="toggle(i)">
              <span>{{ faq.question }}</span>
              <span class="material-icons">{{ activeIndex() === i ? 'expand_less' : 'expand_more' }}</span>
            </button>
            @if (activeIndex() === i) {
              <div class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            }
          </div>
        }
      </div>

      <div class="still-help">
        <h2>Still need help?</h2>
        <p>Can't find what you're looking for? Our support team is here to help.</p>
        <a routerLink="/contact" class="btn-primary">Contact Support</a>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .page-container {
      @include container;
      padding: $spacing-2xl $spacing-md;
      max-width: 800px;
    }

    .page-header {
      text-align: center;
      margin-bottom: $spacing-3xl;

      h1 {
        font-size: $font-size-4xl;
        margin-bottom: $spacing-md;
        color: $text-primary;
      }

      p {
        font-size: $font-size-lg;
        color: $text-muted;
      }
    }

    .faq-list {
      margin-bottom: $spacing-3xl;
    }

    .faq-item {
      background: $background-medium;
      border-radius: $radius-md;
      margin-bottom: $spacing-md;
      overflow: hidden;

      &.active {
        .faq-question {
          color: $primary;
        }
      }
    }

    .faq-question {
      width: 100%;
      padding: $spacing-lg;
      background: none;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      color: $text-primary;
      text-align: left;

      &:hover {
        color: $primary;
      }

      .material-icons {
        color: $text-muted;
      }
    }

    .faq-answer {
      padding: 0 $spacing-lg $spacing-lg;

      p {
        margin: 0;
        color: $text-secondary;
        line-height: 1.7;
      }
    }

    .still-help {
      text-align: center;
      background: $background-medium;
      padding: $spacing-3xl;
      border-radius: $radius-lg;

      h2 {
        font-size: $font-size-xl;
        margin-bottom: $spacing-md;
        color: $text-primary;
      }

      p {
        color: $text-muted;
        margin-bottom: $spacing-xl;
      }

      .btn-primary {
        @include button-primary;
        display: inline-block;
        padding: $spacing-md $spacing-2xl;
        text-decoration: none;
      }
    }
  `]
})
export class FaqComponent {
  activeIndex = signal<number | null>(null);

  faqs = [
    {
      question: 'How do I book movie tickets?',
      answer: 'Simply browse movies on our homepage, select your preferred movie, choose a showtime and theater, select your seats, and proceed to payment. Your tickets will be sent to your email and will also be available in your profile.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the showtime. Go to your profile, find the booking you want to cancel, and click on "Cancel Booking". Refunds are processed within 5-7 business days.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit/debit cards (Visa, Mastercard, American Express), UPI, net banking, and popular wallets like Paytm, PhonePe, and Google Pay.'
    },
    {
      question: 'How do I get my tickets?',
      answer: 'After successful payment, your e-tickets will be sent to your registered email. You can also view and download them from the "My Bookings" section in your profile. Just show the QR code at the theater.'
    },
    {
      question: 'Can I select my seats?',
      answer: 'Yes! We offer an interactive seat selection feature. Once you choose your showtime, you\'ll see a seat map where you can select your preferred seats based on availability.'
    },
    {
      question: 'Is there a booking fee?',
      answer: 'A small convenience fee is charged per ticket to cover payment processing and platform maintenance. This fee is clearly displayed before you complete your booking.'
    },
    {
      question: 'How do I apply a promo code?',
      answer: 'During checkout, you\'ll find a "Have a promo code?" field. Enter your code and click "Apply" to see your discount reflected in the total amount.'
    },
    {
      question: 'What if the show is cancelled?',
      answer: 'If a show is cancelled by the theater, you will receive a full refund automatically within 5-7 business days. You will also be notified via email and SMS.'
    },
    {
      question: 'Can I book tickets for someone else?',
      answer: 'Yes, you can book tickets for anyone. Just make sure to share the e-ticket (with QR code) with them before the show.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us via email at support@revtickets.com, call our toll-free number 1800-123-4567, or use the Contact Us form on our website. Our support team is available from 9 AM to 11 PM daily.'
    }
  ];

  toggle(index: number) {
    this.activeIndex.set(this.activeIndex() === index ? null : index);
  }
}
