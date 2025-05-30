package com.assessment.dto;

import java.time.LocalDateTime;

public class CourseDTO {
    private Integer courseId;
    private String courseName;
    private String courseDescription;
    private LocalDateTime courseStartDate;
    private LocalDateTime courseEndDate;
	
	
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
	
}
