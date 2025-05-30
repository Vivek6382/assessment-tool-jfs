package com.assessment.dto;

import java.time.LocalDateTime;

public class ResultDTO {
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
    
    // Getters and Setters
    public Integer getResultId() {
        return resultId;
    }
    
    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }
    
    public Integer getAssessmentId() {
        return assessmentId;
    }
    
    public void setAssessmentId(Integer assessmentId) {
        this.assessmentId = assessmentId;
    }
    
    public String getAssessmentTitle() {
        return assessmentTitle;
    }
    
    public void setAssessmentTitle(String assessmentTitle) {
        this.assessmentTitle = assessmentTitle;
    }
    
    public Integer getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public Integer getTotalMarks() {
        return totalMarks;
    }
    
    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }
    
    public Integer getObtainedMarks() {
        return obtainedMarks;
    }
    
    public void setObtainedMarks(Integer obtainedMarks) {
        this.obtainedMarks = obtainedMarks;
    }
    
    public Float getResultPercentage() {
        return resultPercentage;
    }
    
    public void setResultPercentage(Float resultPercentage) {
        this.resultPercentage = resultPercentage;
    }
    
    public String getResultStatus() {
        return resultStatus;
    }
    
    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }
    
    public LocalDateTime getCompletedDate() {
        return completedDate;
    }
    
    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
    }
}