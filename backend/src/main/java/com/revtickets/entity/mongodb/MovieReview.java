package com.revtickets.entity.mongodb;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "movie_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(name = "movie_user_idx", def = "{'movieId': 1, 'userId': 1}", unique = true)
public class MovieReview {

    @Id
    private String id;

    @Indexed
    private Long movieId;

    @Indexed
    private Long userId;

    private String userName;

    private String userAvatar;

    private int rating; // 1-5 stars

    private String title;

    private String content;

    @Builder.Default
    private int likesCount = 0;

    @Builder.Default
    private int dislikesCount = 0;

    @Builder.Default
    private List<Long> likedByUsers = new ArrayList<>();

    @Builder.Default
    private List<Long> dislikedByUsers = new ArrayList<>();

    @Builder.Default
    private boolean verified = false; // User has booked and watched the movie

    private Long bookingId; // Reference to booking for verified reviews

    @Builder.Default
    private boolean flagged = false;

    private String flagReason;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}
