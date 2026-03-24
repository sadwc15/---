package com.fitness.dto;

import lombok.Data;

@Data
public class CourseAttendanceStatsDTO {
    private Long courseId;
    private String courseName;
    private Long attendedCount;
    private Long notAttendedCount;
}
