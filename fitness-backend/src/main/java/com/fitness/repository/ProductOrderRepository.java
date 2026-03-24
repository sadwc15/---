package com.fitness.repository;

import com.fitness.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductOrderRepository extends JpaRepository<ProductOrder, Long> {
    // 根据会员ID查找商品订单
    List<ProductOrder> findByMemberId(Long memberId);
}