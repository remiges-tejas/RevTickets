package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.PaymentTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByTransactionId(String transactionId);

    List<PaymentTransaction> findByBookingId(Long bookingId);

    Page<PaymentTransaction> findByUserId(Long userId, Pageable pageable);

    List<PaymentTransaction> findByUserIdAndStatus(Long userId, PaymentTransaction.PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.status = 'COMPLETED' AND p.createdAt >= :start AND p.createdAt < :end")
    BigDecimal sumCompletedPayments(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p.method, COUNT(p), SUM(p.amount) FROM PaymentTransaction p WHERE p.status = 'COMPLETED' AND p.createdAt >= :start GROUP BY p.method")
    List<Object[]> getPaymentMethodStats(@Param("start") LocalDateTime start);

    @Query("SELECT COUNT(p) FROM PaymentTransaction p WHERE p.status = :status AND p.createdAt >= :start")
    long countByStatusSince(@Param("status") PaymentTransaction.PaymentStatus status, @Param("start") LocalDateTime start);
}
