package com.revtickets.dto.response;

import com.revtickets.entity.mysql.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private String bookingNumber;
    private Long userId;
    private ShowTimeResponse showTime;
    private List<BookedSeatResponse> seats;
    private Integer totalSeats;
    private BigDecimal baseAmount;
    private BigDecimal convenienceFee;
    private BigDecimal taxes;
    private BigDecimal totalAmount;
    private String status;
    private String qrCode;
    private LocalDateTime createdAt;

    public static BookingResponse fromEntity(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingNumber(booking.getBookingNumber())
                .userId(booking.getUser().getId())
                .showTime(ShowTimeResponse.fromEntity(booking.getShowTime()))
                .seats(booking.getBookedSeats().stream()
                        .map(BookedSeatResponse::fromEntity)
                        .collect(Collectors.toList()))
                .totalSeats(booking.getTotalSeats())
                .baseAmount(booking.getBaseAmount())
                .convenienceFee(booking.getConvenienceFee())
                .taxes(booking.getTaxes())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus().name())
                .qrCode(booking.getQrCode())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
