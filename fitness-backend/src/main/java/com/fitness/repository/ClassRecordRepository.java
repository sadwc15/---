package com.fitness.repository;

import com.fitness.entity.ClassRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface ClassRecordRepository extends JpaRepository<ClassRecord, Long> {
    // 查某个预约的记录
    ClassRecord findByBookingId(Long bookingId);

    // 查某个用户的所有记录 (需要联表，简单起见我们在 Service 层做逻辑)
}