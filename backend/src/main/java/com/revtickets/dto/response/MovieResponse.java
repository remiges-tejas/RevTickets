package com.revtickets.dto.response;

import com.revtickets.entity.mysql.Movie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {

    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private String genre;
    private String language;
    private LocalDate releaseDate;
    private String posterUrl;
    private String trailerUrl;
    private Double rating;
    private Integer totalReviews;
    private String format;
    private String certification;
    private String cast;
    private String director;
    private String status;

    public static MovieResponse fromEntity(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .duration(movie.getDuration())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .releaseDate(movie.getReleaseDate())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .rating(movie.getRating())
                .totalReviews(movie.getTotalReviews())
                .format(movie.getFormat())
                .certification(movie.getCertification())
                .cast(movie.getCast())
                .director(movie.getDirector())
                .status(movie.getStatus().name())
                .build();
    }
}
