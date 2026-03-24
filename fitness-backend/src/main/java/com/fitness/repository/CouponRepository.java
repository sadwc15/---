package com.fitness.repository;

import com.fitness.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    // 根据兑换码查找优惠券（用于用户输入兑换码）
    Optional<Coupon> findByCode(String code);
}