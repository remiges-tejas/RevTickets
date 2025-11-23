package com.revtickets.entity.mysql;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "show_times")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    private String format; // 2D, 3D, IMAX

    private String language;

    @Column(name = "available_seats")
    private Integer availableSeats;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ShowStatus status = ShowStatus.SCHEDULED;

    @Column(name = "price_multipliers", columnDefinition = "TEXT")
    private String priceMultipliers; // JSON: {"SILVER": 1.0, "GOLD": 1.5, "PLATINUM": 2.0}

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum ShowStatus {
        SCHEDULED, FILLING_FAST, ALMOST_FULL, SOLD_OUT, CANCELLED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
