package com.revtickets.controller;

import com.revtickets.dto.request.CreateReviewRequest;
import com.revtickets.dto.response.ApiResponse;
import com.revtickets.dto.response.ReviewResponse;
import com.revtickets.entity.mysql.User;
import com.revtickets.service.ReviewService;
import com.revtickets.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Movie review endpoints")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get reviews for a movie")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getMovieReviews(
            @PathVariable Long movieId,
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long currentUserId = null;
        if (userDetails != null) {
            currentUserId = userService.getUserEntity(userDetails.getUsername()).getId();
        }
        Page<ReviewResponse> reviews = reviewService.getMovieReviews(movieId, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/movie/{movieId}/my-review")
    @Operation(summary = "Get current user's review for a movie")
    public ResponseEntity<ApiResponse<ReviewResponse>> getMyReview(
            @PathVariable Long movieId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntity(userDetails.getUsername());
        ReviewResponse review = reviewService.getUserReviewForMovie(movieId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @PostMapping
    @Operation(summary = "Create a review")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        User user = userService.getUserEntity(userDetails.getUsername());
        ReviewResponse review = reviewService.createReview(user, request);
        return ResponseEntity.ok(ApiResponse.success("Review posted", review));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a review")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        User user = userService.getUserEntity(userDetails.getUsername());
        ReviewResponse review = reviewService.updateReview(id, user, request);
        return ResponseEntity.ok(ApiResponse.success("Review updated", review));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntity(userDetails.getUsername());
        reviewService.deleteReview(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Like or unlike a review")
    public ResponseEntity<ApiResponse<ReviewResponse>> likeReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntity(userDetails.getUsername());
        ReviewResponse review = reviewService.likeReview(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @PostMapping("/{id}/dislike")
    @Operation(summary = "Dislike or remove dislike from a review")
    public ResponseEntity<ApiResponse<ReviewResponse>> dislikeReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntity(userDetails.getUsername());
        ReviewResponse review = reviewService.dislikeReview(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(review));
    }
}
