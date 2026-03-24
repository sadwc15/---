package com.fitness.controller;

import com.fitness.entity.Coach;
import com.fitness.entity.Member;
import com.fitness.repository.CoachRepository;
import com.fitness.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired private MemberRepository memberRepository;
    @Autowired private CoachRepository coachRepository;

    // 会员注册
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        if (memberRepository.findByPhone(member.getPhone()) != null) {
            return ResponseEntity.badRequest().body("该手机号已注册");
        }
        // 默认送50元体验金
        member.setBalance(50.0);
        Member saved = memberRepository.save(member);
        return ResponseEntity.ok(saved);
    }

    // 统一登录接口 (支持会员和教练)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String phone = loginData.get("phone");
        String password = loginData.get("password");
        String role = loginData.get("role"); // "MEMBER" 或 "COACH"

        Map<String, Object> response = new HashMap<>();

        if ("COACH".equals(role)) {
            // 教练登录逻辑 (简单的遍历查找，实际应在Repository加findByPhone)
            // 为了方便小白，这里暂时用简单的流处理，你也可以在CoachRepository加方法
            Coach coach = coachRepository.findAll().stream()
                    .filter(c -> phone.equals(c.getPhone()))
                    .findFirst().orElse(null);

            if (coach != null && coach.getPassword().equals(password)) {
                coach.setLoginCount(coach.getLoginCount() == null ? 1 : coach.getLoginCount() + 1);
                coach.setLastLoginTime(LocalDateTime.now());
                coachRepository.save(coach);

                response.put("user", coach);
                response.put("role", "COACH");
                return ResponseEntity.ok(response);
            }
        } else {
            // 会员登录逻辑
            Member member = memberRepository.findByPhone(phone);
            if (member != null && member.getPassword().equals(password)) {
                response.put("user", member);
                response.put("role", "MEMBER");
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("账号或密码错误");
    }
}