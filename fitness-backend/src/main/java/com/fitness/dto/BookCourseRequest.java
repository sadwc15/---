package com.fitness.dto;

import lombok.Data;

@Data
public class BookCourseRequest {
    private Long memberId;
    private Long courseId;
    // 如果后续要支持选具体时间段，可以在这里加 private String selectTime;
}