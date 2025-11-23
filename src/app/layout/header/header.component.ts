import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MovieService } from '../../core/services/movie.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  showSearchResults = signal(false);
  showMobileMenu = signal(false);
  showNotifications = signal(false);
  showUserMenu = signal(false);

  private searchSubject = new Subject<string>();

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private movieService: MovieService,
    private router: Router
  ) {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      if (query.trim().length > 1) {
        this.movieService.searchMovies(query).subscribe(results => {
          this.searchResults.set(results);
          this.showSearchResults.set(true);
        });
      } else {
        this.searchResults.set([]);
        this.showSearchResults.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  onSearchFocus(): void {
    if (this.searchResults().length > 0) {
      this.showSearchResults.set(true);
    }
  }

  onSearchBlur(): void {
    // Delay to allow click on results
    setTimeout(() => this.showSearchResults.set(false), 200);
  }

  selectSearchResult(movieId: string): void {
    this.showSearchResults.set(false);
    this.searchQuery.set('');
    this.router.navigate(['/movies', movieId]);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
  }

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    this.showUserMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
  }

  markAllNotificationsRead(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.notificationService.markAllAsRead(String(user.id)).subscribe();
    }
  }
}
