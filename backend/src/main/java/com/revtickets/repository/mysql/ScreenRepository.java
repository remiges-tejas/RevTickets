package com.revtickets.repository.mysql;

import com.revtickets.entity.mysql.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {

    List<Screen> findByTheaterId(Long theaterId);

    List<Screen> findByTheaterIdAndIsActiveTrue(Long theaterId);

    boolean existsByTheaterIdAndName(Long theaterId, String name);
}
