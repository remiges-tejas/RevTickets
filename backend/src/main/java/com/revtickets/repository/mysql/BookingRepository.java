package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    List<Booking> findByUserIdAndStatus(Long userId, Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.showTime.id = :showTimeId AND b.status IN ('CONFIRMED', 'COMPLETED')")
    List<Booking> findConfirmedByShowTime(@Param("showTimeId") Long showTimeId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :start AND b.createdAt < :end")
    long countByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.createdAt >= :start AND b.createdAt < :end")
    BigDecimal sumRevenueByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT b.showTime.movie.id, COUNT(b), SUM(b.totalAmount) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.createdAt >= :start GROUP BY b.showTime.movie.id ORDER BY COUNT(b) DESC")
    List<Object[]> findTopMoviesByBookings(@Param("start") LocalDateTime start, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.createdAt < :cutoff")
    List<Booking> findExpiredPendingBookings(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED' AND DATE(b.createdAt) = :date")
    long countConfirmedByDate(@Param("date") LocalDate date);
}
