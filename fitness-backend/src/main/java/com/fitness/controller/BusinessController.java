package com.fitness.controller;

import com.fitness.entity.Booking;
import com.fitness.entity.ClassRecord;
import com.fitness.entity.Course;
import com.fitness.entity.Member;
import com.fitness.repository.BookingRepository;
import com.fitness.repository.ClassRecordRepository;
import com.fitness.repository.CourseRepository;
import com.fitness.repository.MemberRepository;
import com.fitness.service.BookingService;
import com.fitness.service.MarketingService;
import com.fitness.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/business")
@CrossOrigin
public class BusinessController {

    @Autowired private BookingService bookingService;
    @Autowired private MarketingService marketingService;
    @Autowired private StatsService statsService;

    @Autowired private BookingRepository bookingRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private ClassRecordRepository classRecordRepository;

    // ==================== 核心业务 ====================

    // 1. 预约 (修复版：支持实付金额 + 容忍重复脏数据)
    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> bookCourse(
            @RequestParam Long memberId,
            @RequestParam Long courseId,
            // 接收前端传来的实付金额 (用String接收容错率最高)
            @RequestParam(required = false, defaultValue = "-1") String payAmount
    ) {
        try {
            Member member = memberRepository.findById(memberId).orElse(null);
            Course course = courseRepository.findById(courseId).orElse(null);

            if (member == null || course == null) {
                return ResponseEntity.badRequest().body("用户或课程不存在");
            }

            // 1. 解析前端传过来的实付金额
            double finalPrice = -1.0;
            try {
                if (payAmount != null) {
                    finalPrice = Double.parseDouble(payAmount);
                }
            } catch (Exception e) {
                // 解析失败忽略
            }
            // 如果前端传的金额有效(>=0)，就用前端的；否则用课程原价
            double realPay = (finalPrice >= 0) ? finalPrice : course.getPrice();

            // 2. 余额检查 (用 realPay 判断)
            if (member.getBalance() < realPay) {
                return ResponseEntity.badRequest().body("余额不足，请充值");
            }

            // 3. 检查重复预约 (修复版)
            // 即使数据库里有多条脏数据，只要查出来的列表不为空，就视为已预约
            List<Booking> existList = bookingRepository.findByMemberIdAndCourseId(memberId, courseId);
            if (existList != null && !existList.isEmpty()) {
                return ResponseEntity.badRequest().body("您已预约过该课程");
            }

            // 4. 扣费
            member.setBalance(member.getBalance() - realPay);
            memberRepository.save(member);

            // 5. 创建预约记录
            Booking booking = new Booking();
            booking.setMember(member);
            booking.setCourse(course);
            booking.setBookingTime(LocalDateTime.now());
            booking.setStatus(1); // 1=已预约
            bookingRepository.save(booking);

            return ResponseEntity.ok(booking);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. 获取我的预约列表 (学员端)
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(@RequestParam Long memberId) {
        try {
            List<Booking> bookings = bookingRepository.findByMemberId(memberId);
            List<Map<String, Object>> result = new ArrayList<>();

            for (Booking b : bookings) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", b.getId());
                map.put("course", b.getCourse());
                map.put("bookingTime", b.getBookingTime());

                Integer status = b.getStatus();
                map.put("status", status == null ? 0 : status);

                // 关联课后记录
                ClassRecord record = classRecordRepository.findByBookingId(b.getId());
                if (record != null) {
                    map.put("recordId", record.getId());
                    map.put("hasRecord", true);
                } else {
                    map.put("hasRecord", false);
                }

                result.add(map);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("获取预约列表失败: " + e.getMessage());
        }
    }

    // 3. 获取单条记录详情 (通用)
    @GetMapping("/record/{id}")
    public ResponseEntity<ClassRecord> getRecordDetail(@PathVariable Long id) {
        return ResponseEntity.ok(classRecordRepository.findById(id).orElse(null));
    }

    // 4. 取消预约 (通用)
    @PostMapping("/cancel")
    @Transactional
    public ResponseEntity<?> cancelBooking(@RequestParam Long bookingId) {
        Optional<Booking> opt = bookingRepository.findById(bookingId);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("记录不存在");

        Booking booking = opt.get();
        Integer status = booking.getStatus();
        if (status != null && status == 2) {
            return ResponseEntity.badRequest().body("已经取消过了");
        }

        booking.setStatus(2);
        bookingRepository.save(booking);

        Course course = booking.getCourse();
        if (course.getCapacity() != null) {
            course.setCapacity(course.getCapacity() + 1);
            courseRepository.save(course);
        }

        Member member = booking.getMember();
        // 注意：退款退的是原价。如需精确退款，需在Booking表加字段记录当时的实付金额。
        member.setBalance(member.getBalance() + course.getPrice());
        memberRepository.save(member);

        return ResponseEntity.ok("取消成功");
    }

    // 5. 充值
    @PostMapping("/recharge")
    public ResponseEntity<?> recharge(@RequestParam Long memberId, @RequestParam Double amount) {
        return ResponseEntity.ok(marketingService.recharge(memberId, amount));
    }

    // 6. 统计
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(statsService.getDashboardStats());
    }

    // 7. 获取已预约ID列表 (学员端筛选用)
    @GetMapping("/my-course-ids")
    public ResponseEntity<?> getMyBookedCourseIds(@RequestParam Long memberId) {
        try {
            List<Booking> list = bookingRepository.findByMemberId(memberId);
            List<Long> courseIds = list.stream()
                    .filter(b -> {
                        Integer s = b.getStatus();
                        return s == null || s != 2;
                    })
                    .map(booking -> booking.getCourse().getId())
                    .collect(Collectors.toList());
            return ResponseEntity.ok(courseIds);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // ==================== 教练/报告相关 ====================

    // 8. 模拟课程完成并生成随机报告 (演示用)
    @PostMapping("/simulate-finish")
    @Transactional
    public ResponseEntity<?> simulateClassFinish(@RequestParam Long bookingId) {
        Optional<Booking> opt = bookingRepository.findById(bookingId);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("预约不存在");

        Booking booking = opt.get();
        if (booking.getStatus() != null && booking.getStatus() == 2) {
            return ResponseEntity.badRequest().body("订单已取消，无法结算");
        }

        // 修改状态为已完成
        booking.setStatus(1);
        bookingRepository.save(booking);

        // 如果没有报告，自动生成
        if (classRecordRepository.findByBookingId(bookingId) == null) {
            ClassRecord record = new ClassRecord();
            record.setBookingId(bookingId);
            record.setRecordTime(LocalDateTime.now());

            String[] moods = {"状态爆棚", "稍显疲惫", "非常专注", "进步明显"};
            String[] contents = {
                    "今天的深蹲动作非常标准，核心收紧做得很好！下节课我们尝试增加重量。",
                    "体能还需要加强，后半程有点跟不上节奏，回家记得多做有氧。",
                    "非常棒的一节课！原本担心的膝盖问题完全没有出现，发力感找得很准。",
                    "柔韧性有了很大提升，继续保持！饮食方面注意控制碳水摄入。"
            };
            int idx = (int) (Math.random() * moods.length);

            record.setMood(moods[idx]);
            record.setContent(contents[idx]);
            record.setImages("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500");

            classRecordRepository.save(record);
        }

        return ResponseEntity.ok("课程已模拟完成，报告已生成");
    }

    // 9. [新增] 教练手动写报告接口
    @PostMapping("/write-record")
    @Transactional
    public ResponseEntity<?> writeRecord(@RequestBody ClassRecord record) {
        // 1. 检查预约是否存在
        Optional<Booking> opt = bookingRepository.findById(record.getBookingId());
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("预约不存在");

        Booking booking = opt.get();

        // 2. 强制把预约状态改为已完成 (如果还没改的话)
        if (booking.getStatus() == null || booking.getStatus() != 1) {
            booking.setStatus(1);
            bookingRepository.save(booking);
        }

        // 3. 检查是否已经写过
        ClassRecord exist = classRecordRepository.findByBookingId(record.getBookingId());
        if (exist != null) {
            exist.setContent(record.getContent());
            exist.setMood(record.getMood());
            exist.setImages(record.getImages());
            exist.setRecordTime(LocalDateTime.now());
            classRecordRepository.save(exist);
        } else {
            record.setRecordTime(LocalDateTime.now());
            // 如果前端没传图片，给个默认的
            if (record.getImages() == null || record.getImages().isEmpty()) {
                record.setImages("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500");
            }
            classRecordRepository.save(record);
        }

        return ResponseEntity.ok("报告提交成功");
    }
}
