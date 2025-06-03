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
	public Result(Integer resultId, Integer assessmentId, String assessmentTitle, Integer studentId, String studentName,
			Integer totalMarks, Integer obtainedMarks, Float resultPercentage, String resultStatus,
			LocalDateTime completedDate) {
		super();
		this.resultId = resultId;
		this.assessmentId = assessmentId;
		this.assessmentTitle = assessmentTitle;
		this.studentId = studentId;
		this.studentName = studentName;
		this.totalMarks = totalMarks;
		this.obtainedMarks = obtainedMarks;
		this.resultPercentage = resultPercentage;
		this.resultStatus = resultStatus;
		this.completedDate = completedDate;
	}
	public Result() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
} 