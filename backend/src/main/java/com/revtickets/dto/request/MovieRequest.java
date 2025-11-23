package com.revtickets.dto.request;

import com.revtickets.entity.mysql.Movie.MovieStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MovieRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be at most 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;

    private String posterUrl;

    private String trailerUrl;

    private String format; // 2D, 3D, IMAX

    private String certification; // U, UA, A

    private String cast;

    private String director;

    private MovieStatus status;
}
