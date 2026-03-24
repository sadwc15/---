package com.fitness.repository;

import com.fitness.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long> {
    // 基础的增删改查已经由 JpaRepository 提供了，这里通常不需要写额外代码

    Coach findByPhone(String phone);
}
