package com.fitness.repository;

import com.fitness.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
// import java.util.Optional; // Optional 不需要了

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // 统计教练名下已完成的课程数
    @Query("SELECT COUNT(b) FROM Booking b " +
            "WHERE b.course.coach.id = :coachId " +
            "AND b.sessionStatus = 2")
    Integer countCompletedByCoachId(@Param("coachId") Long coachId);

    // 查询某会员的所有预约记录
    List<Booking> findByMemberId(Long memberId);

    // 查询某课程的所有预约
    List<Booking> findByCourseId(Long courseId);

    // === 关键修改 ===
    // 从 Optional<Booking> 改成 List<Booking>
    // 这样就算数据库里有重复脏数据，也不会报错
    List<Booking> findByMemberIdAndCourseId(Long memberId, Long courseId);

    // 查找 courseId 在列表 courseIds 里的所有 Booking
    List<Booking> findByCourseIdIn(List<Long> courseIds);

    // =================================
    // 按教练ID查上课中的预约
    @Query("SELECT b FROM Booking b WHERE b.course.coach.id = :coachId AND b.sessionStatus = 1")
    List<Booking> findActiveByCoachId(@Param("coachId") Long coachId);

    // 按会员ID和上课状态查
    List<Booking> findByMemberIdAndSessionStatus(Long memberId, Integer sessionStatus);

    //=========================================
    // 按 sessionStatus 和日期范围统计
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.sessionStatus = :status AND b.bookingTime BETWEEN :start AND :end")
    Integer countBySessionStatusAndBookingTimeBetween(@Param("status") Integer status,
                                                      @Param("start") LocalDateTime start,
                                                      @Param("end") LocalDateTime end);

    // 按 sessionStatus 统计总数
    Long countBySessionStatus(Integer status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.course.id IN :courseIds AND b.sessionStatus = 2")
    Integer countCompletedByCourseIds(@Param("courseIds") List<Long> courseIds);
}
