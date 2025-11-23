package com.revtickets.service;

import com.revtickets.dto.request.ProcessPaymentRequest;
import com.revtickets.dto.response.PaymentResponse;
import com.revtickets.entity.mysql.Booking;
import com.revtickets.entity.mysql.PaymentTransaction;
import com.revtickets.entity.mysql.User;
import com.revtickets.exception.BadRequestException;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mysql.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final BookingService bookingService;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    @Transactional
    public PaymentResponse processPayment(User user, ProcessPaymentRequest request) {
        Booking booking = bookingService.getBookingEntity(request.getBookingId());

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only pay for your own bookings");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in pending state");
        }

        // Create payment transaction
        PaymentTransaction payment = PaymentTransaction.builder()
                .transactionId(generateTransactionId())
                .booking(booking)
                .user(user)
                .amount(booking.getTotalAmount())
                .currency("INR")
                .method(request.getMethod())
                .status(PaymentTransaction.PaymentStatus.PENDING)
                .build();

        // Store card info if applicable (only last 4 digits)
        if (request.getCardNumber() != null && request.getCardNumber().length() >= 4) {
            payment.setCardLast4(request.getCardNumber().substring(request.getCardNumber().length() - 4));
            payment.setCardType(detectCardType(request.getCardNumber()));
        }

        payment = paymentRepository.save(payment);

        // Simulate payment processing
        boolean paymentSuccess = simulatePaymentGateway(request);

        if (paymentSuccess) {
            payment.setStatus(PaymentTransaction.PaymentStatus.COMPLETED);
            payment = paymentRepository.save(payment);

            // Confirm the booking
            bookingService.confirmBooking(booking.getId());

            // Send payment success notification
            notificationService.sendPaymentSuccess(booking, payment);

            // Log activity
            activityLogService.logPaymentCompleted(user, payment);

            log.info("Payment completed successfully: {}", payment.getTransactionId());
        } else {
            payment.setStatus(PaymentTransaction.PaymentStatus.FAILED);
            payment.setFailureReason("Payment declined by gateway");
            payment = paymentRepository.save(payment);

            // Send payment failure notification
            notificationService.sendPaymentFailure(booking, "Payment declined");

            // Log activity
            activityLogService.logPaymentFailed(user, payment);

            throw new BadRequestException("Payment failed. Please try again.");
        }

        return PaymentResponse.fromEntity(payment);
    }

    @Transactional
    public PaymentResponse initiateRefund(Long bookingId, Long userId) {
        Booking booking = bookingService.getBookingEntity(bookingId);

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only request refund for your own bookings");
        }

        // Find the original payment
        PaymentTransaction originalPayment = paymentRepository.findByBookingId(bookingId).stream()
                .filter(p -> p.getStatus() == PaymentTransaction.PaymentStatus.COMPLETED)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("No completed payment found for this booking"));

        // Create refund transaction
        PaymentTransaction refund = PaymentTransaction.builder()
                .transactionId(generateTransactionId())
                .booking(booking)
                .user(booking.getUser())
                .amount(booking.getTotalAmount())
                .currency("INR")
                .method(originalPayment.getMethod())
                .status(PaymentTransaction.PaymentStatus.REFUND_PENDING)
                .refundReason("Customer requested cancellation")
                .build();

        refund = paymentRepository.save(refund);

        // Simulate refund processing (in production, call payment gateway)
        refund.setStatus(PaymentTransaction.PaymentStatus.REFUNDED);
        refund = paymentRepository.save(refund);

        // Send notification
        notificationService.sendRefundInitiated(booking);

        return PaymentResponse.fromEntity(refund);
    }

    public PaymentResponse getPaymentById(Long id) {
        PaymentTransaction payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return PaymentResponse.fromEntity(payment);
    }

    public Page<PaymentResponse> getUserPayments(Long userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable)
                .map(PaymentResponse::fromEntity);
    }

    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    private boolean simulatePaymentGateway(ProcessPaymentRequest request) {
        // Simulate payment processing with 95% success rate
        // In production, integrate with actual payment gateway
        return Math.random() < 0.95;
    }

    private String detectCardType(String cardNumber) {
        if (cardNumber.startsWith("4")) {
            return "VISA";
        } else if (cardNumber.startsWith("5")) {
            return "MASTERCARD";
        } else if (cardNumber.startsWith("3")) {
            return "AMEX";
        }
        return "UNKNOWN";
    }
}
