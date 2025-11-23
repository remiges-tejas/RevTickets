package com.revtickets.dto.response;

import com.revtickets.entity.mysql.BookedSeat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookedSeatResponse {

    private Long id;
    private String seatRow;
    private Integer seatNumber;
    private String category;
    private BigDecimal price;

    public static BookedSeatResponse fromEntity(BookedSeat bookedSeat) {
        return BookedSeatResponse.builder()
                .id(bookedSeat.getId())
                .seatRow(bookedSeat.getSeatRow())
                .seatNumber(bookedSeat.getSeatNumber())
                .category(bookedSeat.getCategory())
                .price(bookedSeat.getPrice())
                .build();
    }
}
