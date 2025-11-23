package com.revtickets.entity.mysql;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "screens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "screen_type")
    private String screenType; // Standard, Premium, IMAX

    @Column(name = "sound_system")
    private String soundSystem; // Dolby Digital, Dolby Atmos, IMAX Enhanced

    @Column(name = "seat_layout", columnDefinition = "TEXT")
    private String seatLayout; // Format: "A:10,B:10,C:12,..."

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
