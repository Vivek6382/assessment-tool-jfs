package com.assessment.dto;

import java.time.LocalDate;
import java.util.List;

public class EducatorProfileDTO {
	private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String status;
    private String address;
    private LocalDate dob;
    private String gender;
    private String department;
    private String highestQualification;
    private String specialization;
    private String professionalSummary;
    private Integer totalStudents;
    private Integer totalAssessments;
    private Double completionRate;
    private Double performanceScore;
    private List<CourseDTO> courses;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public LocalDate getDob() {
		return dob;
	}
	public void setDob(LocalDate dob) {
		this.dob = dob;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getHighestQualification() {
		return highestQualification;
	}
	public void setHighestQualification(String highestQualification) {
		this.highestQualification = highestQualification;
	}
	public String getSpecialization() {
		return specialization;
	}
	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}
	public String getProfessionalSummary() {
		return professionalSummary;
	}
	public void setProfessionalSummary(String professionalSummary) {
		this.professionalSummary = professionalSummary;
	}
	public Integer getTotalStudents() {
		return totalStudents;
	}
	public void setTotalStudents(Integer totalStudents) {
		this.totalStudents = totalStudents;
	}
	public Integer getTotalAssessments() {
		return totalAssessments;
	}
	public void setTotalAssessments(Integer totalAssessments) {
		this.totalAssessments = totalAssessments;
	}
	public Double getCompletionRate() {
		return completionRate;
	}
	public void setCompletionRate(Double completionRate) {
		this.completionRate = completionRate;
	}
	public Double getPerformanceScore() {
		return performanceScore;
	}
	public void setPerformanceScore(Double performanceScore) {
		this.performanceScore = performanceScore;
	}
	public List<CourseDTO> getCourses() {
		return courses;
	}
	public void setCourses(List<CourseDTO> courses) {
		this.courses = courses;
	}
    
}

