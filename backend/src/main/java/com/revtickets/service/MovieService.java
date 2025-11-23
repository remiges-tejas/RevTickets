package com.revtickets.service;

import com.revtickets.dto.request.MovieRequest;
import com.revtickets.dto.response.MovieResponse;
import com.revtickets.entity.mysql.Movie;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mysql.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<MovieResponse> getNowShowingMovies() {
        return movieRepository.findNowShowing().stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getComingSoonMovies() {
        return movieRepository.findComingSoon().stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        return MovieResponse.fromEntity(movie);
    }

    public Movie getMovieEntity(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
    }

    public Page<MovieResponse> searchMovies(String query, Pageable pageable) {
        return movieRepository.searchMovies(query, pageable)
                .map(MovieResponse::fromEntity);
    }

    public Page<MovieResponse> getMoviesByFilters(String genre, String language, String format,
                                                   Movie.MovieStatus status, Pageable pageable) {
        return movieRepository.findByFilters(genre, language, format, status, pageable)
                .map(MovieResponse::fromEntity);
    }

    public List<String> getAvailableLanguages() {
        return movieRepository.findDistinctLanguages();
    }

    public List<String> getAvailableGenres() {
        return movieRepository.findDistinctGenres();
    }

    @Transactional
    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .genre(request.getGenre())
                .language(request.getLanguage())
                .releaseDate(request.getReleaseDate())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .format(request.getFormat())
                .certification(request.getCertification())
                .cast(request.getCast())
                .director(request.getDirector())
                .status(request.getStatus() != null ? request.getStatus() : Movie.MovieStatus.COMING_SOON)
                .rating(0.0)
                .totalReviews(0)
                .build();

        movie = movieRepository.save(movie);
        return MovieResponse.fromEntity(movie);
    }

    @Transactional
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setDuration(request.getDuration());
        movie.setGenre(request.getGenre());
        movie.setLanguage(request.getLanguage());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setFormat(request.getFormat());
        movie.setCertification(request.getCertification());
        movie.setCast(request.getCast());
        movie.setDirector(request.getDirector());
        if (request.getStatus() != null) {
            movie.setStatus(request.getStatus());
        }

        movie = movieRepository.save(movie);
        return MovieResponse.fromEntity(movie);
    }

    @Transactional
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie", "id", id);
        }
        movieRepository.deleteById(id);
    }

    @Transactional
    public void updateMovieRating(Long movieId, double newRating, int totalReviews) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        movie.setRating(newRating);
        movie.setTotalReviews(totalReviews);
        movieRepository.save(movie);
    }

    public long getActiveMoviesCount() {
        return movieRepository.findByStatus(Movie.MovieStatus.NOW_SHOWING, Pageable.unpaged()).getTotalElements();
    }
}
