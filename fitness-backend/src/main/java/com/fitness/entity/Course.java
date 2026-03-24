package com.fitness.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    // 课程类型 (GROUP:团课, PRIVATE:私教)
    @Enumerated(EnumType.STRING)
    private CourseType type;

    private String image; // 图片URL
    private Double price;
    private Integer capacity; // 容量

    // 补充时长字段 (前端页面用到了 duration)
    private Integer duration;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    // === 关键修改：加上 @JsonIgnoreProperties ===
    // 作用：当查询出 Course 时，序列化 coach 字段，但忽略 coach 里面的 courses 列表
    // 防止死循环：Course -> Coach -> List<Course> -> Coach ...
    @ManyToOne
    @JoinColumn(name = "coach_id")
    @JsonIgnoreProperties({"courses", "password"}) // 同时隐藏密码
    private Coach coach;

    public enum CourseType {
        GROUP, PRIVATE,CAMP
    }
}