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
	public Integer getAssessmentDurationMinutes() {
		return assessmentDurationMinutes;
	}
	public void setAssessmentDurationMinutes(Integer assessmentDurationMinutes) {
		this.assessmentDurationMinutes = assessmentDurationMinutes;
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
	public String getAssessmentStatus() {
		return assessmentStatus;
	}
	public void setAssessmentStatus(String assessmentStatus) {
		this.assessmentStatus = assessmentStatus;
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
	public String getInstructionText() {
		return instructionText;
	}
	public void setInstructionText(String instructionText) {
		this.instructionText = instructionText;
	}
	public Integer getInstructionTimeMinutes() {
		return instructionTimeMinutes;
	}
	public void setInstructionTimeMinutes(Integer instructionTimeMinutes) {
		this.instructionTimeMinutes = instructionTimeMinutes;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public Assessment(Integer assessmentId, Integer moduleId, String moduleName, String assessmentTitle,
			String assessmentDescription, Integer creatorId, String creatorName, String assessmentType,
			Integer assessmentDurationMinutes, Integer assessmentTotalMarks, Integer assessmentPassingScore,
			String assessmentStatus, LocalDateTime startDate, LocalDateTime endDate, String instructionText,
			Integer instructionTimeMinutes, LocalDateTime createdAt) {
		super();
		this.assessmentId = assessmentId;
		this.moduleId = moduleId;
		this.moduleName = moduleName;
		this.assessmentTitle = assessmentTitle;
		this.assessmentDescription = assessmentDescription;
		this.creatorId = creatorId;
		this.creatorName = creatorName;
		this.assessmentType = assessmentType;
		this.assessmentDurationMinutes = assessmentDurationMinutes;
		this.assessmentTotalMarks = assessmentTotalMarks;
		this.assessmentPassingScore = assessmentPassingScore;
		this.assessmentStatus = assessmentStatus;
		this.startDate = startDate;
		this.endDate = endDate;
		this.instructionText = instructionText;
		this.instructionTimeMinutes = instructionTimeMinutes;
		this.createdAt = createdAt;
	}
	public Assessment() {
		super();
		// TODO Auto-generated constructor stub
	}

    
   
} 