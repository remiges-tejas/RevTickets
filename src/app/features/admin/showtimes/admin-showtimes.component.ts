import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-showtimes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="container">
        <h1>Manage Showtimes</h1>
        <div class="placeholder">
          <span class="material-icons">schedule</span>
          <h3>Showtime Management</h3>
          <p>Schedule and manage movie showtimes across all theaters</p>
          <p class="note">This feature would include:</p>
          <ul>
            <li>Create new showtimes for movies</li>
            <li>Set show date, time, and screen</li>
            <li>Configure pricing by category</li>
            <li>View and manage existing schedules</li>
            <li>Bulk scheduling options</li>
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
export class AdminShowtimesComponent {}
