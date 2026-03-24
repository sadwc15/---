package com.fitness.entity;

import lombok.Data;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "class_records")
public class ClassRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId; // 关联哪次预约

    private String content; // 记录内容
    private String mood;    // 状态标签
    private LocalDateTime recordTime;
    private String images;  // 图片
}