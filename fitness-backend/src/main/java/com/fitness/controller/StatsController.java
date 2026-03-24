package com.fitness.controller;

import com.fitness.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin
public class StatsController {

    @Autowired
    private StatsService statsService;

    // 获取教练累计上课节数
    @GetMapping("/coach/total-classes")
    public ResponseEntity<?> getCoachTotalClasses(@RequestParam String phone) {
        Integer total = statsService.getCoachTotalClassesByPhone(phone);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        return statsService.getDashboardStats();
    }

    @GetMapping("/course-attendance-stats")
    public ResponseEntity<?> getCourseAttendanceStats() {
        return ResponseEntity.ok(statsService.getCourseAttendanceStats());
    }

    @GetMapping("/coach-course-stats")
    public ResponseEntity<?> getCoachCourseStats() {
        return ResponseEntity.ok(statsService.getCoachCourseStats());
    }
}
