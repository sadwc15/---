package com.fitness.service;

import com.fitness.entity.*;
import com.fitness.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {
    @Autowired private MemberRepository memberRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private BookingRepository bookingRepository;

    @Transactional(rollbackFor = Exception.class)
    public Booking bookCourse(Long memberId, Long courseId) throws Exception {
        // 1. 获取数据
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new Exception("会员不存在"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new Exception("课程不存在"));

        // 2. 校验逻辑
        if (course.getCapacity() <= 0) {
            throw new Exception("课程已满员");
        }
        if (member.getBalance() < course.getPrice()) {
            throw new Exception("余额不足，请充值");
        }

        // 3. 执行扣款和库存扣减
        member.setBalance(member.getBalance() - course.getPrice());
        course.setCapacity(course.getCapacity() - 1);

        // 4. 保存变更
        memberRepository.save(member);
        courseRepository.save(course);

        // 5. 生成预约记录
        Booking booking = new Booking();
        booking.setMember(member);
        booking.setCourse(course);
        return bookingRepository.save(booking);
    }
}