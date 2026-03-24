package com.fitness.controller;

import com.fitness.entity.*;
import com.fitness.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin
public class ShopController {

    @Autowired private ProductRepository productRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private ProductOrderRepository productOrderRepository;
    @Autowired private FavoriteRepository favoriteRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private OrderReceiverRepository orderReceiverRepository;

    /**
     * 保存收货信息
     */
    @PostMapping("/save-receiver")
    public ResponseEntity<?> saveReceiver(@RequestBody OrderReceiver receiver) {
        // 参数校验
        if (receiver.getProductOrdersId() == null) {
            return ResponseEntity.badRequest().body("订单ID不能为空");
        }
        if (receiver.getName() == null || receiver.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("收货人姓名不能为空");
        }
        if (receiver.getPhone() == null || receiver.getPhone().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("手机号不能为空");
        }
        if (receiver.getAddress() == null || receiver.getAddress().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("收货地址不能为空");
        }

        // 检查订单是否存在
        Optional<ProductOrder> order = productOrderRepository.findById(receiver.getProductOrdersId());
        if (!order.isPresent()) {
            return ResponseEntity.badRequest().body("订单不存在");
        }

        receiver.setCreateTime(LocalDateTime.now());
        OrderReceiver saved = orderReceiverRepository.save(receiver);
        return ResponseEntity.ok(saved);
    }

    /**
     * 购买商品（返回订单信息）
     */
    @PostMapping("/buy")
    @Transactional
    public ResponseEntity<?> buyProduct(@RequestParam Long memberId, @RequestParam Long productId) {
        Member member = memberRepository.findById(memberId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (member == null) {
            return ResponseEntity.badRequest().body("用户不存在");
        }
        if (product == null) {
            return ResponseEntity.badRequest().body("商品不存在");
        }
        if (member.getBalance() < product.getPrice()) {
            return ResponseEntity.badRequest().body("余额不足，请先充值");
        }
        if (product.getStock() <= 0) {
            return ResponseEntity.badRequest().body("库存不足");
        }

        // 扣钱
        member.setBalance(member.getBalance() - product.getPrice());
        memberRepository.save(member);

        // 扣库存
        product.setStock(product.getStock() - 1);
        productRepository.save(product);

        // 生成订单
        ProductOrder order = new ProductOrder();
        order.setMemberId(memberId);
        order.setProductId(productId);
        order.setProductName(product.getName());
        order.setPrice(product.getPrice());
        order.setImage(product.getImage());
        order.setCreateTime(LocalDateTime.now());

        ProductOrder savedOrder = productOrderRepository.save(order);

        // 返回订单ID
        Map<String, Object> result = new HashMap<>();
        result.put("id", savedOrder.getId());
        result.put("message", "购买成功");

        return ResponseEntity.ok(result);
    }

    /**
     * 获取我的商品订单
     */
    @GetMapping("/orders")
    public List<ProductOrder> getMyOrders(@RequestParam Long memberId) {
        return productOrderRepository.findByMemberId(memberId);
    }

    /**
     * 添加/取消收藏
     */
    @PostMapping("/favorite")
    public ResponseEntity<?> toggleFavorite(@RequestBody Favorite fav) {
        fav.setCreateTime(LocalDateTime.now());
        favoriteRepository.save(fav);
        return ResponseEntity.ok("收藏成功");
    }

    /**
     * 获取我的收藏列表
     */
    @GetMapping("/favorites")
    public List<Map<String, Object>> getMyFavorites(@RequestParam Long memberId) {
        List<Favorite> favs = favoriteRepository.findByMemberId(memberId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Favorite f : favs) {
            Map<String, Object> map = new HashMap<>();
            map.put("type", f.getType());
            map.put("favoriteId", f.getId());
            map.put("createTime", f.getCreateTime());

            if ("PRODUCT".equals(f.getType())) {
                productRepository.findById(f.getTargetId()).ifPresent(p -> {
                    map.put("detail", p);
                    map.put("name", p.getName());
                    map.put("price", p.getPrice());
                    map.put("image", p.getImage());
                });
            } else {
                courseRepository.findById(f.getTargetId()).ifPresent(c -> {
                    map.put("detail", c);
                    map.put("name", c.getTitle());
                    map.put("price", c.getPrice());
                    map.put("image", c.getImage());
                });
            }
            result.add(map);
        }
        return result;
    }
}
