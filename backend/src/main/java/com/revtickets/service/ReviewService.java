package com.revtickets.service;

import com.revtickets.dto.request.CreateReviewRequest;
import com.revtickets.dto.response.ReviewResponse;
import com.revtickets.entity.mongodb.MovieReview;
import com.revtickets.entity.mysql.Booking;
import com.revtickets.entity.mysql.User;
import com.revtickets.exception.BadRequestException;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mongodb.MovieReviewRepository;
import com.revtickets.repository.mysql.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final MovieReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final MovieService movieService;
    private final ActivityLogService activityLogService;

    public Page<ReviewResponse> getMovieReviews(Long movieId, Long currentUserId, Pageable pageable) {
        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId, pageable)
                .map(review -> ReviewResponse.fromEntity(review, currentUserId));
    }

    public ReviewResponse getUserReviewForMovie(Long movieId, Long userId) {
        return reviewRepository.findByMovieIdAndUserId(movieId, userId)
                .map(review -> ReviewResponse.fromEntity(review, userId))
                .orElse(null);
    }

    @Transactional
    public ReviewResponse createReview(User user, CreateReviewRequest request) {
        // Check if user already reviewed this movie
        if (reviewRepository.existsByMovieIdAndUserId(request.getMovieId(), user.getId())) {
            throw new BadRequestException("You have already reviewed this movie");
        }

        // Check if movie exists
        movieService.getMovieById(request.getMovieId());

        // Check if user has watched the movie (has a confirmed booking)
        List<Booking> userBookings = bookingRepository.findByUserIdAndStatus(
                user.getId(), Booking.BookingStatus.CONFIRMED);

        boolean hasWatched = userBookings.stream()
                .anyMatch(b -> b.getShowTime().getMovie().getId().equals(request.getMovieId()));

        Long bookingId = null;
        if (hasWatched) {
            bookingId = userBookings.stream()
                    .filter(b -> b.getShowTime().getMovie().getId().equals(request.getMovieId()))
                    .findFirst()
                    .map(Booking::getId)
                    .orElse(null);
        }

        MovieReview review = MovieReview.builder()
                .movieId(request.getMovieId())
                .userId(user.getId())
                .userName(user.getFullName())
                .userAvatar(user.getAvatar())
                .rating(request.getRating())
                .title(request.getTitle())
                .content(request.getContent())
                .verified(hasWatched)
                .bookingId(bookingId)
                .build();

        review = reviewRepository.save(review);

        // Update movie rating
        updateMovieRating(request.getMovieId());

        // Log activity
        activityLogService.logReviewPosted(user, review);

        return ReviewResponse.fromEntity(review, user.getId());
    }

    @Transactional
    public ReviewResponse updateReview(String reviewId, User user, CreateReviewRequest request) {
        MovieReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!review.getUserId().equals(user.getId())) {
            throw new BadRequestException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setUpdatedAt(LocalDateTime.now());

        review = reviewRepository.save(review);

        // Update movie rating
        updateMovieRating(request.getMovieId());

        return ReviewResponse.fromEntity(review, user.getId());
    }

    @Transactional
    public void deleteReview(String reviewId, Long userId) {
        MovieReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        Long movieId = review.getMovieId();
        reviewRepository.delete(review);

        // Update movie rating
        updateMovieRating(movieId);
    }

    @Transactional
    public ReviewResponse likeReview(String reviewId, Long userId) {
        MovieReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (review.getLikedByUsers().contains(userId)) {
            // Unlike
            review.getLikedByUsers().remove(userId);
            review.setLikesCount(review.getLikesCount() - 1);
        } else {
            // Like
            review.getLikedByUsers().add(userId);
            review.setLikesCount(review.getLikesCount() + 1);
            // Remove dislike if exists
            if (review.getDislikedByUsers().contains(userId)) {
                review.getDislikedByUsers().remove(userId);
                review.setDislikesCount(review.getDislikesCount() - 1);
            }
        }

        review = reviewRepository.save(review);
        return ReviewResponse.fromEntity(review, userId);
    }

    @Transactional
    public ReviewResponse dislikeReview(String reviewId, Long userId) {
        MovieReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (review.getDislikedByUsers().contains(userId)) {
            // Remove dislike
            review.getDislikedByUsers().remove(userId);
            review.setDislikesCount(review.getDislikesCount() - 1);
        } else {
            // Dislike
            review.getDislikedByUsers().add(userId);
            review.setDislikesCount(review.getDislikesCount() + 1);
            // Remove like if exists
            if (review.getLikedByUsers().contains(userId)) {
                review.getLikedByUsers().remove(userId);
                review.setLikesCount(review.getLikesCount() - 1);
            }
        }

        review = reviewRepository.save(review);
        return ReviewResponse.fromEntity(review, userId);
    }

    private void updateMovieRating(Long movieId) {
        List<MovieReview> reviews = reviewRepository.findAllByMovieIdForRating(movieId);

        if (reviews.isEmpty()) {
            movieService.updateMovieRating(movieId, 0.0, 0);
        } else {
            double avgRating = reviews.stream()
                    .mapToInt(MovieReview::getRating)
                    .average()
                    .orElse(0.0);
            movieService.updateMovieRating(movieId, Math.round(avgRating * 10) / 10.0, reviews.size());
        }
    }
}
