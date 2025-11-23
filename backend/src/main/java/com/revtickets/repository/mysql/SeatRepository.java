package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByShowTimeId(Long showTimeId);

    @Query("SELECT s FROM Seat s WHERE s.showTime.id = :showTimeId ORDER BY s.seatRow, s.seatNumber")
    List<Seat> findByShowTimeIdOrdered(@Param("showTimeId") Long showTimeId);

    List<Seat> findByShowTimeIdAndStatus(Long showTimeId, Seat.SeatStatus status);

    @Query("SELECT s FROM Seat s WHERE s.id IN :seatIds AND s.status = 'AVAILABLE'")
    List<Seat> findAvailableSeats(@Param("seatIds") List<Long> seatIds);

    @Modifying
    @Query("UPDATE Seat s SET s.status = 'LOCKED', s.lockedUntil = :lockedUntil, s.lockedByUserId = :userId WHERE s.id IN :seatIds AND s.status = 'AVAILABLE'")
    int lockSeats(@Param("seatIds") List<Long> seatIds, @Param("lockedUntil") LocalDateTime lockedUntil, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Seat s SET s.status = 'AVAILABLE', s.lockedUntil = NULL, s.lockedByUserId = NULL WHERE s.id IN :seatIds AND s.lockedByUserId = :userId")
    int releaseSeats(@Param("seatIds") List<Long> seatIds, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Seat s SET s.status = 'BOOKED', s.lockedUntil = NULL WHERE s.id IN :seatIds")
    int bookSeats(@Param("seatIds") List<Long> seatIds);

    @Modifying
    @Query("UPDATE Seat s SET s.status = 'AVAILABLE', s.lockedUntil = NULL, s.lockedByUserId = NULL WHERE s.lockedUntil < :now AND s.status = 'LOCKED'")
    int releaseExpiredLocks(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(s) FROM Seat s WHERE s.showTime.id = :showTimeId AND s.status = 'AVAILABLE'")
    int countAvailableSeats(@Param("showTimeId") Long showTimeId);
}
