import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div class="contact-grid">
        <div class="contact-info">
          <h2>Get in Touch</h2>

          <div class="info-item">
            <span class="material-icons">location_on</span>
            <div>
              <h3>Address</h3>
              <p>123 Cinema Street, Movie District<br>Mumbai, Maharashtra 400001</p>
            </div>
          </div>

          <div class="info-item">
            <span class="material-icons">phone</span>
            <div>
              <h3>Phone</h3>
              <p>+91 1800-123-4567 (Toll Free)</p>
              <p>+91 22-1234-5678</p>
            </div>
          </div>

          <div class="info-item">
            <span class="material-icons">email</span>
            <div>
              <h3>Email</h3>
              <p>support&#64;revtickets.com</p>
              <p>help&#64;revtickets.com</p>
            </div>
          </div>

          <div class="info-item">
            <span class="material-icons">schedule</span>
            <div>
              <h3>Support Hours</h3>
              <p>Monday - Sunday: 9:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <h2>Send us a Message</h2>

          @if (submitted()) {
            <div class="success-message">
              <span class="material-icons">check_circle</span>
              <p>Thank you for your message! We'll get back to you soon.</p>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" [(ngModel)]="form.name" name="name" required>
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" [(ngModel)]="form.email" name="email" required>
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <select id="subject" [(ngModel)]="form.subject" name="subject" required>
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Issue</option>
                  <option value="refund">Refund Request</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" [(ngModel)]="form.message" name="message" rows="5" required></textarea>
              </div>

              <button type="submit" class="btn-primary">Send Message</button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .page-container {
      @include container;
      padding: $spacing-2xl $spacing-md;
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

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-3xl;

      @include lg {
        grid-template-columns: 1fr 1fr;
      }
    }

    .contact-info {
      h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-xl;
        color: $primary;
      }
    }

    .info-item {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-xl;

      .material-icons {
        font-size: 24px;
        color: $primary;
        margin-top: 4px;
      }

      h3 {
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        margin-bottom: $spacing-xs;
        color: $text-primary;
      }

      p {
        margin: 0;
        color: $text-muted;
        font-size: $font-size-sm;
        line-height: 1.6;
      }
    }

    .contact-form {
      background: $background-medium;
      padding: $spacing-xl;
      border-radius: $radius-lg;

      h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-xl;
        color: $text-primary;
      }
    }

    .form-group {
      margin-bottom: $spacing-lg;

      label {
        display: block;
        margin-bottom: $spacing-sm;
        font-weight: $font-weight-medium;
        color: $text-secondary;
      }

      input, select, textarea {
        @include input-base;
        width: 100%;
      }

      textarea {
        resize: vertical;
        min-height: 120px;
      }
    }

    .btn-primary {
      @include button-primary;
      width: 100%;
    }

    .success-message {
      text-align: center;
      padding: $spacing-3xl;

      .material-icons {
        font-size: 64px;
        color: $success;
        margin-bottom: $spacing-lg;
      }

      p {
        color: $text-secondary;
        font-size: $font-size-lg;
      }
    }
  `]
})
export class ContactComponent {
  submitted = signal(false);

  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    // Simulate form submission
    this.submitted.set(true);
  }
}
