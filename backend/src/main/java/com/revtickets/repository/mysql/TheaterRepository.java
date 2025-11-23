package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, Long> {

    List<Theater> findByCity(String city);

    List<Theater> findByIsActiveTrue();

    @Query("SELECT t FROM Theater t WHERE t.city = :city AND t.isActive = true")
    List<Theater> findActiveByCityIgnoreCase(@Param("city") String city);

    @Query("SELECT DISTINCT t.city FROM Theater t WHERE t.isActive = true ORDER BY t.city")
    List<String> findDistinctCities();

    @Query("SELECT t FROM Theater t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.area) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Theater> searchTheaters(@Param("query") String query);

    boolean existsByNameAndCity(String name, String city);
}
