package com.revtickets.entity.mongodb;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    private String id;

    @Indexed
    private Long userId;

    private String userName;

    private ActivityType activityType;

    private String description;

    private Map<String, Object> details; // Additional context data

    private String ipAddress;

    private String userAgent;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum ActivityType {
        // User activities
        USER_REGISTERED,
        USER_LOGIN,
        USER_LOGOUT,
        USER_PROFILE_UPDATED,
        PASSWORD_CHANGED,

        // Booking activities
        SEATS_LOCKED,
        SEATS_RELEASED,
        BOOKING_CREATED,
        BOOKING_CONFIRMED,
        BOOKING_CANCELLED,

        // Payment activities
        PAYMENT_INITIATED,
        PAYMENT_COMPLETED,
        PAYMENT_FAILED,
        REFUND_REQUESTED,
        REFUND_PROCESSED,

        // Review activities
        REVIEW_POSTED,
        REVIEW_UPDATED,
        REVIEW_DELETED,
        REVIEW_LIKED,
        REVIEW_REPORTED,

        // Admin activities
        MOVIE_ADDED,
        MOVIE_UPDATED,
        SHOWTIME_CREATED,
        THEATER_ADDED,
        USER_ROLE_CHANGED
    }
}
