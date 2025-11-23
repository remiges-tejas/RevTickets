package com.revtickets.repository.mongodb;

import com.revtickets.entity.mongodb.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    Page<ActivityLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

    List<ActivityLog> findByActivityTypeOrderByTimestampDesc(ActivityLog.ActivityType activityType);

    List<ActivityLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);

    List<ActivityLog> findByUserIdAndActivityType(Long userId, ActivityLog.ActivityType activityType);

    long countByActivityTypeAndTimestampAfter(ActivityLog.ActivityType activityType, LocalDateTime after);
}
