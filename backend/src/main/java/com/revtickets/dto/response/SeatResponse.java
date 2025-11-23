package com.revtickets.dto.response;

import com.revtickets.entity.mysql.Seat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {

    private Long id;
    private String seatRow;
    private Integer seatNumber;
    private String category;
    private BigDecimal price;
    private String status;

    public static SeatResponse fromEntity(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .seatRow(seat.getSeatRow())
                .seatNumber(seat.getSeatNumber())
                .category(seat.getCategory().name())
                .price(seat.getPrice())
                .status(seat.getStatus().name())
                .build();
    }
}
