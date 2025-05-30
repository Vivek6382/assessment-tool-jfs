package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private Integer resultId;
    private Integer assessmentId;
    private String assessmentTitle;
    private Integer studentId;
    private String studentName;
    private Integer totalMarks;
    private Integer obtainedMarks;
    private Float resultPercentage;
    private String resultStatus;
    private LocalDateTime completedDate;
    
    
} 