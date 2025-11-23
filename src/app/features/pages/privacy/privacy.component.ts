import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: November 2024</p>
      </div>

      <div class="content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.</p>
          <p>This information may include:</p>
          <ul>
            <li>Name and email address</li>
            <li>Phone number</li>
            <li>Payment information</li>
            <li>Booking history and preferences</li>
            <li>Communications with our support team</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and manage your bookings</li>
            <li>Send you booking confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our services and user experience</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties except to provide our services.
            We may share your information with:
          </p>
          <ul>
            <li>Theater partners to fulfill your bookings</li>
            <li>Payment processors to complete transactions</li>
            <li>Service providers who assist in our operations</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration,
            disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
          </p>
        </section>

        <section>
          <h2>5. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are
            files with small amount of data which may include an anonymous unique identifier.
          </p>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in
            this privacy policy. We may also retain and use your information to comply with legal obligations, resolve disputes, and
            enforce our agreements.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from
            children under 13.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on
            this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy&#64;revtickets.com.
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
export class PrivacyComponent {}
