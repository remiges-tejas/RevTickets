package com.revtickets.dto.response;

import com.revtickets.entity.mysql.ShowTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowTimeResponse {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long theaterId;
    private String theaterName;
    private Long screenId;
    private String screenName;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal basePrice;
    private String format;
    private String language;
    private Integer availableSeats;
    private String status;
    private String priceMultipliers;

    public static ShowTimeResponse fromEntity(ShowTime showTime) {
        return ShowTimeResponse.builder()
                .id(showTime.getId())
                .movieId(showTime.getMovie().getId())
                .movieTitle(showTime.getMovie().getTitle())
                .theaterId(showTime.getScreen().getTheater().getId())
                .theaterName(showTime.getScreen().getTheater().getName())
                .screenId(showTime.getScreen().getId())
                .screenName(showTime.getScreen().getName())
                .showDate(showTime.getShowDate())
                .startTime(showTime.getStartTime())
                .endTime(showTime.getEndTime())
                .basePrice(showTime.getBasePrice())
                .format(showTime.getFormat())
                .language(showTime.getLanguage())
                .availableSeats(showTime.getAvailableSeats())
                .status(showTime.getStatus().name())
                .priceMultipliers(showTime.getPriceMultipliers())
                .build();
    }
}
