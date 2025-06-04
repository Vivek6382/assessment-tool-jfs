package com.assessment.dto;

import java.time.LocalDateTime;

public class AssessmentDTO {
    
    private Integer assessmentId;
    private Integer moduleId;
    private String moduleName;
    private String assessmentTitle;
    private String assessmentDescription;
    private Integer creatorId;
    private String creatorName;
    private String assessmentType;
    private String assessmentStatus;
    private String questionOrder;
    private String instructionText;
    private Integer instructionTimeSeconds;
    private Integer instructionTimeMinutes; // Added from other DTO
    private Boolean hasInstructionTime;
    private Integer assessmentTotalMarks;
    private Integer assessmentPassingScore;
    private String passingScoreUnit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer assessmentDurationMinutes;
    private LocalDateTime createdAt; // Added from other DTO
    
    // Default constructor
    public AssessmentDTO() {
    }
    
    // Full constructor with all fields
    public AssessmentDTO(Integer assessmentId, Integer moduleId, String moduleName, 
                       String assessmentTitle, String assessmentDescription,
                       Integer creatorId, String creatorName, String assessmentType, 
                       String assessmentStatus, String questionOrder, String instructionText, 
                       Integer instructionTimeSeconds, Integer instructionTimeMinutes,
                       Boolean hasInstructionTime, Integer assessmentTotalMarks, 
                       Integer assessmentPassingScore, String passingScoreUnit,
                       LocalDateTime startDate, LocalDateTime endDate,
                       Integer assessmentDurationMinutes, LocalDateTime createdAt) {
        this.assessmentId = assessmentId;
        this.moduleId = moduleId;
        this.moduleName = moduleName;
        this.assessmentTitle = assessmentTitle;
        this.assessmentDescription = assessmentDescription;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.assessmentType = assessmentType;
        this.assessmentStatus = assessmentStatus;
        this.questionOrder = questionOrder;
        this.instructionText = instructionText;
        this.instructionTimeSeconds = instructionTimeSeconds;
        this.instructionTimeMinutes = instructionTimeMinutes;
        this.hasInstructionTime = hasInstructionTime;
        this.assessmentTotalMarks = assessmentTotalMarks;
        this.assessmentPassingScore = assessmentPassingScore;
        this.passingScoreUnit = passingScoreUnit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.assessmentDurationMinutes = assessmentDurationMinutes;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Integer getAssessmentId() {
        return assessmentId;
    }
    
    public void setAssessmentId(Integer assessmentId) {
        this.assessmentId = assessmentId;
    }
    
    public Integer getModuleId() {
        return moduleId;
    }
    
    public void setModuleId(Integer moduleId) {
        this.moduleId = moduleId;
    }
    
    public String getModuleName() {
        return moduleName;
    }
    
    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }
    
    public String getAssessmentTitle() {
        return assessmentTitle;
    }
    
    public void setAssessmentTitle(String assessmentTitle) {
        this.assessmentTitle = assessmentTitle;
    }
    
    public String getAssessmentDescription() {
        return assessmentDescription;
    }
    
    public void setAssessmentDescription(String assessmentDescription) {
        this.assessmentDescription = assessmentDescription;
    }
    
    public Integer getCreatorId() {
        return creatorId;
    }
    
    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }
    
    public String getCreatorName() {
        return creatorName;
    }
    
    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }
    
    public String getAssessmentType() {
        return assessmentType;
    }
    
    public void setAssessmentType(String assessmentType) {
        this.assessmentType = assessmentType;
    }
    
    public String getAssessmentStatus() {
        return assessmentStatus;
    }
    
    public void setAssessmentStatus(String assessmentStatus) {
        this.assessmentStatus = assessmentStatus;
    }
    
    public String getQuestionOrder() {
        return questionOrder;
    }
    
    public void setQuestionOrder(String questionOrder) {
        this.questionOrder = questionOrder;
    }
    
    public String getInstructionText() {
        return instructionText;
    }

    public void setInstructionText(String instructionText) {
        this.instructionText = instructionText;
    }

    public Integer getInstructionTimeSeconds() {
        return instructionTimeSeconds;
    }

    public void setInstructionTimeSeconds(Integer instructionTimeSeconds) {
        this.instructionTimeSeconds = instructionTimeSeconds;
    }

    public Integer getInstructionTimeMinutes() {
        return instructionTimeMinutes;
    }

    public void setInstructionTimeMinutes(Integer instructionTimeMinutes) {
        this.instructionTimeMinutes = instructionTimeMinutes;
    }

    public Boolean getHasInstructionTime() {
        return hasInstructionTime;
    }

    public void setHasInstructionTime(Boolean hasInstructionTime) {
        this.hasInstructionTime = hasInstructionTime;
    }

    public Integer getAssessmentTotalMarks() {
        return assessmentTotalMarks;
    }

    public void setAssessmentTotalMarks(Integer assessmentTotalMarks) {
        this.assessmentTotalMarks = assessmentTotalMarks;
    }

    public Integer getAssessmentPassingScore() {
        return assessmentPassingScore;
    }

    public void setAssessmentPassingScore(Integer assessmentPassingScore) {
        this.assessmentPassingScore = assessmentPassingScore;
    }

    public String getPassingScoreUnit() {
        return passingScoreUnit;
    }

    public void setPassingScoreUnit(String passingScoreUnit) {
        this.passingScoreUnit = passingScoreUnit;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getAssessmentDurationMinutes() {
        return assessmentDurationMinutes;
    }

    public void setAssessmentDurationMinutes(Integer assessmentDurationMinutes) {
        this.assessmentDurationMinutes = assessmentDurationMinutes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}