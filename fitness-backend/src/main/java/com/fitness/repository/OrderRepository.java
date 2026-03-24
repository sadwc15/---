package com.fitness.repository;

import com.fitness.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 查询某会员的所有订单（用于小程序“我的订单”页面）
    List<Order> findByMemberId(Long memberId);
}