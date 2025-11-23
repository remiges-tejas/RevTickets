package com.revtickets.service;

import com.revtickets.dto.request.CreateBookingRequest;
import com.revtickets.dto.response.BookingResponse;
import com.revtickets.entity.mongodb.Notification;
import com.revtickets.entity.mysql.*;
import com.revtickets.exception.BadRequestException;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mysql.BookedSeatRepository;
import com.revtickets.repository.mysql.BookingRepository;
import com.revtickets.repository.mysql.SeatRepository;
import com.revtickets.repository.mysql.ShowTimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookedSeatRepository bookedSeatRepository;
    private final SeatRepository seatRepository;
    private final ShowTimeRepository showTimeRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    private static final BigDecimal CONVENIENCE_FEE_PERCENT = new BigDecimal("0.02");
    private static final BigDecimal TAX_PERCENT = new BigDecimal("0.18");

    @Transactional
    public BookingResponse createBooking(User user, CreateBookingRequest request) {
        ShowTime showTime = showTimeRepository.findById(request.getShowTimeId())
                .orElseThrow(() -> new ResourceNotFoundException("ShowTime", "id", request.getShowTimeId()));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        // Validate seats belong to the showtime and are locked by this user
        for (Seat seat : seats) {
            if (!seat.getShowTime().getId().equals(request.getShowTimeId())) {
                throw new BadRequestException("Seat does not belong to the selected showtime");
            }
            if (seat.getStatus() != Seat.SeatStatus.LOCKED || !user.getId().equals(seat.getLockedByUserId())) {
                throw new BadRequestException("Seat " + seat.getSeatRow() + seat.getSeatNumber() + " is not locked by you");
            }
        }

        // Calculate amounts
        BigDecimal baseAmount = seats.stream()
                .map(Seat::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal convenienceFee = baseAmount.multiply(CONVENIENCE_FEE_PERCENT)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal taxes = baseAmount.multiply(TAX_PERCENT)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = baseAmount.add(convenienceFee).add(taxes);

        // Generate booking number
        String bookingNumber = generateBookingNumber();

        // Create booking
        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .user(user)
                .showTime(showTime)
                .totalSeats(seats.size())
                .baseAmount(baseAmount)
                .convenienceFee(convenienceFee)
                .taxes(taxes)
                .totalAmount(totalAmount)
                .status(Booking.BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);

        // Create booked seats
        List<BookedSeat> bookedSeats = new ArrayList<>();
        for (Seat seat : seats) {
            BookedSeat bookedSeat = BookedSeat.builder()
                    .booking(booking)
                    .seatId(seat.getId())
                    .seatRow(seat.getSeatRow())
                    .seatNumber(seat.getSeatNumber())
                    .category(seat.getCategory().name())
                    .price(seat.getPrice())
                    .build();
            bookedSeats.add(bookedSeat);
        }
        bookedSeatRepository.saveAll(bookedSeats);
        booking.setBookedSeats(bookedSeats);

        // Log activity
        activityLogService.logBookingCreated(user, booking);

        return BookingResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking cannot be confirmed");
        }

        // Mark seats as booked
        List<Long> seatIds = booking.getBookedSeats().stream()
                .map(BookedSeat::getSeatId)
                .toList();
        seatRepository.bookSeats(seatIds);

        // Update available seats count
        ShowTime showTime = booking.getShowTime();
        showTime.setAvailableSeats(showTime.getAvailableSeats() - booking.getTotalSeats());
        showTimeRepository.save(showTime);

        // Generate QR code
        String qrCode = generateQRCode(booking);
        booking.setQrCode(qrCode);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        // Send notification
        notificationService.sendBookingConfirmation(booking);

        // Log activity
        activityLogService.logBookingConfirmed(booking.getUser(), booking);

        return BookingResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be cancelled");
        }

        // Release seats
        List<Long> seatIds = booking.getBookedSeats().stream()
                .map(BookedSeat::getSeatId)
                .toList();

        for (Long seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId).orElse(null);
            if (seat != null) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seatRepository.save(seat);
            }
        }

        // Update available seats count
        ShowTime showTime = booking.getShowTime();
        showTime.setAvailableSeats(showTime.getAvailableSeats() + booking.getTotalSeats());
        showTimeRepository.save(showTime);

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        // Send notification
        notificationService.sendBookingCancellation(booking);

        // Log activity
        activityLogService.logBookingCancelled(booking.getUser(), booking);

        return BookingResponse.fromEntity(booking);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return BookingResponse.fromEntity(booking);
    }

    public BookingResponse getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingNumber", bookingNumber));
        return BookingResponse.fromEntity(booking);
    }

    public Page<BookingResponse> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable)
                .map(BookingResponse::fromEntity);
    }

    public Booking getBookingEntity(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
    }

    private String generateBookingNumber() {
        return "RT" + System.currentTimeMillis() + new Random().nextInt(1000);
    }

    private String generateQRCode(Booking booking) {
        // In production, generate actual QR code
        return "QR-" + booking.getBookingNumber();
    }

    public long getTotalBookings() {
        return bookingRepository.count();
    }

    public long getTodayBookings() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return bookingRepository.countByDateRange(startOfDay, endOfDay);
    }

    public BigDecimal getTotalRevenue() {
        return bookingRepository.sumRevenueByDateRange(
                LocalDateTime.of(2000, 1, 1, 0, 0),
                LocalDateTime.now()
        );
    }

    public BigDecimal getTodayRevenue() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return bookingRepository.sumRevenueByDateRange(startOfDay, LocalDateTime.now());
    }
}
