package com.fitness.repository;

import com.fitness.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // 根据手机号查找会员（登录时用）
    Member findByPhone(String phone);
}
