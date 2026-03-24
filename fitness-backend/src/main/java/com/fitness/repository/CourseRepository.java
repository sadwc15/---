package com.fitness.repository;

import com.fitness.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // 查找特定类型的课程（比如只看私教课）
    List<Course> findByType(Course.CourseType type);

    // 查找某个教练的所有课程
    List<Course> findByCoachId(Long coachId);
    List<Course> findByTitleContaining(String keyword);

    @Query("SELECT c.id FROM Course c WHERE c.startTime BETWEEN :start AND :end")
    List<Long> findCourseIdsByStartTimeBetween(@Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);

    @Query(value = "SELECT " +
            "c.id AS course_id, " +
            "c.title AS course_name, " +
            "co.id AS coach_id, " +
            "co.name AS coach_name, " +
            "COUNT(b.id) AS selected_count " +
            "FROM courses c " +
            "LEFT JOIN coaches co ON c.coach_id = co.id " +
            "LEFT JOIN bookings b ON c.id = b.course_id " +
            "GROUP BY c.id, co.id, co.name, c.title " +
            "ORDER BY co.id, c.id", nativeQuery = true)
    List<Object[]> getCoachCourseStats();

    @Query(value = "SELECT " +
            "c.id AS course_id, " +
            "c.title AS course_name, " +
            "SUM(CASE WHEN b.session_status = 2 THEN 1 ELSE 0 END) AS attended_count, " +
            "SUM(CASE WHEN b.session_status IS NULL OR b.session_status IN (0, 1) THEN 1 ELSE 0 END) AS not_attended_count " +
            "FROM courses c " +
            "LEFT JOIN bookings b ON c.id = b.course_id " +
            "GROUP BY c.id, c.title", nativeQuery = true)
    List<Object[]> getCourseAttendanceStats();
}
