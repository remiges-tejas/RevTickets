package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Page<Movie> findByStatus(Movie.MovieStatus status, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE m.status = 'NOW_SHOWING' ORDER BY m.releaseDate DESC")
    List<Movie> findNowShowing();

    @Query("SELECT m FROM Movie m WHERE m.status = 'COMING_SOON' ORDER BY m.releaseDate ASC")
    List<Movie> findComingSoon();

    @Query("SELECT m FROM Movie m WHERE " +
           "LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.genre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.cast) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Movie> searchMovies(@Param("query") String query, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE " +
           "(:genre IS NULL OR m.genre LIKE CONCAT('%', :genre, '%')) AND " +
           "(:language IS NULL OR m.language = :language) AND " +
           "(:format IS NULL OR m.format LIKE CONCAT('%', :format, '%')) AND " +
           "m.status = :status")
    Page<Movie> findByFilters(
            @Param("genre") String genre,
            @Param("language") String language,
            @Param("format") String format,
            @Param("status") Movie.MovieStatus status,
            Pageable pageable);

    List<Movie> findByReleaseDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT DISTINCT m.language FROM Movie m WHERE m.status = 'NOW_SHOWING'")
    List<String> findDistinctLanguages();

    @Query("SELECT DISTINCT m.genre FROM Movie m WHERE m.status = 'NOW_SHOWING'")
    List<String> findDistinctGenres();
}
