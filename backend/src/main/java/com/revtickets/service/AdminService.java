package com.revtickets.service;

import com.revtickets.dto.response.DashboardStats;
import com.revtickets.repository.mysql.BookingRepository;
import com.revtickets.repository.mysql.MovieRepository;
import com.revtickets.repository.mysql.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BookingRepository bookingRepository;
    private final MovieRepository movieRepository;
    private final PaymentTransactionRepository paymentRepository;
    private final UserService userService;
    private final MovieService movieService;
    private final ShowTimeService showTimeService;
    private final BookingService bookingService;

    public DashboardStats getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfWeek = startOfToday.minusDays(7);
        LocalDateTime startOfMonth = startOfToday.minusDays(30);

        // Basic stats
        long totalBookings = bookingService.getTotalBookings();
        long todayBookings = bookingService.getTodayBookings();
        BigDecimal totalRevenue = bookingService.getTotalRevenue();
        BigDecimal todayRevenue = bookingService.getTodayRevenue();
        long totalUsers = userService.getTotalUsers();
        long newUsersToday = userService.getNewUsersToday();
        long activeMovies = movieService.getActiveMoviesCount();
        long totalShows = showTimeService.getTotalShowsCount();

        // Revenue chart data (last 7 days)
        List<DashboardStats.RevenueData> revenueChart = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = startOfToday.minusDays(i);
            LocalDateTime dayEnd = dayStart.plusDays(1);

            BigDecimal revenue = bookingRepository.sumRevenueByDateRange(dayStart, dayEnd);
            long bookings = bookingRepository.countByDateRange(dayStart, dayEnd);

            revenueChart.add(DashboardStats.RevenueData.builder()
                    .date(dayStart.toLocalDate().toString())
                    .revenue(revenue != null ? revenue : BigDecimal.ZERO)
                    .bookings(bookings)
                    .build());
        }

        // Top movies
        List<Object[]> topMoviesData = bookingRepository.findTopMoviesByBookings(
                startOfMonth, PageRequest.of(0, 5));

        List<DashboardStats.MovieStats> topMovies = new ArrayList<>();
        for (Object[] row : topMoviesData) {
            Long movieId = (Long) row[0];
            Long bookingCount = (Long) row[1];
            BigDecimal revenue = (BigDecimal) row[2];

            String movieTitle = movieRepository.findById(movieId)
                    .map(m -> m.getTitle())
                    .orElse("Unknown");

            topMovies.add(DashboardStats.MovieStats.builder()
                    .movieId(movieId)
                    .movieTitle(movieTitle)
                    .bookings(bookingCount)
                    .revenue(revenue)
                    .build());
        }

        // Payment method stats
        List<Object[]> paymentStats = paymentRepository.getPaymentMethodStats(startOfMonth);
        Map<String, Long> paymentMethodStats = new HashMap<>();
        for (Object[] row : paymentStats) {
            String method = row[0].toString();
            Long count = (Long) row[1];
            paymentMethodStats.put(method, count);
        }

        return DashboardStats.builder()
                .totalBookings(totalBookings)
                .todayBookings(todayBookings)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .todayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO)
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .activeMovies(activeMovies)
                .totalShows(totalShows)
                .revenueChart(revenueChart)
                .topMovies(topMovies)
                .paymentMethodStats(paymentMethodStats)
                .build();
    }
}
