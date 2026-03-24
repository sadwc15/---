package com.fitness.controller;

import com.fitness.entity.Member;
import com.fitness.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    // 1. 登录接口
    // (如果你的 MemberRepository 里没有 findByPhone，请去 Repository 加一行: Member findByPhone(String phone);)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String phone = loginData.get("phone");
        String password = loginData.get("password");

        // 这里假设你的 MemberRepository 里有 findByPhone 方法
        // 如果报错找不到方法，请检查 Repository
        Member member = memberRepository.findByPhone(phone);

        if (member != null && member.getPassword().equals(password)) {
            return ResponseEntity.ok(member);
        }
        return ResponseEntity.status(401).body("用户名或密码错误");
    }

    // 2. 获取用户信息 (余额刷新专用)
    // === 关键修复：只保留这一个处理 /{id} 的方法 ===
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberInfo(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        return member.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. 注册接口 (如果有的话，保留在这里)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        if (memberRepository.findByPhone(member.getPhone()) != null) {
            return ResponseEntity.badRequest().body("手机号已被注册");
        }
        member.setBalance(0.0); // 初始余额
        memberRepository.save(member);
        return ResponseEntity.ok("注册成功");
    }

    @GetMapping("/by-phone")
    public ResponseEntity<?> getMemberByPhone(@RequestParam String phone) {
        Member member = memberRepository.findByPhone(phone);
        if (member == null) {
            return ResponseEntity.badRequest().body("会员不存在");
        }
        return ResponseEntity.ok(member);
    }
}
