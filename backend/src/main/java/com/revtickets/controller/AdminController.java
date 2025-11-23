package com.revtickets.controller;

import com.revtickets.dto.request.MovieRequest;
import com.revtickets.dto.request.ShowTimeRequest;
import com.revtickets.dto.request.TheaterRequest;
import com.revtickets.dto.response.*;
import com.revtickets.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management endpoints")
public class AdminController {

    private final AdminService adminService;
    private final MovieService movieService;
    private final TheaterService theaterService;
    private final ShowTimeService showTimeService;

    // Dashboard
    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // Movie Management
    @PostMapping("/movies")
    @Operation(summary = "Create a new movie")
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(@Valid @RequestBody MovieRequest request) {
        MovieResponse movie = movieService.createMovie(request);
        return ResponseEntity.ok(ApiResponse.success("Movie created", movie));
    }

    @PutMapping("/movies/{id}")
    @Operation(summary = "Update a movie")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequest request) {
        MovieResponse movie = movieService.updateMovie(id, request);
        return ResponseEntity.ok(ApiResponse.success("Movie updated", movie));
    }

    @DeleteMapping("/movies/{id}")
    @Operation(summary = "Delete a movie")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Movie deleted", null));
    }

    // Theater Management
    @PostMapping("/theaters")
    @Operation(summary = "Create a new theater")
    public ResponseEntity<ApiResponse<TheaterResponse>> createTheater(@Valid @RequestBody TheaterRequest request) {
        TheaterResponse theater = theaterService.createTheater(request);
        return ResponseEntity.ok(ApiResponse.success("Theater created", theater));
    }

    @PutMapping("/theaters/{id}")
    @Operation(summary = "Update a theater")
    public ResponseEntity<ApiResponse<TheaterResponse>> updateTheater(
            @PathVariable Long id,
            @Valid @RequestBody TheaterRequest request) {
        TheaterResponse theater = theaterService.updateTheater(id, request);
        return ResponseEntity.ok(ApiResponse.success("Theater updated", theater));
    }

    @DeleteMapping("/theaters/{id}")
    @Operation(summary = "Delete (deactivate) a theater")
    public ResponseEntity<ApiResponse<Void>> deleteTheater(@PathVariable Long id) {
        theaterService.deleteTheater(id);
        return ResponseEntity.ok(ApiResponse.success("Theater deleted", null));
    }

    // ShowTime Management
    @PostMapping("/showtimes")
    @Operation(summary = "Create a new showtime")
    public ResponseEntity<ApiResponse<ShowTimeResponse>> createShowTime(@Valid @RequestBody ShowTimeRequest request) {
        ShowTimeResponse showTime = showTimeService.createShowTime(request);
        return ResponseEntity.ok(ApiResponse.success("Showtime created", showTime));
    }

    @PutMapping("/showtimes/{id}")
    @Operation(summary = "Update a showtime")
    public ResponseEntity<ApiResponse<ShowTimeResponse>> updateShowTime(
            @PathVariable Long id,
            @Valid @RequestBody ShowTimeRequest request) {
        ShowTimeResponse showTime = showTimeService.updateShowTime(id, request);
        return ResponseEntity.ok(ApiResponse.success("Showtime updated", showTime));
    }

    @DeleteMapping("/showtimes/{id}")
    @Operation(summary = "Cancel a showtime")
    public ResponseEntity<ApiResponse<Void>> cancelShowTime(@PathVariable Long id) {
        showTimeService.cancelShowTime(id);
        return ResponseEntity.ok(ApiResponse.success("Showtime cancelled", null));
    }
}
