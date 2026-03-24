package com.fitness.controller;

import com.fitness.entity.Booking;
import com.fitness.entity.Course;
import com.fitness.entity.Member;
import com.fitness.repository.BookingRepository;
import com.fitness.service.StatsService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * @Auther: shifk
 * @Date: 2026/3/14 - 03 - 14 - 16:00
 * @Description: com.fitness.controller
 * @version: 1.0
 */
@RestController
@RequestMapping("/api/session")
@CrossOrigin // 允许 Vue 跨域访问
public class MyCoursesController {

    /// ==================== 上课进度相关 ====================
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private StatsService statsService;
    // 1. 开始上课
    @PostMapping("/start")
    @Transactional
    public ResponseEntity<?> startSession(@RequestParam Long bookingId) {
        try {
            Optional<Booking> opt = bookingRepository.findById(bookingId);
            if (opt.isEmpty()) {
                return ResponseEntity.badRequest().body("预约不存在");
            }

            Booking booking = opt.get();

            // 检查状态：只有待上课(0)才能开始
            Integer sessionStatus = booking.getSessionStatus();
            if (sessionStatus != null && sessionStatus == 1) {
                return ResponseEntity.badRequest().body("课程已开始");
            }
            if (sessionStatus != null && sessionStatus == 2) {
                return ResponseEntity.badRequest().body("课程已完成，无法开始");
            }

            // 设置上课状态为 1（上课中）
            booking.setSessionStatus(1);
            bookingRepository.save(booking);

            Map<String, Object> result = new HashMap<>();
            result.put("bookingId", booking.getId());
            result.put("sessionStatus", 1);
            result.put("message", "开始上课成功");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("开始上课失败: " + e.getMessage());
        }
    }

    // 2. 下课
    @PostMapping("/finish")
    @Transactional
    public ResponseEntity<?> finishSession(@RequestParam Long bookingId) {
        try {
            Optional<Booking> opt = bookingRepository.findById(bookingId);
            if (opt.isEmpty()) {
                return ResponseEntity.badRequest().body("预约不存在");
            }

            Booking booking = opt.get();

            // 检查状态：只有上课中(1)才能下课
            Integer sessionStatus = booking.getSessionStatus();
            if (sessionStatus == null || sessionStatus != 1) {
                return ResponseEntity.badRequest().body("课程未开始或已结束");
            }

            // 设置上课状态为 2（已完成）
            booking.setSessionStatus(2);
            bookingRepository.save(booking);

            Map<String, Object> result = new HashMap<>();
            result.put("bookingId", booking.getId());
            result.put("sessionStatus", 2);
            result.put("message", "下课成功");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("下课失败: " + e.getMessage());
        }
    }

    // 3. 获取课堂信息
    @GetMapping("/info")
    public ResponseEntity<?> getSessionInfo(@RequestParam Long bookingId) {
        try {
            Optional<Booking> opt = bookingRepository.findById(bookingId);
            if (opt.isEmpty()) {
                return ResponseEntity.badRequest().body("预约不存在");
            }

            Booking booking = opt.get();

            Map<String, Object> result = new HashMap<>();
            result.put("id", booking.getId());
            result.put("bookingTime", booking.getBookingTime());
            result.put("status", booking.getStatus());          // 原有订单状态
            result.put("sessionStatus", booking.getSessionStatus()); // 上课状态

            // 课程信息
            Course course = booking.getCourse();
            if (course != null) {
                Map<String, Object> courseMap = new HashMap<>();
                courseMap.put("id", course.getId());
                courseMap.put("title", course.getTitle());
                courseMap.put("price", course.getPrice());
                courseMap.put("image", course.getImage());
                result.put("course", courseMap);
            }

            // 会员信息
            Member member = booking.getMember();
            if (member != null) {
                Map<String, Object> memberMap = new HashMap<>();
                memberMap.put("id", member.getId());
                memberMap.put("name", member.getName());
                memberMap.put("phone", member.getPhone());
                memberMap.put("avatar", member.getAvatar());
                result.put("member", memberMap);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("获取课堂信息失败: " + e.getMessage());
        }
    }

    // 4. 获取教练今天上课的学员列表
    @GetMapping("/coach/active-sessions")
    public ResponseEntity<?> getCoachActiveSessions(@RequestParam Long coachId) {
        try {
            // 查询教练名下所有上课中的预约
            List<Booking> activeList = bookingRepository.findActiveByCoachId(coachId);

            List<Map<String, Object>> result = new ArrayList<>();
            for (Booking b : activeList) {
                Map<String, Object> map = new HashMap<>();
                map.put("bookingId", b.getId());
                map.put("sessionStatus", b.getSessionStatus());
                map.put("bookingTime", b.getBookingTime());

                Course course = b.getCourse();
                if (course != null) {
                    Map<String, Object> courseMap = new HashMap<>();
                    courseMap.put("id", course.getId());
                    courseMap.put("title", course.getTitle());
                    map.put("course", courseMap);
                }

                Member member = b.getMember();
                if (member != null) {
                    Map<String, Object> memberMap = new HashMap<>();
                    memberMap.put("id", member.getId());
                    memberMap.put("name", member.getName());
                    memberMap.put("avatar", member.getAvatar());
                    map.put("member", memberMap);
                }

                result.add(map);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>()); // 出错返回空列表
        }
    }

    // 5. 获取我的上课中课程（学员端）
    @GetMapping("/member/active-session")
    public ResponseEntity<?> getMemberActiveSession(@RequestParam Long memberId) {
        try {
            List<Booking> activeList = bookingRepository.findByMemberIdAndSessionStatus(memberId, 1);

            if (activeList == null || activeList.isEmpty()) {
                return ResponseEntity.ok(null); // 没有上课中的课程
            }

            // 正常情况下，一个人同一时间只能上一节课，取第一个
            Booking booking = activeList.get(0);

            Map<String, Object> result = new HashMap<>();
            result.put("bookingId", booking.getId());
            result.put("sessionStatus", booking.getSessionStatus());

            Course course = booking.getCourse();
            if (course != null) {
                Map<String, Object> courseMap = new HashMap<>();
                courseMap.put("id", course.getId());
                courseMap.put("title", course.getTitle());
                courseMap.put("image", course.getImage());
                result.put("course", courseMap);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("获取失败: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> onLineClass = statsService.getOnLineClass();
        return ResponseEntity.ok(onLineClass);
    }
}
