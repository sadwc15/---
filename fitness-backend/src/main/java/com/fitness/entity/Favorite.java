package com.fitness.entity;
import lombok.Data;
import jakarta.persistence.*; // 或 jakarta.persistence
import java.time.LocalDateTime;

@Data @Entity @Table(name = "favorites")
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long memberId;
    private Long targetId;
    private String type; // PRODUCT 或 COURSE
    private LocalDateTime createTime;
}