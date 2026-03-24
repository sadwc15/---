package com.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;      // 兑换码

    private Double discountAmount; // 减免金额
    private Double minSpend;       // 最低消费要求

    private String status;    // ACTIVE, EXPIRED
    private LocalDateTime expireDate; // 过期时间
}