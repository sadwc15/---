package com.fitness.entity;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "product_orders")
public class ProductOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long memberId;
    private Long productId;
    private String productName;
    private Double price;
    private String image;
    private LocalDateTime createTime;
}