package com.revtickets.dto.response;

import com.revtickets.entity.mysql.PaymentTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private String transactionId;
    private Long bookingId;
    private BigDecimal amount;
    private String currency;
    private String method;
    private String status;
    private String cardLast4;
    private String cardType;
    private LocalDateTime createdAt;

    public static PaymentResponse fromEntity(PaymentTransaction payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(payment.getTransactionId())
                .bookingId(payment.getBooking().getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .cardLast4(payment.getCardLast4())
                .cardType(payment.getCardType())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
