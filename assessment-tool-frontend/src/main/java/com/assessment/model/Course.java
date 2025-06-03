package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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
	public Integer getCourseCredits() {
		return courseCredits;
	}
	public void setCourseCredits(Integer courseCredits) {
		this.courseCredits = courseCredits;
	}
	public String getCourseDescription() {
		return courseDescription;
	}
	public void setCourseDescription(String courseDescription) {
		this.courseDescription = courseDescription;
	}
	public Integer getInstructorId() {
		return instructorId;
	}
	public void setInstructorId(Integer instructorId) {
		this.instructorId = instructorId;
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
	public Course(Integer courseId, String courseName, Integer courseCredits, String courseDescription,
			Integer instructorId, String instructorName, LocalDateTime courseStartDate, LocalDateTime courseEndDate,
			String courseStatus) {
		super();
		this.courseId = courseId;
		this.courseName = courseName;
		this.courseCredits = courseCredits;
		this.courseDescription = courseDescription;
		this.instructorId = instructorId;
		this.instructorName = instructorName;
		this.courseStartDate = courseStartDate;
		this.courseEndDate = courseEndDate;
		this.courseStatus = courseStatus;
	}
	public Course() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
    
    
} 