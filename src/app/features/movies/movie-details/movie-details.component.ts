import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { ShowService } from '../../../core/services/show.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Movie, Show, Review } from '../../../shared/models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StarRatingComponent, LoaderComponent, SafeUrlPipe],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  movie = signal<Movie | null>(null);
  shows = signal<Show[]>([]);
  reviews = signal<Review[]>([]);
  isLoading = signal(true);

  selectedDate = signal<Date>(new Date());
  availableDates: Date[] = [];

  // Review form
  showReviewForm = signal(false);
  newReviewRating = 0;
  newReviewTitle = '';
  newReviewContent = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private showService: ShowService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private toastService: ToastService
  ) {
    // Generate available dates (next 7 days)
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      this.availableDates.push(date);
    }
  }

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovieData(movieId);
    }
  }

  private loadMovieData(movieId: string): void {
    // Load movie details
    this.movieService.getMovieById(movieId).subscribe(movie => {
      if (movie) {
        this.movie.set(movie);
        this.loadShows(movieId);
        this.loadReviews(movieId);
      } else {
        this.router.navigate(['/movies']);
      }
      this.isLoading.set(false);
    });
  }

  private loadShows(movieId: string): void {
    this.showService.getShowsByMovie(movieId, { date: this.selectedDate() }).subscribe(shows => {
      this.shows.set(shows);
    });
  }

  private loadReviews(movieId: string): void {
    this.reviewService.getReviewsByMovie(movieId).subscribe(reviews => {
      this.reviews.set(reviews);
    });
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    const movie = this.movie();
    if (movie) {
      this.loadShows(movie.id);
    }
  }

  formatDate(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  }

  getShowsByTheater(): { theater: any; shows: Show[] }[] {
    const showsByTheater = new Map<string, { theater: any; shows: Show[] }>();

    this.shows().forEach(show => {
      if (!showsByTheater.has(show.theaterId)) {
        showsByTheater.set(show.theaterId, {
          theater: show.theater,
          shows: []
        });
      }
      showsByTheater.get(show.theaterId)!.shows.push(show);
    });

    return Array.from(showsByTheater.values());
  }

  getShowStatusClass(show: Show): string {
    switch (show.status) {
      case 'filling_fast': return 'filling-fast';
      case 'almost_full': return 'almost-full';
      case 'sold_out': return 'sold-out';
      default: return 'available';
    }
  }

  selectShow(show: Show): void {
    if (show.status === 'sold_out') {
      this.toastService.warning('This show is sold out');
      return;
    }
    this.router.navigate(['/show', show.id, 'seats']);
  }

  // Review methods
  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please login to write a review');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.showReviewForm.update(v => !v);
  }

  submitReview(): void {
    if (!this.newReviewRating || !this.newReviewContent) {
      this.toastService.error('Please provide a rating and review');
      return;
    }

    const user = this.authService.currentUser();
    if (!user || !this.movie()) return;

    this.reviewService.createReview(
      {
        movieId: this.movie()!.id,
        rating: this.newReviewRating,
        title: this.newReviewTitle,
        content: this.newReviewContent
      },
      String(user.id),
      user.fullName
    ).subscribe(review => {
      this.reviews.update(reviews => [review, ...reviews]);
      this.newReviewRating = 0;
      this.newReviewTitle = '';
      this.newReviewContent = '';
      this.showReviewForm.set(false);
      this.toastService.success('Review submitted successfully!');
    });
  }

  toggleLike(review: Review): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please login to like reviews');
      return;
    }

    this.reviewService.toggleLike(review.id).subscribe(updatedReview => {
      this.reviews.update(reviews =>
        reviews.map(r => r.id === updatedReview.id ? updatedReview : r)
      );
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  scrollToShowtimes(): void {
    const element = document.getElementById('showtimes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
