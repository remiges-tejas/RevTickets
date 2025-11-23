package com.revtickets.dto.response;

import com.revtickets.entity.mongodb.MovieReview;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private String id;
    private Long movieId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private int rating;
    private String title;
    private String content;
    private int likesCount;
    private int dislikesCount;
    private boolean verified;
    private boolean likedByCurrentUser;
    private boolean dislikedByCurrentUser;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(MovieReview review, Long currentUserId) {
        return ReviewResponse.builder()
                .id(review.getId())
                .movieId(review.getMovieId())
                .userId(review.getUserId())
                .userName(review.getUserName())
                .userAvatar(review.getUserAvatar())
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .likesCount(review.getLikesCount())
                .dislikesCount(review.getDislikesCount())
                .verified(review.isVerified())
                .likedByCurrentUser(currentUserId != null && review.getLikedByUsers().contains(currentUserId))
                .dislikedByCurrentUser(currentUserId != null && review.getDislikedByUsers().contains(currentUserId))
                .createdAt(review.getCreatedAt())
                .build();
    }
}
