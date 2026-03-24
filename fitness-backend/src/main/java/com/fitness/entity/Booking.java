package com.fitness.entity;

import lombok.Data;
import jakarta.persistence.*; // 或者 jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime bookingTime;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // === 重点修改这里 ===
    // 确保它是 Integer，而不是 String
    // 0: 正常, 1: 完成, 2: 取消
    private Integer status = 0;

    // === 新增：上课状态字段 ===
    // 0:待上课 1:上课中 2:已完成
    @Column(name = "session_status", columnDefinition = "int default 0")
    private Integer sessionStatus = 0;
}
