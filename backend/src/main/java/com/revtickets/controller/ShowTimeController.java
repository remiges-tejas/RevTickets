package com.revtickets.controller;

import com.revtickets.dto.response.ApiResponse;
import com.revtickets.dto.response.SeatResponse;
import com.revtickets.dto.response.ShowTimeResponse;
import com.revtickets.service.ShowTimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@Tag(name = "Show Times", description = "Show time and seat availability endpoints")
public class ShowTimeController {

    private final ShowTimeService showTimeService;

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get showtimes by movie and date")
    public ResponseEntity<ApiResponse<List<ShowTimeResponse>>> getShowTimesByMovie(
            @PathVariable Long movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowTimeResponse> showTimes = showTimeService.getShowTimesByMovieAndDate(movieId, date);
        return ResponseEntity.ok(ApiResponse.success(showTimes));
    }

    @GetMapping("/movie/{movieId}/city/{city}")
    @Operation(summary = "Get showtimes by movie, city and date")
    public ResponseEntity<ApiResponse<List<ShowTimeResponse>>> getShowTimesByMovieAndCity(
            @PathVariable Long movieId,
            @PathVariable String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowTimeResponse> showTimes = showTimeService.getShowTimesByMovieCityAndDate(movieId, city, date);
        return ResponseEntity.ok(ApiResponse.success(showTimes));
    }

    @GetMapping("/theater/{theaterId}")
    @Operation(summary = "Get showtimes by theater and date")
    public ResponseEntity<ApiResponse<List<ShowTimeResponse>>> getShowTimesByTheater(
            @PathVariable Long theaterId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowTimeResponse> showTimes = showTimeService.getShowTimesByTheaterAndDate(theaterId, date);
        return ResponseEntity.ok(ApiResponse.success(showTimes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get showtime by ID")
    public ResponseEntity<ApiResponse<ShowTimeResponse>> getShowTimeById(@PathVariable Long id) {
        ShowTimeResponse showTime = showTimeService.getShowTimeById(id);
        return ResponseEntity.ok(ApiResponse.success(showTime));
    }

    @GetMapping("/{id}/seats")
    @Operation(summary = "Get seats for a showtime")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeats(@PathVariable Long id) {
        List<SeatResponse> seats = showTimeService.getSeatsByShowTime(id);
        return ResponseEntity.ok(ApiResponse.success(seats));
    }
}
