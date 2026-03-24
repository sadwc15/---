package com.fitness.service;

import com.fitness.entity.*;
import com.fitness.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MarketingService {
    @Autowired
    private MemberRepository memberRepository;

    // 模拟会员充值（对接支付接口的回调逻辑）
    @Transactional
    public Member recharge(Long memberId, Double amount) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        member.setBalance(member.getBalance() + amount);

        // 简单的营销逻辑：充值满1000送100
        if (amount >= 1000) {
            member.setBalance(member.getBalance() + 100);
        }
        return memberRepository.save(member);
    }
}