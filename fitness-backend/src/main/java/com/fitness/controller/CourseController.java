package com.fitness.controller;

import com.fitness.entity.Course;
import com.fitness.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin // 允许跨域，防止前端调不通
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return courseRepository.findByTitleContaining(search);
        }
        return courseRepository.findAll();
    }
}