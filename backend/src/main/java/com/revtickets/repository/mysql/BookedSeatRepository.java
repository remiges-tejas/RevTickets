package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.BookedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookedSeatRepository extends JpaRepository<BookedSeat, Long> {

    List<BookedSeat> findByBookingId(Long bookingId);

    void deleteByBookingId(Long bookingId);
}
