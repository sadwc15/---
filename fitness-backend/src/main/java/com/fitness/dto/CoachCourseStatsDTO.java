package com.fitness.dto;

import lombok.Data;

@Data
public class CoachCourseStatsDTO {
    private Long courseId;
    private String courseName;
    private Long coachId;
    private String coachName;
    private Long selectedCount;
}
