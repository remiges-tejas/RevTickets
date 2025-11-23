import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Review, CreateReviewRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_URL = '/api/reviews';

  // Mock reviews storage
  private mockReviews: Review[] = [
    {
      id: 'r1',
      movieId: '1',
      userId: '2',
      userName: 'John D.',
      rating: 5,
      title: 'Mind-bending masterpiece!',
      content: 'Christopher Nolan has outdone himself with this incredible journey through dreams within dreams. The visual effects are stunning and the plot keeps you guessing until the very end.',
      likes: 234,
      isLiked: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'r2',
      movieId: '1',
      userId: '3',
      userName: 'Sarah M.',
      rating: 4,
      title: 'Great but complex',
      content: 'Absolutely loved the concept and execution. The only reason for 4 stars is that it can be confusing on first watch. Definitely needs a rewatch to fully appreciate.',
      likes: 156,
      isLiked: false,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: 'r3',
      movieId: '2',
      userId: '4',
      userName: 'Mike R.',
      rating: 5,
      title: 'Best superhero movie ever',
      content: 'Heath Ledger\'s Joker is legendary. This movie transcends the superhero genre and delivers a compelling crime drama that keeps you on the edge of your seat.',
      likes: 512,
      isLiked: false,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: 'r4',
      movieId: '3',
      userId: '5',
      userName: 'Emily K.',
      rating: 5,
      title: 'Emotional and visually stunning',
      content: 'Interstellar is more than just a sci-fi movie. It\'s a story about love, sacrifice, and the human spirit. The visuals are breathtaking and the score by Hans Zimmer is perfection.',
      likes: 389,
      isLiked: false,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  constructor(private http: HttpClient) {}

  // Get reviews for a movie
  getReviewsByMovie(movieId: string): Observable<Review[]> {
    const reviews = this.mockReviews
      .filter(r => r.movieId === movieId)
      .sort((a, b) => b.likes - a.likes);
    return of(reviews).pipe(delay(500));
  }

  // Create a new review
  createReview(request: CreateReviewRequest, userId: string, userName: string): Observable<Review> {
    const newReview: Review = {
      id: 'r' + Date.now(),
      movieId: request.movieId,
      userId,
      userName,
      rating: request.rating,
      title: request.title,
      content: request.content,
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockReviews.push(newReview);
    return of(newReview).pipe(delay(500));
  }

  // Like/unlike a review
  toggleLike(reviewId: string): Observable<Review> {
    const index = this.mockReviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      const review = this.mockReviews[index];
      this.mockReviews[index] = {
        ...review,
        isLiked: !review.isLiked,
        likes: review.isLiked ? review.likes - 1 : review.likes + 1,
        updatedAt: new Date()
      };
      return of(this.mockReviews[index]).pipe(delay(200));
    }
    throw new Error('Review not found');
  }

  // Update review
  updateReview(reviewId: string, updates: Partial<CreateReviewRequest>): Observable<Review> {
    const index = this.mockReviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      this.mockReviews[index] = {
        ...this.mockReviews[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockReviews[index]).pipe(delay(500));
    }
    throw new Error('Review not found');
  }

  // Delete review
  deleteReview(reviewId: string): Observable<void> {
    const index = this.mockReviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      this.mockReviews.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }

  // Get user's reviews
  getUserReviews(userId: string): Observable<Review[]> {
    const reviews = this.mockReviews.filter(r => r.userId === userId);
    return of(reviews).pipe(delay(500));
  }
}
