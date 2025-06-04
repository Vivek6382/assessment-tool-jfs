package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    private Integer courseId;
    private String courseName;
    private Integer courseCredits;
    private String courseDescription;
    private Integer instructorId;
    private String instructorName;
    private LocalDateTime courseStartDate;
    private LocalDateTime courseEndDate;
    private String courseStatus;
    
    
} 