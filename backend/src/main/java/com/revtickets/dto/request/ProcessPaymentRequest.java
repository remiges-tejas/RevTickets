package com.revtickets.dto.request;

import com.revtickets.entity.mysql.PaymentTransaction.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcessPaymentRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

    // Card details (optional, based on method)
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
    private String cardHolderName;

    // UPI details (optional)
    private String upiId;

    // Net banking details (optional)
    private String bankCode;
}
