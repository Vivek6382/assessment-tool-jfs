package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "user_email")
    private String userEmail;
    
    @Column(name = "user_password_hash")
    private String userPasswordHash;
    
    @Column(name = "user_first_name")
    private String userFirstName;
    
    @Column(name = "user_last_name")
    private String userLastName;
    
    @Column(name = "user_mobile_number")
    private String userMobileNumber;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    
    @Column(name = "user_created_at")
    private LocalDateTime userCreatedAt;
    
    @Column(name = "user_last_login")
    private LocalDateTime userLastLogin;
    
    @Column(name = "user_status")
    private String userStatus;
    
    @Column(name = "user_dob")
    private LocalDate userDob;
    
    @Column(name = "user_gender")
    private String userGender;
    
    @Column(name = "user_department")
    private String userDepartment;
    
    @Column(name = "user_highest_qualification")
    private String userHighestQualification;
    
    @Column(name = "user_specialization")
    private String userSpecialization;
    
    @Column(name = "user_professional_summary", columnDefinition = "TEXT")
    private String userProfessionalSummary;
    
    @OneToMany(mappedBy = "instructor")
    private List<Course> taughtCourses;
    
    @OneToMany(mappedBy = "creator")
    private List<Assessment> createdAssessments;
    
    @OneToMany(mappedBy = "student")
    @JsonManagedReference(value = "student-response") // shreeni vasu
    private List<Response> responses;
    
    @OneToMany(mappedBy = "student")
    private List<Result> results;
    
    @OneToMany(mappedBy = "feedbackGenerator")
    private List<Feedback> generatedFeedback;
    
    @OneToMany(mappedBy = "student")
    private List<CourseEnrollment> enrollments;

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserPasswordHash() {
		return userPasswordHash;
	}

	public void setUserPasswordHash(String userPasswordHash) {
		this.userPasswordHash = userPasswordHash;
	}

	public String getUserFirstName() {
		return userFirstName;
	}

	public void setUserFirstName(String userFirstName) {
		this.userFirstName = userFirstName;
	}

	public String getUserLastName() {
		return userLastName;
	}

	public void setUserLastName(String userLastName) {
		this.userLastName = userLastName;
	}

	public String getUserMobileNumber() {
		return userMobileNumber;
	}

	public void setUserMobileNumber(String userMobileNumber) {
		this.userMobileNumber = userMobileNumber;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public LocalDateTime getUserCreatedAt() {
		return userCreatedAt;
	}

	public void setUserCreatedAt(LocalDateTime userCreatedAt) {
		this.userCreatedAt = userCreatedAt;
	}

	public LocalDateTime getUserLastLogin() {
		return userLastLogin;
	}

	public void setUserLastLogin(LocalDateTime userLastLogin) {
		this.userLastLogin = userLastLogin;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	public List<Course> getTaughtCourses() {
		return taughtCourses;
	}

	public void setTaughtCourses(List<Course> taughtCourses) {
		this.taughtCourses = taughtCourses;
	}

	public List<Assessment> getCreatedAssessments() {
		return createdAssessments;
	}

	public void setCreatedAssessments(List<Assessment> createdAssessments) {
		this.createdAssessments = createdAssessments;
	}

	public List<Response> getResponses() {
		return responses;
	}

	public void setResponses(List<Response> responses) {
		this.responses = responses;
	}

	public List<Result> getResults() {
		return results;
	}

	public void setResults(List<Result> results) {
		this.results = results;
	}

	public List<Feedback> getGeneratedFeedback() {
		return generatedFeedback;
	}

	public void setGeneratedFeedback(List<Feedback> generatedFeedback) {
		this.generatedFeedback = generatedFeedback;
	}

	public List<CourseEnrollment> getEnrollments() {
		return enrollments;
	}

	public void setEnrollments(List<CourseEnrollment> enrollments) {
		this.enrollments = enrollments;
	}

	public LocalDate getUserDob() {
		return userDob;
	}

	public void setUserDob(LocalDate userDob) {
		this.userDob = userDob;
	}

	public String getUserGender() {
		return userGender;
	}

	public void setUserGender(String userGender) {
		this.userGender = userGender;
	}

	public String getUserDepartment() {
		return userDepartment;
	}

	public void setUserDepartment(String userDepartment) {
		this.userDepartment = userDepartment;
	}

	public String getUserHighestQualification() {
		return userHighestQualification;
	}

	public void setUserHighestQualification(String userHighestQualification) {
		this.userHighestQualification = userHighestQualification;
	}

	public String getUserSpecialization() {
		return userSpecialization;
	}

	public void setUserSpecialization(String userSpecialization) {
		this.userSpecialization = userSpecialization;
	}

	public String getUserProfessionalSummary() {
		return userProfessionalSummary;
	}

	public void setUserProfessionalSummary(String userProfessionalSummary) {
		this.userProfessionalSummary = userProfessionalSummary;
	}

	public User(Integer userId, String username, String userEmail, String userPasswordHash, String userFirstName,
			String userLastName, String userMobileNumber, Role role, LocalDateTime userCreatedAt,
			LocalDateTime userLastLogin, String userStatus, LocalDate userDob, String userGender, String userDepartment,
			String userHighestQualification, String userSpecialization, String userProfessionalSummary,
			List<Course> taughtCourses, List<Assessment> createdAssessments, List<Response> responses,
			List<Result> results, List<Feedback> generatedFeedback, List<CourseEnrollment> enrollments) {
		super();
		this.userId = userId;
		this.username = username;
		this.userEmail = userEmail;
		this.userPasswordHash = userPasswordHash;
		this.userFirstName = userFirstName;
		this.userLastName = userLastName;
		this.userMobileNumber = userMobileNumber;
		this.role = role;
		this.userCreatedAt = userCreatedAt;
		this.userLastLogin = userLastLogin;
		this.userStatus = userStatus;
		this.userDob = userDob;
		this.userGender = userGender;
		this.userDepartment = userDepartment;
		this.userHighestQualification = userHighestQualification;
		this.userSpecialization = userSpecialization;
		this.userProfessionalSummary = userProfessionalSummary;
		this.taughtCourses = taughtCourses;
		this.createdAssessments = createdAssessments;
		this.responses = responses;
		this.results = results;
		this.generatedFeedback = generatedFeedback;
		this.enrollments = enrollments;
	}

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}