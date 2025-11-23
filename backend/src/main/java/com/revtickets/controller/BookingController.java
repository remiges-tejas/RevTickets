package com.revtickets.controller;

import com.revtickets.dto.request.CreateBookingRequest;
import com.revtickets.dto.request.LockSeatsRequest;
import com.revtickets.dto.response.ApiResponse;
import com.revtickets.dto.response.BookingResponse;
import com.revtickets.dto.response.SeatResponse;
import com.revtickets.entity.mysql.User;
import com.revtickets.service.BookingService;
import com.revtickets.service.SeatService;
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

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management endpoints")
public class BookingController {

    private final BookingService bookingService;
    private final SeatService seatService;
    private final UserService userService;

    @PostMapping("/lock-seats")
    @Operation(summary = "Lock seats for booking")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> lockSeats(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LockSeatsRequest request) {
        User user = userService.getUserEntity(userDetails.getUsername());
        List<SeatResponse> lockedSeats = seatService.lockSeats(
                request.getShowTimeId(), request.getSeatIds(), user.getId());
        return ResponseEntity.ok(ApiResponse.success("Seats locked for 10 minutes", lockedSeats));
    }

    @PostMapping("/release-seats")
    @Operation(summary = "Release locked seats")
    public ResponseEntity<ApiResponse<Void>> releaseSeats(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<Long> seatIds) {
        User user = userService.getUserEntity(userDetails.getUsername());
        seatService.releaseSeats(seatIds, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Seats released", null));
    }

    @PostMapping
    @Operation(summary = "Create a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        User user = userService.getUserEntity(userDetails.getUsername());
        BookingResponse booking = bookingService.createBooking(user, request);
        return ResponseEntity.ok(ApiResponse.success("Booking created", booking));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        User user = userService.getUserEntity(userDetails.getUsername());
        BookingResponse booking = bookingService.cancelBooking(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", booking));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping("/number/{bookingNumber}")
    @Operation(summary = "Get booking by booking number")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByNumber(@PathVariable String bookingNumber) {
        BookingResponse booking = bookingService.getBookingByNumber(bookingNumber);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        User user = userService.getUserEntity(userDetails.getUsername());
        Page<BookingResponse> bookings = bookingService.getUserBookings(user.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}
