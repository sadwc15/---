package com.fitness.controller;

import com.fitness.entity.Member;
import com.fitness.entity.MemberProfile;
import com.fitness.repository.MemberProfileRepository;
import com.fitness.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member/profile")
public class MemberProfileController {

    @Autowired
    private MemberProfileRepository profileRepository;

    @Autowired
    private MemberRepository memberRepository;

    // 查询：如果 profile 不存在就自动创建一条空的
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getProfile(@PathVariable Long memberId) {
        Member member = memberRepository.findById(memberId).orElse(null);
        if (member == null) {
            return ResponseEntity.badRequest().body("会员不存在");
        }

        MemberProfile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> {
                    MemberProfile newProfile = new MemberProfile();
                    newProfile.setMemberId(memberId);
                    return profileRepository.save(newProfile);
                });

        // 返回手机号 + profile 信息
        return ResponseEntity.ok(new ProfileResponse(member, profile));
    }

    // 更新头像（只修改 members 表的 avatar 字段）
    @PostMapping("/update-avatar")
    public ResponseEntity<?> updateAvatar(@RequestBody Map<String, Object> request) {
        try {
            Long memberId = Long.parseLong(request.get("memberId").toString());
            String avatarUrl = request.get("avatar").toString();

            Member member = memberRepository.findById(memberId).orElse(null);
            if (member == null) {
                return ResponseEntity.badRequest().body("会员不存在");
            }

            member.setAvatar(avatarUrl);
            memberRepository.save(member);

            Map<String, String> result = new HashMap<>();
            result.put("avatar", avatarUrl);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新头像失败");
        }
    }

    // 更新或创建扩展信息
    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody MemberProfile profile) {
        // 先查询是否已存在
        Optional<MemberProfile> existingProfile = profileRepository.findByMemberId(profile.getMemberId());

        MemberProfile saved;
        if (existingProfile.isPresent()) {
            // 存在则更新
            MemberProfile existing = existingProfile.get();
            existing.setBirthday(profile.getBirthday());
            existing.setGender(profile.getGender());
            existing.setAddress(profile.getAddress());
            saved = profileRepository.save(existing);
        } else {
            // 不存在则插入
            saved = profileRepository.save(profile);
        }

        return ResponseEntity.ok(saved);
    }

    // 内部 DTO
    static class ProfileResponse {
        public String phone;
        public String name;
        public java.time.LocalDate birthday;
        public Integer gender;
        public String address;
        public String avatar;

        public ProfileResponse(Member member, MemberProfile profile) {
            this.phone = member.getPhone();
            this.name = member.getName();
            this.birthday = profile.getBirthday();
            this.gender = profile.getGender();
            this.address = profile.getAddress();
            this.avatar = member.getAvatar();
        }
    }
}
