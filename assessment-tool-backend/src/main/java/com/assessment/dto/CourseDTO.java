package com.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class CourseDTO {
    private Integer courseId;
    private String courseName;
    private String courseDescription;
    private Integer courseCredits;
    private Integer instructorId;
    private String instructorName;
    private LocalDateTime courseStartDate;
    private LocalDateTime courseEndDate;
    private LocalDateTime updatedAt;
    private String courseStatus;
    private List<ModuleDTO> modules;
    private Integer assessmentCount;

    
	public CourseDTO(Integer courseId, String courseName, String courseDescription, Integer courseCredits,Integer instructorId, String instructorName,
			LocalDateTime courseStartDate, LocalDateTime courseEndDate, String courseStatus, LocalDateTime updatedAt,List<ModuleDTO> modules, Integer assessmentCount) {
		super();
		this.courseId = courseId;
		this.courseName = courseName;
		this.courseDescription = courseDescription;
		this.courseCredits = courseCredits;
		this.instructorId = instructorId;
		this.instructorName = instructorName;
		this.courseStartDate = courseStartDate;
		this.courseEndDate = courseEndDate;
		this.courseStatus = courseStatus;
		this.updatedAt = updatedAt;
		this.modules = modules;
		this.assessmentCount = assessmentCount;
	}
	public CourseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Integer getCourseId() {
		return courseId;
	}
	public void setCourseId(Integer courseId) {
		this.courseId = courseId;
	}
	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public String getCourseDescription() {
		return courseDescription;
	}
	public void setCourseDescription(String courseDescription) {
		this.courseDescription = courseDescription;
	}
	public Integer getCourseCredits() {
		return courseCredits;
	}
	public void setCourseCredits(Integer courseCredits) {
		this.courseCredits = courseCredits;
	}
	public String getInstructorName() {
		return instructorName;
	}
	public void setInstructorName(String instructorName) {
		this.instructorName = instructorName;
	}
	public LocalDateTime getCourseStartDate() {
		return courseStartDate;
	}
	public void setCourseStartDate(LocalDateTime courseStartDate) {
		this.courseStartDate = courseStartDate;
	}
	public LocalDateTime getCourseEndDate() {
		return courseEndDate;
	}
	public void setCourseEndDate(LocalDateTime courseEndDate) {
		this.courseEndDate = courseEndDate;
	}
	public String getCourseStatus() {
		return courseStatus;
	}
	public void setCourseStatus(String courseStatus) {
		this.courseStatus = courseStatus;
	}
	public Integer getInstructorId() {
		return instructorId;
	}
	public void setInstructorId(Integer instructorId) {
		this.instructorId = instructorId;
	}

	public List<ModuleDTO> getModules() {
		return modules;
	}
	public void setModules(List<ModuleDTO> modules) {
		this.modules = modules;
	}
	public Integer getAssessmentCount() {
		return assessmentCount;
	}
	public void setAssessmentCount(Integer assessmentCount) {
		this.assessmentCount = assessmentCount;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	
}
