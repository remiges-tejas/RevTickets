package com.revtickets.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private long totalBookings;
    private long todayBookings;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private long totalUsers;
    private long newUsersToday;
    private long activeMovies;
    private long totalShows;

    private List<RevenueData> revenueChart;
    private List<MovieStats> topMovies;
    private Map<String, Long> paymentMethodStats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueData {
        private String date;
        private BigDecimal revenue;
        private long bookings;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieStats {
        private Long movieId;
        private String movieTitle;
        private long bookings;
        private BigDecimal revenue;
    }
}
