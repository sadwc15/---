package com.fitness.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "coaches")
public class Coach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tags;
    private String phone;
    private String password;
    private String name;
    private String expertise; // 擅长领域
    private String bio;       // 个人简介
    private String avatar;
    private Integer loginCount;
    private LocalDateTime lastLoginTime;
    @OneToMany(mappedBy = "coach")
    @JsonIgnore
    private List<Course> courses;
}