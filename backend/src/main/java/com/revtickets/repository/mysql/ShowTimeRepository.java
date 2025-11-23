package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {

    List<ShowTime> findByMovieIdAndShowDate(Long movieId, LocalDate showDate);

    @Query("SELECT s FROM ShowTime s WHERE s.movie.id = :movieId AND s.showDate = :date AND s.status != 'CANCELLED' ORDER BY s.startTime")
    List<ShowTime> findAvailableShowsByMovieAndDate(@Param("movieId") Long movieId, @Param("date") LocalDate date);

    @Query("SELECT s FROM ShowTime s WHERE s.screen.theater.id = :theaterId AND s.showDate = :date AND s.status != 'CANCELLED' ORDER BY s.startTime")
    List<ShowTime> findByTheaterAndDate(@Param("theaterId") Long theaterId, @Param("date") LocalDate date);

    @Query("SELECT s FROM ShowTime s WHERE s.movie.id = :movieId AND s.screen.theater.city = :city AND s.showDate = :date AND s.status != 'CANCELLED'")
    List<ShowTime> findByMovieCityAndDate(
            @Param("movieId") Long movieId,
            @Param("city") String city,
            @Param("date") LocalDate date);

    @Query("SELECT s FROM ShowTime s WHERE s.screen.id = :screenId AND s.showDate = :date ORDER BY s.startTime")
    List<ShowTime> findByScreenAndDate(@Param("screenId") Long screenId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(s) FROM ShowTime s WHERE s.showDate = :date")
    long countByShowDate(@Param("date") LocalDate date);

    List<ShowTime> findByShowDateBetween(LocalDate start, LocalDate end);
}
