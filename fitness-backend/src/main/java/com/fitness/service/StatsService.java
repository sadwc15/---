package com.fitness.service;

import com.fitness.dto.CoachCourseStatsDTO;
import com.fitness.dto.CourseAttendanceStatsDTO;
import com.fitness.entity.Coach;
import com.fitness.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ClassRecordRepository classRecordRepository;

    @Autowired
    private CoachRepository coachRepository;

    // 根据手机号查询教练累计上课节数
    public Integer getCoachTotalClassesByPhone(String phone) {
        // 1. 根据手机号查询教练
        Coach coach = coachRepository.findByPhone(phone);
        if (coach == null) {
            return 0;
        }

        // 2. 统计该教练名下所有已完成的课程
        // bookings.session_status = 2 表示已完成
        return bookingRepository.countCompletedByCoachId(coach.getId());
    }

    public List<CourseAttendanceStatsDTO> getCourseAttendanceStats() {
        List<Object[]> results = courseRepository.getCourseAttendanceStats();
        List<CourseAttendanceStatsDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            CourseAttendanceStatsDTO dto = new CourseAttendanceStatsDTO();
            dto.setCourseId(((Number) row[0]).longValue());
            dto.setCourseName((String) row[1]);
            dto.setAttendedCount(((Number) row[2]).longValue());
            dto.setNotAttendedCount(((Number) row[3]).longValue());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public List<CoachCourseStatsDTO> getCoachCourseStats() {
        List<Object[]> results = courseRepository.getCoachCourseStats();
        List<CoachCourseStatsDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            CoachCourseStatsDTO dto = new CoachCourseStatsDTO();
            dto.setCourseId(((Number) row[0]).longValue());
            dto.setCourseName((String) row[1]);
            dto.setCoachId(((Number) row[2]).longValue());
            dto.setCoachName((String) row[3]);
            dto.setSelectedCount(((Number) row[4]).longValue());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("memberCount", memberRepository.count());
        stats.put("activeCourses", courseRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        // 实际项目中这里应使用复杂的 SQL 聚合查询今日收入
        stats.put("todayIncome", 12800.00);
        return stats;
    }

    public Map<String, Object> getOnLineClass() {
        Map<String, Object> result = new HashMap<>();

        // 1. 今天的时间范围
        LocalDateTime start = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = start.plusDays(1);

        // 2. 查询今天上课的课程ID列表
        List<Long> courseIds = courseRepository.findCourseIdsByStartTimeBetween(start, end);

        if (courseIds.isEmpty()) {
            result.put("todayClasses", 0);
            return result;
        }

        // 3. 统计这些课程对应的已上课预约数（session_status = 2）
        Integer todayClasses = bookingRepository.countCompletedByCourseIds(courseIds);
        result.put("todayClasses", todayClasses == null ? 0 : todayClasses);

        return result;
    }
}
