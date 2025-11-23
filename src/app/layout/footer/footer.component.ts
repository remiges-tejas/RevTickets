import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-brand">
            <a routerLink="/" class="logo">
              Rev<span class="accent">Tickets</span>
            </a>
            <p class="tagline">
              Your gateway to the best movie experience. Book tickets for the latest movies at theaters near you.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/movies">Movies</a></li>
              <li><a routerLink="/profile">My Bookings</a></li>
            </ul>
          </div>

          <!-- Help -->
          <div class="footer-section">
            <h4>Help</h4>
            <ul>
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/contact">Contact Us</a></li>
              <li><a routerLink="/faq">FAQs</a></li>
              <li><a routerLink="/terms">Terms of Use</a></li>
              <li><a routerLink="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <!-- Social -->
          <div class="footer-section">
            <h4>Connect</h4>
            <div class="social-links">
              <a href="#" aria-label="Facebook">
                <span class="material-icons">facebook</span>
              </a>
              <a href="#" aria-label="Twitter">
                <span class="material-icons">flutter_dash</span>
              </a>
              <a href="#" aria-label="Instagram">
                <span class="material-icons">photo_camera</span>
              </a>
              <a href="#" aria-label="YouTube">
                <span class="material-icons">smart_display</span>
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} RevTickets. All rights reserved.</p>
          <p>Made with <span class="heart">♥</span> for movie lovers</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    @use '../../../styles/mixins' as *;

    .footer {
      background: $background-medium;
      padding: $spacing-3xl 0 $spacing-xl;
      margin-top: auto;
    }

    .footer-container {
      @include container;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-xl;

      @include md {
        grid-template-columns: repeat(2, 1fr);
      }

      @include lg {
        grid-template-columns: 2fr 1fr 1fr 1fr;
      }
    }

    .footer-brand {
      .logo {
        font-size: $font-size-2xl;
        font-weight: $font-weight-bold;
        color: $text-primary;
        text-decoration: none;

        .accent {
          color: $primary;
        }
      }

      .tagline {
        margin-top: $spacing-md;
        color: $text-muted;
        font-size: $font-size-sm;
        line-height: 1.6;
      }
    }

    .footer-section {
      h4 {
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        margin-bottom: $spacing-md;
        color: $text-primary;
      }

      ul {
        list-style: none;

        li {
          margin-bottom: $spacing-sm;

          a {
            color: $text-muted;
            font-size: $font-size-sm;
            transition: color $transition-fast;

            &:hover {
              color: $primary;
            }
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: $spacing-md;

      a {
        @include flex-center;
        width: 40px;
        height: 40px;
        background: $background-light;
        border-radius: $radius-full;
        color: $text-muted;
        transition: all $transition-fast;

        &:hover {
          background: $primary;
          color: $text-primary;
        }

        .material-icons {
          font-size: 20px;
        }
      }
    }

    .footer-bottom {
      margin-top: $spacing-3xl;
      padding-top: $spacing-xl;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      text-align: center;

      @include md {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }

      p {
        margin: 0;
        color: $text-muted;
        font-size: $font-size-sm;
      }

      .heart {
        color: $primary;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
