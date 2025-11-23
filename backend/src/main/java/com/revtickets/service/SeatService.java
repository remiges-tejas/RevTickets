package com.revtickets.service;

import com.revtickets.dto.response.SeatResponse;
import com.revtickets.entity.mysql.Seat;
import com.revtickets.exception.BadRequestException;
import com.revtickets.repository.mysql.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private static final int LOCK_DURATION_MINUTES = 10;

    public List<SeatResponse> getSeatsForShowTime(Long showTimeId) {
        return seatRepository.findByShowTimeIdOrdered(showTimeId).stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SeatResponse> lockSeats(Long showTimeId, List<Long> seatIds, Long userId) {
        // Check if seats are available
        List<Seat> availableSeats = seatRepository.findAvailableSeats(seatIds);

        if (availableSeats.size() != seatIds.size()) {
            throw new BadRequestException("Some seats are no longer available");
        }

        LocalDateTime lockUntil = LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES);
        int lockedCount = seatRepository.lockSeats(seatIds, lockUntil, userId);

        if (lockedCount != seatIds.size()) {
            throw new BadRequestException("Failed to lock all selected seats");
        }

        return seatRepository.findAllById(seatIds).stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void releaseSeats(List<Long> seatIds, Long userId) {
        seatRepository.releaseSeats(seatIds, userId);
    }

    @Transactional
    public void bookSeats(List<Long> seatIds) {
        seatRepository.bookSeats(seatIds);
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void releaseExpiredLocks() {
        int released = seatRepository.releaseExpiredLocks(LocalDateTime.now());
        if (released > 0) {
            // Log or notify about released seats
        }
    }

    public int getAvailableSeatsCount(Long showTimeId) {
        return seatRepository.countAvailableSeats(showTimeId);
    }
}
