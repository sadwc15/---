package com.fitness.controller;

import com.fitness.entity.Course;
import com.fitness.entity.News;
import com.fitness.entity.Product;
import com.fitness.repository.CourseRepository;
import com.fitness.repository.NewsRepository;
import com.fitness.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
@CrossOrigin
public class PublicController {

    @Autowired private ProductRepository productRepository;
    @Autowired private NewsRepository newsRepository;
    @Autowired private CourseRepository courseRepository;

    // 1. 获取所有商品
    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    // 2. 获取单个商品详情
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. 获取所有资讯
    @GetMapping("/news")
    public List<News> getNews() {
        return newsRepository.findAll();
    }

    // 4. 获取单条资讯详情
    @GetMapping("/news/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        Optional<News> news = newsRepository.findById(id);
        return news.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/courses")
    public List<Course> getCourses(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            try {
                // 1. 转大写 (前端传 private -> 后端 PRIVATE)
                String typeStr = type.toUpperCase();

                // 2. 兼容处理 (如果你的前端传 'project'，但数据库存的是 'CAMP')
                if ("PROJECT".equals(typeStr)) {
                     typeStr = "CAMP"; // 如果你的 CourseType 枚举里是 CAMP，请解开这行注释
                }

                // 3. 转换枚举并查询
                Course.CourseType courseType = Course.CourseType.valueOf(typeStr);
                return courseRepository.findByType(courseType);

            } catch (IllegalArgumentException e) {
                // 如果类型传错了(比如传了 aaa)，返回空列表，不报错
                System.err.println("收到无效的课程类型: " + type);
                return List.of();
            }
        }
        // 如果没传 type 参数，返回所有课程
        return courseRepository.findAll();
    }

    // 6. 获取单个课程详情
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseDetail(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}