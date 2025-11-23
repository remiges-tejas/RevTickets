package com.revtickets.controller;

import com.revtickets.dto.request.ProcessPaymentRequest;
import com.revtickets.dto.response.ApiResponse;
import com.revtickets.dto.response.PaymentResponse;
import com.revtickets.entity.mysql.User;
import com.revtickets.service.PaymentService;
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
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    @PostMapping("/process")
    @Operation(summary = "Process payment for a booking")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProcessPaymentRequest request) {
        User user = userService.getUserEntity(userDetails.getUsername());
        PaymentResponse payment = paymentService.processPayment(user, request);
        return ResponseEntity.ok(ApiResponse.success("Payment successful", payment));
    }

    @PostMapping("/{bookingId}/refund")
    @Operation(summary = "Initiate refund for a booking")
    public ResponseEntity<ApiResponse<PaymentResponse>> initiateRefund(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId) {
        User user = userService.getUserEntity(userDetails.getUsername());
        PaymentResponse refund = paymentService.initiateRefund(bookingId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Refund initiated", refund));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/my-payments")
    @Operation(summary = "Get current user's payment history")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        User user = userService.getUserEntity(userDetails.getUsername());
        Page<PaymentResponse> payments = paymentService.getUserPayments(user.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }
}
