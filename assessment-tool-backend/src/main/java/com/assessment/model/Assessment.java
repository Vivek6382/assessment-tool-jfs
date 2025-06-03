package com.assessment.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assessments")
public class Assessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Integer assessmentId;
    
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "module_id")
    private Module module;
    
    @Column(name = "assessment_title")
    private String assessmentTitle;
    
    @Column(name = "assessment_description", columnDefinition = "TEXT")
    private String assessmentDescription;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "assessment_type")
    private String assessmentType;
    
    @Column(name = "assessment_status")
    private String assessmentStatus;
    
    // Add this new field for question ordering
    @Column(name = "question_order")
    private String questionOrder; // Can be: FIXED, RANDOM, DIFFICULTY
    
    
 // Add these fields to your Assessment.java model class
    @Column(name = "instruction_text", columnDefinition = "TEXT")
    private String instructionText;

    @Column(name = "instruction_time_seconds")
    private Integer instructionTimeSeconds;

    @Column(name = "has_instruction_time")
    private Boolean hasInstructionTime;
    
    
    
    
 // Add these fields to your Assessment.java model class
    @Column(name = "assessment_total_marks")
    private Integer assessmentTotalMarks;

    @Column(name = "assessment_passing_score")
    private Integer assessmentPassingScore;

    @Column(name = "passing_score_unit")
    private String passingScoreUnit; // Can be "PERCENT" or "POINTS"
    
    
    
    
 // Add these fields to your Assessment.java model class
    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "assessment_duration_minutes")
    private Integer assessmentDurationMinutes;
    
    
    
    // Syed Anees
    
    @ManyToOne
    @JoinColumn(name = "assessment_creator_id")
    private User creator;



	public Integer getAssessmentId() {
		return assessmentId;
	}



	public void setAssessmentId(Integer assessmentId) {
		this.assessmentId = assessmentId;
	}



	public Module getModule() {
		return module;
	}



	public void setModule(Module module) {
		this.module = module;
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



	public LocalDateTime getCreatedAt() {
		return createdAt;
	}



	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
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



	public User getCreator() {
		return creator;
	}



	public void setCreator(User creator) {
		this.creator = creator;
	}



	public Assessment(Integer assessmentId, Module module, String assessmentTitle, String assessmentDescription,
			LocalDateTime createdAt, String assessmentType, String assessmentStatus, String questionOrder,
			String instructionText, Integer instructionTimeSeconds, Boolean hasInstructionTime,
			Integer assessmentTotalMarks, Integer assessmentPassingScore, String passingScoreUnit,
			LocalDateTime startDate, LocalDateTime endDate, Integer assessmentDurationMinutes, User creator) {
		super();
		this.assessmentId = assessmentId;
		this.module = module;
		this.assessmentTitle = assessmentTitle;
		this.assessmentDescription = assessmentDescription;
		this.createdAt = createdAt;
		this.assessmentType = assessmentType;
		this.assessmentStatus = assessmentStatus;
		this.questionOrder = questionOrder;
		this.instructionText = instructionText;
		this.instructionTimeSeconds = instructionTimeSeconds;
		this.hasInstructionTime = hasInstructionTime;
		this.assessmentTotalMarks = assessmentTotalMarks;
		this.assessmentPassingScore = assessmentPassingScore;
		this.passingScoreUnit = passingScoreUnit;
		this.startDate = startDate;
		this.endDate = endDate;
		this.assessmentDurationMinutes = assessmentDurationMinutes;
		this.creator = creator;
	}



	public Assessment() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
    
}