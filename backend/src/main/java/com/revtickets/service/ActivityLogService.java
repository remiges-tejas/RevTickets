package com.revtickets.service;

import com.revtickets.entity.mongodb.ActivityLog;
import com.revtickets.entity.mongodb.MovieReview;
import com.revtickets.entity.mysql.Booking;
import com.revtickets.entity.mysql.PaymentTransaction;
import com.revtickets.entity.mysql.User;
import com.revtickets.repository.mongodb.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public Page<ActivityLog> getUserActivity(Long userId, Pageable pageable) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
    }

    public void logUserRegistration(User user) {
        Map<String, Object> details = new HashMap<>();
        details.put("email", user.getEmail());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.USER_REGISTERED)
                .description("User registered successfully")
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    public void logUserLogin(User user) {
        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.USER_LOGIN)
                .description("User logged in")
                .build();

        activityLogRepository.save(log);
    }

    public void logProfileUpdate(User user) {
        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.USER_PROFILE_UPDATED)
                .description("Profile updated")
                .build();

        activityLogRepository.save(log);
    }

    public void logPasswordChange(User user) {
        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.PASSWORD_CHANGED)
                .description("Password changed")
                .build();

        activityLogRepository.save(log);
    }

    public void logBookingCreated(User user, Booking booking) {
        Map<String, Object> details = new HashMap<>();
        details.put("bookingId", booking.getId());
        details.put("bookingNumber", booking.getBookingNumber());
        details.put("movieTitle", booking.getShowTime().getMovie().getTitle());
        details.put("totalSeats", booking.getTotalSeats());
        details.put("amount", booking.getTotalAmount());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.BOOKING_CREATED)
                .description("Created booking " + booking.getBookingNumber())
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    public void logBookingConfirmed(User user, Booking booking) {
        Map<String, Object> details = new HashMap<>();
        details.put("bookingId", booking.getId());
        details.put("bookingNumber", booking.getBookingNumber());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.BOOKING_CONFIRMED)
                .description("Booking " + booking.getBookingNumber() + " confirmed")
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    public void logBookingCancelled(User user, Booking booking) {
        Map<String, Object> details = new HashMap<>();
        details.put("bookingId", booking.getId());
        details.put("bookingNumber", booking.getBookingNumber());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.BOOKING_CANCELLED)
                .description("Booking " + booking.getBookingNumber() + " cancelled")
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    public void logPaymentCompleted(User user, PaymentTransaction payment) {
        Map<String, Object> details = new HashMap<>();
        details.put("transactionId", payment.getTransactionId());
        details.put("amount", payment.getAmount());
        details.put("method", payment.getMethod().name());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.PAYMENT_COMPLETED)
                .description("Payment " + payment.getTransactionId() + " completed")
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    public void logPaymentFailed(User user, PaymentTransaction payment) {
        Map<String, Object> details = new HashMap<>();
        details.put("transactionId", payment.getTransactionId());
        details.put("reason", payment.getFailureReason());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.PAYMENT_FAILED)
                .description("Payment " + payment.getTransactionId() + " failed")
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    public void logReviewPosted(User user, MovieReview review) {
        Map<String, Object> details = new HashMap<>();
        details.put("reviewId", review.getId());
        details.put("movieId", review.getMovieId());
        details.put("rating", review.getRating());

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .activityType(ActivityLog.ActivityType.REVIEW_POSTED)
                .description("Posted review for movie")
                .details(details)
                .build();

        activityLogRepository.save(log);
    }
}
