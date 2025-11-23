package com.revtickets.service;

import com.revtickets.dto.request.ShowTimeRequest;
import com.revtickets.dto.response.SeatResponse;
import com.revtickets.dto.response.ShowTimeResponse;
import com.revtickets.entity.mysql.*;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mysql.MovieRepository;
import com.revtickets.repository.mysql.ScreenRepository;
import com.revtickets.repository.mysql.SeatRepository;
import com.revtickets.repository.mysql.ShowTimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowTimeService {

    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;

    public List<ShowTimeResponse> getShowTimesByMovieAndDate(Long movieId, LocalDate date) {
        return showTimeRepository.findAvailableShowsByMovieAndDate(movieId, date).stream()
                .map(ShowTimeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ShowTimeResponse> getShowTimesByMovieCityAndDate(Long movieId, String city, LocalDate date) {
        return showTimeRepository.findByMovieCityAndDate(movieId, city, date).stream()
                .map(ShowTimeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ShowTimeResponse> getShowTimesByTheaterAndDate(Long theaterId, LocalDate date) {
        return showTimeRepository.findByTheaterAndDate(theaterId, date).stream()
                .map(ShowTimeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ShowTimeResponse getShowTimeById(Long id) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ShowTime", "id", id));
        return ShowTimeResponse.fromEntity(showTime);
    }

    public ShowTime getShowTimeEntity(Long id) {
        return showTimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ShowTime", "id", id));
    }

    public List<SeatResponse> getSeatsByShowTime(Long showTimeId) {
        return seatRepository.findByShowTimeIdOrdered(showTimeId).stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShowTimeResponse createShowTime(ShowTimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", request.getMovieId()));

        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen", "id", request.getScreenId()));

        ShowTime showTime = ShowTime.builder()
                .movie(movie)
                .screen(screen)
                .showDate(request.getShowDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .basePrice(request.getBasePrice())
                .format(request.getFormat())
                .language(request.getLanguage())
                .priceMultipliers(request.getPriceMultipliers())
                .availableSeats(screen.getTotalSeats())
                .status(ShowTime.ShowStatus.SCHEDULED)
                .build();

        showTime = showTimeRepository.save(showTime);

        // Generate seats for this showtime
        generateSeatsForShowTime(showTime, screen, request.getBasePrice());

        return ShowTimeResponse.fromEntity(showTime);
    }

    private void generateSeatsForShowTime(ShowTime showTime, Screen screen, BigDecimal basePrice) {
        List<Seat> seats = new ArrayList<>();

        // Parse seat layout from screen configuration (format: "A:10,B:10,C:12,...")
        String[] rows = screen.getSeatLayout().split(",");

        for (String rowConfig : rows) {
            String[] parts = rowConfig.split(":");
            String rowLetter = parts[0].trim();
            int seatsInRow = Integer.parseInt(parts[1].trim());

            // Determine seat category based on row
            Seat.SeatCategory category = determineSeatCategory(rowLetter);
            BigDecimal seatPrice = calculateSeatPrice(basePrice, category);

            for (int i = 1; i <= seatsInRow; i++) {
                Seat seat = Seat.builder()
                        .showTime(showTime)
                        .seatRow(rowLetter)
                        .seatNumber(i)
                        .category(category)
                        .price(seatPrice)
                        .status(Seat.SeatStatus.AVAILABLE)
                        .build();
                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);
    }

    private Seat.SeatCategory determineSeatCategory(String row) {
        char rowChar = row.charAt(0);
        if (rowChar <= 'C') {
            return Seat.SeatCategory.SILVER;
        } else if (rowChar <= 'G') {
            return Seat.SeatCategory.GOLD;
        } else if (rowChar <= 'J') {
            return Seat.SeatCategory.PLATINUM;
        } else {
            return Seat.SeatCategory.RECLINER;
        }
    }

    private BigDecimal calculateSeatPrice(BigDecimal basePrice, Seat.SeatCategory category) {
        return switch (category) {
            case SILVER -> basePrice;
            case GOLD -> basePrice.multiply(BigDecimal.valueOf(1.3));
            case PLATINUM -> basePrice.multiply(BigDecimal.valueOf(1.6));
            case RECLINER -> basePrice.multiply(BigDecimal.valueOf(2.0));
        };
    }

    @Transactional
    public ShowTimeResponse updateShowTime(Long id, ShowTimeRequest request) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ShowTime", "id", id));

        showTime.setShowDate(request.getShowDate());
        showTime.setStartTime(request.getStartTime());
        showTime.setEndTime(request.getEndTime());
        showTime.setBasePrice(request.getBasePrice());
        showTime.setFormat(request.getFormat());
        showTime.setLanguage(request.getLanguage());
        showTime.setPriceMultipliers(request.getPriceMultipliers());

        showTime = showTimeRepository.save(showTime);
        return ShowTimeResponse.fromEntity(showTime);
    }

    @Transactional
    public void cancelShowTime(Long id) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ShowTime", "id", id));
        showTime.setStatus(ShowTime.ShowStatus.CANCELLED);
        showTimeRepository.save(showTime);
    }

    public long getTotalShowsCount() {
        return showTimeRepository.countByShowDate(LocalDate.now());
    }
}
