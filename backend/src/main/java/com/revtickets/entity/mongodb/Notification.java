package com.revtickets.entity.mongodb;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    @Indexed
    private Long userId;

    private String title;

    private String message;

    private NotificationType type;

    @Builder.Default
    private boolean read = false;

    private Map<String, Object> metadata; // Additional data like bookingId, movieId, etc.

    private String actionUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

    public enum NotificationType {
        BOOKING_CONFIRMED,
        BOOKING_CANCELLED,
        PAYMENT_SUCCESS,
        PAYMENT_FAILED,
        REFUND_INITIATED,
        REFUND_COMPLETED,
        SHOW_REMINDER,
        PROMOTIONAL,
        SYSTEM
    }
}
