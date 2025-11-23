package com.revtickets.controller;

import com.revtickets.dto.response.ApiResponse;
import com.revtickets.dto.response.TheaterResponse;
import com.revtickets.service.TheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@RequiredArgsConstructor
@Tag(name = "Theaters", description = "Theater information endpoints")
public class TheaterController {

    private final TheaterService theaterService;

    @GetMapping
    @Operation(summary = "Get all theaters")
    public ResponseEntity<ApiResponse<List<TheaterResponse>>> getAllTheaters() {
        List<TheaterResponse> theaters = theaterService.getAllTheaters();
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get theaters by city")
    public ResponseEntity<ApiResponse<List<TheaterResponse>>> getTheatersByCity(@PathVariable String city) {
        List<TheaterResponse> theaters = theaterService.getTheatersByCity(city);
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get theater by ID")
    public ResponseEntity<ApiResponse<TheaterResponse>> getTheaterById(@PathVariable Long id) {
        TheaterResponse theater = theaterService.getTheaterById(id);
        return ResponseEntity.ok(ApiResponse.success(theater));
    }

    @GetMapping("/cities")
    @Operation(summary = "Get available cities")
    public ResponseEntity<ApiResponse<List<String>>> getCities() {
        List<String> cities = theaterService.getAvailableCities();
        return ResponseEntity.ok(ApiResponse.success(cities));
    }

    @GetMapping("/search")
    @Operation(summary = "Search theaters")
    public ResponseEntity<ApiResponse<List<TheaterResponse>>> searchTheaters(@RequestParam String query) {
        List<TheaterResponse> theaters = theaterService.searchTheaters(query);
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }
}
