package com.revtickets.service;

import com.revtickets.dto.response.NotificationResponse;
import com.revtickets.entity.mongodb.Notification;
import com.revtickets.entity.mysql.Booking;
import com.revtickets.entity.mysql.PaymentTransaction;
import com.revtickets.repository.mongodb.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationResponse::fromEntity);
    }

    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        LocalDateTime now = LocalDateTime.now();
        unread.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(now);
        });
        notificationRepository.saveAll(unread);
    }

    public void sendBookingConfirmation(Booking booking) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("bookingId", booking.getId());
        metadata.put("bookingNumber", booking.getBookingNumber());
        metadata.put("movieTitle", booking.getShowTime().getMovie().getTitle());

        Notification notification = Notification.builder()
                .userId(booking.getUser().getId())
                .title("Booking Confirmed!")
                .message("Your booking " + booking.getBookingNumber() + " for " +
                        booking.getShowTime().getMovie().getTitle() + " has been confirmed.")
                .type(Notification.NotificationType.BOOKING_CONFIRMED)
                .metadata(metadata)
                .actionUrl("/bookings/" + booking.getId())
                .build();

        notification = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getUser().getId(), notification);
    }

    public void sendBookingCancellation(Booking booking) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("bookingId", booking.getId());
        metadata.put("bookingNumber", booking.getBookingNumber());

        Notification notification = Notification.builder()
                .userId(booking.getUser().getId())
                .title("Booking Cancelled")
                .message("Your booking " + booking.getBookingNumber() + " has been cancelled.")
                .type(Notification.NotificationType.BOOKING_CANCELLED)
                .metadata(metadata)
                .build();

        notification = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getUser().getId(), notification);
    }

    public void sendPaymentSuccess(Booking booking, PaymentTransaction payment) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("bookingId", booking.getId());
        metadata.put("transactionId", payment.getTransactionId());
        metadata.put("amount", payment.getAmount());

        Notification notification = Notification.builder()
                .userId(booking.getUser().getId())
                .title("Payment Successful")
                .message("Payment of ₹" + payment.getAmount() + " for booking " +
                        booking.getBookingNumber() + " was successful.")
                .type(Notification.NotificationType.PAYMENT_SUCCESS)
                .metadata(metadata)
                .actionUrl("/bookings/" + booking.getId())
                .build();

        notification = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getUser().getId(), notification);
    }

    public void sendPaymentFailure(Booking booking, String reason) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("bookingId", booking.getId());
        metadata.put("reason", reason);

        Notification notification = Notification.builder()
                .userId(booking.getUser().getId())
                .title("Payment Failed")
                .message("Payment for booking " + booking.getBookingNumber() + " failed: " + reason)
                .type(Notification.NotificationType.PAYMENT_FAILED)
                .metadata(metadata)
                .build();

        notification = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getUser().getId(), notification);
    }

    public void sendRefundInitiated(Booking booking) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("bookingId", booking.getId());
        metadata.put("amount", booking.getTotalAmount());

        Notification notification = Notification.builder()
                .userId(booking.getUser().getId())
                .title("Refund Initiated")
                .message("Refund of ₹" + booking.getTotalAmount() + " for booking " +
                        booking.getBookingNumber() + " has been initiated.")
                .type(Notification.NotificationType.REFUND_INITIATED)
                .metadata(metadata)
                .build();

        notification = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getUser().getId(), notification);
    }

    private void sendRealTimeNotification(Long userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                NotificationResponse.fromEntity(notification)
        );
    }
}
