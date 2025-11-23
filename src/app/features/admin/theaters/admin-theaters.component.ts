import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-theaters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="container">
        <h1>Manage Theaters</h1>
        <div class="placeholder">
          <span class="material-icons">business</span>
          <h3>Theater Management</h3>
          <p>Configure theaters, screens, and seat layouts</p>
          <p class="note">This feature would include:</p>
          <ul>
            <li>Add and manage theater locations</li>
            <li>Configure screens with seat layouts</li>
            <li>Set pricing tiers (Premium, Executive, Normal)</li>
            <li>Manage theater amenities</li>
            <li>Visual seat layout editor</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;

    .admin-page {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);

      h1 {
        font-size: 1.5rem;
        margin-bottom: 2rem;
      }
    }

    .placeholder {
      text-align: center;
      padding: 4rem 2rem;
      background: #1f1f1f;
      border-radius: 12px;

      .material-icons {
        font-size: 64px;
        color: #757575;
        margin-bottom: 1rem;
      }

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        color: #b3b3b3;
        margin-bottom: 1rem;
      }

      .note {
        font-weight: 600;
        color: #fff;
      }

      ul {
        display: inline-block;
        text-align: left;
        color: #b3b3b3;

        li {
          padding: 0.5rem 0;
        }
      }
    }
  `]
})
export class AdminTheatersComponent {}
