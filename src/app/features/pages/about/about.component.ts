import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>About RevTickets</h1>
        <p>Your trusted partner for movie ticket booking</p>
      </div>

      <div class="content-section">
        <h2>Our Story</h2>
        <p>
          RevTickets was founded with a simple mission: to make movie ticket booking effortless and enjoyable.
          We believe that going to the movies should be a seamless experience from the moment you decide to watch
          a film to the moment you take your seat.
        </p>
        <p>
          Since our inception, we've partnered with hundreds of theaters across the country to bring you
          the latest movies, the best seats, and exclusive offers that make your cinema experience unforgettable.
        </p>
      </div>

      <div class="content-section">
        <h2>What We Offer</h2>
        <div class="features-grid">
          <div class="feature">
            <span class="material-icons">movie</span>
            <h3>Latest Movies</h3>
            <p>Access to all the latest blockbusters and indie films as soon as they release.</p>
          </div>
          <div class="feature">
            <span class="material-icons">event_seat</span>
            <h3>Best Seats</h3>
            <p>Interactive seat selection to choose your perfect viewing spot.</p>
          </div>
          <div class="feature">
            <span class="material-icons">local_offer</span>
            <h3>Exclusive Offers</h3>
            <p>Special discounts and combo deals for our loyal customers.</p>
          </div>
          <div class="feature">
            <span class="material-icons">security</span>
            <h3>Secure Payments</h3>
            <p>Multiple payment options with bank-grade security.</p>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>Our Mission</h2>
        <p>
          To revolutionize the movie-going experience by providing a platform that is fast, reliable,
          and user-friendly. We strive to connect movie lovers with the films they love, making every
          trip to the cinema a memorable one.
        </p>
      </div>

      <div class="cta-section">
        <h2>Ready to Book?</h2>
        <p>Start exploring movies and book your tickets today!</p>
        <a routerLink="/movies" class="btn-primary">Browse Movies</a>
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

    .content-section {
      margin-bottom: $spacing-3xl;

      h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-lg;
        color: $primary;
      }

      p {
        color: $text-secondary;
        line-height: 1.8;
        margin-bottom: $spacing-md;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-xl;
      margin-top: $spacing-xl;
    }

    .feature {
      background: $background-medium;
      padding: $spacing-xl;
      border-radius: $radius-lg;
      text-align: center;

      .material-icons {
        font-size: 48px;
        color: $primary;
        margin-bottom: $spacing-md;
      }

      h3 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-sm;
        color: $text-primary;
      }

      p {
        font-size: $font-size-sm;
        color: $text-muted;
        margin: 0;
      }
    }

    .cta-section {
      text-align: center;
      background: $background-medium;
      padding: $spacing-3xl;
      border-radius: $radius-lg;

      h2 {
        font-size: $font-size-2xl;
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
export class AboutComponent {}
