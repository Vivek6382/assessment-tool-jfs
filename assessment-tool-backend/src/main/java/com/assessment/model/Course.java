package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Integer courseId;
    
    @Column(name = "course_name")
    private String courseName;
    
    @Column(name = "course_credits")
    private Integer courseCredits;
    
    @Column(name = "course_description", columnDefinition = "TEXT")
    private String courseDescription;
    
    @ManyToOne
    @JoinColumn(name = "course_instructor_id")
    private User instructor;
    
    @Column(name = "course_start_date")
    private LocalDateTime courseStartDate;
    
    @Column(name = "course_end_date")
    private LocalDateTime courseEndDate;
    
    @Column(name = "course_status")
    private String courseStatus;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    
    @OneToMany(mappedBy = "course")
    private List<Module> modules;
    
    @OneToMany(mappedBy = "course")
    private List<CourseEnrollment> enrollments;
    

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

	public User getInstructor() {
		return instructor;
	}

	public void setInstructor(User instructor) {
		this.instructor = instructor;
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

	public List<Module> getModules() {
		return modules;
	}

	public void setModules(List<Module> modules) {
		this.modules = modules;
	}

	public List<CourseEnrollment> getEnrollments() {
		return enrollments;
	}

	public void setEnrollments(List<CourseEnrollment> enrollments) {
		this.enrollments = enrollments;
	}

	public String getCourseDescription() {
		return courseDescription;
	}

	public void setCourseDescription(String courseDescription) {
		this.courseDescription = courseDescription;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Course(Integer courseId, String courseName, Integer courseCredits, String courseDescription, User instructor,
			LocalDateTime courseStartDate, LocalDateTime courseEndDate, String courseStatus, LocalDateTime createdAt,
			LocalDateTime updatedAt, List<Module> modules, List<CourseEnrollment> enrollments) {
		super();
		this.courseId = courseId;
		this.courseName = courseName;
		this.courseCredits = courseCredits;
		this.courseDescription = courseDescription;
		this.instructor = instructor;
		this.courseStartDate = courseStartDate;
		this.courseEndDate = courseEndDate;
		this.courseStatus = courseStatus;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.modules = modules;
		this.enrollments = enrollments;
	}

	public Course() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
}