package com.fitness.controller;

import com.fitness.entity.Booking;
import com.fitness.entity.Coach;
import com.fitness.entity.Course;
import com.fitness.entity.Member;
import com.fitness.repository.BookingRepository;
import com.fitness.repository.CoachRepository;
import com.fitness.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coach")
@CrossOrigin
public class CoachController {

    @Autowired private CourseRepository courseRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private CoachRepository coachRepository;

    // 1. 获取教练的所有课程
    @GetMapping("/{coachId}/courses")
    public List<Course> getMyCourses(@PathVariable Long coachId) {
        return courseRepository.findByCoachId(coachId);
    }

    // ==========================================
    // 2. [增强调试版] 新增 or 修改课程
    // ==========================================
    @PostMapping({"/courses", "/course"})
    public ResponseEntity<?> saveCourse(@RequestBody Map<String, Object> params) {
        try {
            // === 调试日志：打印收到的所有参数 ===
            System.out.println("===== 接收到课程保存请求 =====");
            System.out.println("参数内容: " + params);

            // 1. 安全解析 ID
            Long id = null;
            if (params.get("id") != null && !params.get("id").toString().isEmpty()) {
                id = Long.valueOf(params.get("id").toString());
            }

            // 2. 安全解析 CoachID
            if (params.get("coachId") == null) {
                return ResponseEntity.badRequest().body("错误：coachId 不能为空");
            }
            Long coachId = Long.valueOf(params.get("coachId").toString());

            // 3. 安全解析其他字段
            String title = (String) params.get("title");

            Double price = 0.0;
            if (params.get("price") != null) {
                price = Double.valueOf(params.get("price").toString());
            }

            String description = (String) params.get("description");

            Integer duration = 60;
            if (params.get("duration") != null) {
                duration = Double.valueOf(params.get("duration").toString()).intValue();
            }

            String image = (String) params.get("image");

            // 4. 安全解析时间
            // 前端传来 "2025-12-01T10:00:00"
            String startTimeStr = (String) params.get("startTime");
            if (startTimeStr == null) {
                return ResponseEntity.badRequest().body("错误：startTime 不能为空");
            }
            // 兼容处理：有些前端组件可能传过来的 T 前后有空格，或者没有秒
            // 这里做简单清洗
            startTimeStr = startTimeStr.trim();
            if (startTimeStr.length() == 16) {
                startTimeStr += ":00"; // 补全秒
            }
            LocalDateTime startTime = LocalDateTime.parse(startTimeStr);

            // 5. 查找教练
            Coach coach = coachRepository.findById(coachId)
                    .orElseThrow(() -> new RuntimeException("错误：找不到ID为 " + coachId + " 的教练"));

            Course course;
            if (id != null) {
                Optional<Course> opt = courseRepository.findById(id);
                course = opt.orElse(new Course());
            } else {
                course = new Course();
            }

            // 6. 赋值
            course.setCoach(coach);
            course.setTitle(title);
            course.setPrice(price);
            course.setDescription(description);
            course.setDuration(duration);
            course.setImage(image);
            course.setStartTime(startTime);
            course.setType(Course.CourseType.PRIVATE);
            if (course.getCapacity() == null) course.setCapacity(1);

            System.out.println("准备保存课程: " + title + " 教练: " + coach.getName());

            courseRepository.save(course);

            System.out.println("===== 保存成功 =====");
            return ResponseEntity.ok("保存成功");

        } catch (Exception e) {
            e.printStackTrace(); // 在控制台打印报错堆栈
            System.err.println("保存失败原因: " + e.getMessage());
            // 将具体错误返回给前端，方便你在 Network -> Response 里看
            return ResponseEntity.internalServerError().body("后端报错: " + e.getMessage());
        }
    }

    // 3. 删除课程
    @DeleteMapping({"/courses/{courseId}", "/course/{courseId}"})
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        try {
            // 先把相关的预约都删了（为了方便测试，实际项目不能这样）
            List<Booking> bookings = bookingRepository.findByCourseId(courseId);
            bookingRepository.deleteAll(bookings);

            courseRepository.deleteById(courseId);
            return ResponseEntity.ok("删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除失败: " + e.getMessage());
        }
    }

    // 4. 获取课程排期
    @GetMapping("/{coachId}/schedule")
    public List<Map<String, Object>> getSchedule(
            @PathVariable Long coachId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if (startDate == null) startDate = LocalDate.now().minusDays(7);
        if (endDate == null) endDate = startDate.plusDays(60);
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        List<Course> allCourses = courseRepository.findByCoachId(coachId);
        LocalDateTime finalStart = start;
        LocalDateTime finalEnd = end;
        List<Course> filteredCourses = allCourses.stream()
                .filter(c -> !c.getStartTime().isBefore(finalStart) && !c.getStartTime().isAfter(finalEnd))
                .collect(Collectors.toList());
        filteredCourses.sort((a, b) -> a.getStartTime().compareTo(b.getStartTime()));
        List<Map<String, Object>> result = new ArrayList<>();
        for (Course c : filteredCourses) {
            Map<String, Object> map = new HashMap<>();
            map.put("course", c);
            List<Booking> bookings = bookingRepository.findByCourseId(c.getId());
            map.put("bookedCount", bookings.size());
            List<Member> students = bookings.stream().map(Booking::getMember).collect(Collectors.toList());
            map.put("students", students);
            result.add(map);
        }
        return result;
    }

    // 5. 获取学员名单
    @GetMapping("/course/{courseId}/students")
    public List<Member> getStudents(@PathVariable Long courseId) {
        return bookingRepository.findByCourseId(courseId).stream()
                .map(Booking::getMember)
                .collect(Collectors.toList());
    }

    // 6. 修改密码
    @PostMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> data) {
        Long coachId = Long.parseLong(data.get("id"));
        String newPwd = data.get("password");
        Coach coach = coachRepository.findById(coachId).orElseThrow();
        coach.setPassword(newPwd);
        coachRepository.save(coach);
        return ResponseEntity.ok("修改成功");
    }

    // 7. 获取我的预约记录
    @GetMapping("/my-schedule")
    public ResponseEntity<?> getMyBookingSchedule(@RequestParam Long coachId) {
        try {
            List<Course> courses = courseRepository.findByCoachId(coachId);
            List<Long> courseIds = courses.stream().map(Course::getId).collect(Collectors.toList());
            if (courseIds.isEmpty()) return ResponseEntity.ok(new ArrayList<>());
            List<Booking> bookings = bookingRepository.findByCourseIdIn(courseIds);
            List<Map<String, Object>> result = new ArrayList<>();
            for (Booking b : bookings) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", b.getId());
                map.put("bookingTime", b.getBookingTime());
                Integer status = b.getStatus();
                map.put("status", status == null ? 0 : status);
                if (b.getCourse() != null) map.put("course", b.getCourse());
                if (b.getMember() != null) map.put("member", b.getMember());
                result.add(map);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}