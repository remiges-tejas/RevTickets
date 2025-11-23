package com.revtickets.controller;

import com.revtickets.dto.response.ApiResponse;
import com.revtickets.dto.response.MovieResponse;
import com.revtickets.entity.mysql.Movie;
import com.revtickets.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "Movie browsing endpoints")
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/now-showing")
    @Operation(summary = "Get all now showing movies")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getNowShowing() {
        List<MovieResponse> movies = movieService.getNowShowingMovies();
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/coming-soon")
    @Operation(summary = "Get all coming soon movies")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getComingSoon() {
        List<MovieResponse> movies = movieService.getComingSoonMovies();
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    @GetMapping("/search")
    @Operation(summary = "Search movies")
    public ResponseEntity<ApiResponse<Page<MovieResponse>>> searchMovies(
            @RequestParam String query, Pageable pageable) {
        Page<MovieResponse> movies = movieService.searchMovies(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter movies")
    public ResponseEntity<ApiResponse<Page<MovieResponse>>> filterMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String format,
            @RequestParam(defaultValue = "NOW_SHOWING") Movie.MovieStatus status,
            Pageable pageable) {
        Page<MovieResponse> movies = movieService.getMoviesByFilters(genre, language, format, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/languages")
    @Operation(summary = "Get available languages")
    public ResponseEntity<ApiResponse<List<String>>> getLanguages() {
        List<String> languages = movieService.getAvailableLanguages();
        return ResponseEntity.ok(ApiResponse.success(languages));
    }

    @GetMapping("/genres")
    @Operation(summary = "Get available genres")
    public ResponseEntity<ApiResponse<List<String>>> getGenres() {
        List<String> genres = movieService.getAvailableGenres();
        return ResponseEntity.ok(ApiResponse.success(genres));
    }
}
