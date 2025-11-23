import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Terms of Use</h1>
        <p>Last updated: November 2024</p>
      </div>

      <div class="content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RevTickets, you agree to be bound by these Terms of Use and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on RevTickets for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title.
          </p>
          <p>Under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on RevTickets</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2>3. Booking and Cancellation</h2>
          <p>
            All bookings made through RevTickets are subject to availability and confirmation. We reserve the right to refuse any booking
            at our discretion.
          </p>
          <p>
            Cancellations must be made at least 2 hours before the scheduled showtime. Refunds will be processed within 5-7 business days
            to the original payment method. A cancellation fee may apply.
          </p>
        </section>

        <section>
          <h2>4. User Account</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for
            all activities that occur under your account or password.
          </p>
        </section>

        <section>
          <h2>5. Payment Terms</h2>
          <p>
            All payments are processed securely through our payment partners. Prices displayed are inclusive of applicable taxes unless
            otherwise stated. A convenience fee may be added to your booking.
          </p>
        </section>

        <section>
          <h2>6. Disclaimer</h2>
          <p>
            The materials on RevTickets are provided on an 'as is' basis. RevTickets makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2>7. Limitations</h2>
          <p>
            In no event shall RevTickets or its suppliers be liable for any damages (including, without limitation, damages for loss of
            data or profit, or due to business interruption) arising out of the use or inability to use the materials on RevTickets.
          </p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to
            the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
        </section>

        <section>
          <h2>9. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at legal&#64;revtickets.com.
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .page-container {
      @include container;
      padding: $spacing-2xl $spacing-md;
      max-width: 900px;
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
        font-size: $font-size-sm;
        color: $text-muted;
      }
    }

    .content {
      section {
        margin-bottom: $spacing-2xl;

        h2 {
          font-size: $font-size-xl;
          margin-bottom: $spacing-md;
          color: $primary;
        }

        p {
          color: $text-secondary;
          line-height: 1.8;
          margin-bottom: $spacing-md;
        }

        ul {
          margin: $spacing-md 0;
          padding-left: $spacing-xl;
          color: $text-secondary;

          li {
            margin-bottom: $spacing-sm;
            line-height: 1.6;
          }
        }
      }
    }
  `]
})
export class TermsComponent {}
