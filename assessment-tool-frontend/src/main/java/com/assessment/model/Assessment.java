package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {
    private Integer assessmentId;
    private Integer moduleId;
    private String moduleName;
    private String assessmentTitle;
    private String assessmentDescription;
    private Integer creatorId;
    private String creatorName;
    private String assessmentType;
    private Integer assessmentDurationMinutes;
    private Integer assessmentTotalMarks;
    private Integer assessmentPassingScore;
    private String assessmentStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String instructionText;
    private Integer instructionTimeMinutes;
    private LocalDateTime createdAt;
    
   
} 