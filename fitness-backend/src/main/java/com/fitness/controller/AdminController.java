package com.fitness.controller;

import com.fitness.entity.*;
import com.fitness.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin // 允许 Vue 跨域访问
public class AdminController {

    @Autowired private AdminRepository adminRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CoachRepository coachRepository;

    // 1. 管理员登录
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");

        Optional<Admin> adminOpt = adminRepository.findByUsernameAndPassword(username, password);

        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            Map<String, String> res = new HashMap<>();
            res.put("token", "admin-token-" + admin.getId());
            res.put("username", admin.getUsername());
            return ResponseEntity.ok(res);
        } else {
            return ResponseEntity.status(401).body("账号或密码错误");
        }
    }

    // 2. 仪表盘数据 (订单数、课消、上座率、转正率)
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Booking> allBookings = bookingRepository.findAll();
        List<Course> allCourses = courseRepository.findAll();

        // A. 总订单数
        stats.put("orderCount", allBookings.size());

        // B. 课消 (已完成的订单)
        long consumed = allBookings.stream().filter(b -> b.getStatus() == 1).count(); // 假设1是已完成
        stats.put("courseConsumption", consumed);

        // C. 上座率 (简单算法：总预约人数 / 总课程容量 * 100)
        long totalCapacity = allCourses.stream().mapToLong(c -> c.getCapacity() == null ? 0 : c.getCapacity()).sum();
        double attendanceRate = totalCapacity == 0 ? 0 : (double) allBookings.size() / totalCapacity * 100;
        stats.put("attendanceRate", String.format("%.1f", attendanceRate));

        // D. 候补转正率 (模拟数据，因为还没有候补逻辑)
        stats.put("waitlistConversion", "85.2");

        return stats;
    }

    // 3. 商品管理：修改价格和库存
    @PostMapping("/product/update")
    public ResponseEntity<?> updateProduct(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        Product product = productRepository.findById(id).orElseThrow();

        if (params.get("price") != null) product.setPrice(Double.valueOf(params.get("price").toString()));
        if (params.get("stock") != null) product.setStock(Integer.valueOf(params.get("stock").toString()));

        productRepository.save(product);
        return ResponseEntity.ok("更新成功");
    }

    // 4. 用户管理 (获取列表 + 删除)
    @GetMapping("/users")
    public List<Member> getUsers() { return memberRepository.findAll(); }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        memberRepository.deleteById(id);
        return ResponseEntity.ok("删除成功");
    }

    // 5. 修改管理员密码
    @PostMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> params) {
        // 实际项目应该从 Token 获取 ID，这里简化写死 ID=1 或从参数传
        Admin admin = adminRepository.findById(1L).orElseThrow();
        admin.setPassword(params.get("newPassword"));
        adminRepository.save(admin);
        return ResponseEntity.ok("修改成功");
    }
    // === 新增用户 (含密码) ===
    @PostMapping("/users/add")
    public ResponseEntity<?> addUser(@RequestBody Member member) {
        Member existing = memberRepository.findByPhone(member.getPhone());
        if (existing != null) {
            return ResponseEntity.badRequest().body("该手机号已存在");
        }

        // 1. 设置默认余额
        if (member.getBalance() == null) member.setBalance(0.0);

        // 2. 如果没填密码，给个默认密码 (例如 123456)
        if (member.getPassword() == null || member.getPassword().isEmpty()) {
            member.setPassword("123456");
        }

        memberRepository.save(member);
        return ResponseEntity.ok("创建成功");
    }

    // === 更新用户 (含密码) ===
    @PostMapping("/users/update")
    public ResponseEntity<?> updateUser(@RequestBody Member member) {
        return memberRepository.findById(member.getId())
                .map(existing -> {
                    if(member.getName() != null) existing.setName(member.getName());
                    if(member.getPhone() != null) existing.setPhone(member.getPhone());
                    if(member.getBalance() != null) existing.setBalance(member.getBalance());

                    // 3. 如果前端传了新密码，就更新；没传就不动
                    if(member.getPassword() != null && !member.getPassword().isEmpty()) {
                        existing.setPassword(member.getPassword());
                    }

                    memberRepository.save(existing);
                    return ResponseEntity.ok("更新成功");
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok("删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除失败，该商品可能已被关联订单");
        }
    }
}
