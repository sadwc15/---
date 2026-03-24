package com.fitness.repository;

import com.fitness.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    // 根据会员ID查找收藏列表
    List<Favorite> findByMemberId(Long memberId);
}