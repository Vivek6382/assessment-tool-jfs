package com.assessment.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "modules")
public class Module {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private Integer moduleId;
    
    @Column(name = "module_name")
    private String moduleName;
    
    
    // Syed Anees 
    

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    
    @Column(name = "module_sequence_order")
    private Integer moduleSequenceOrder;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "module_status")
    private String moduleStatus;
    
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

    
    @OneToMany(mappedBy = "module", fetch = FetchType.EAGER)  // Add fetch type EAGER
    @JsonIgnore
    private List<Assessment> assessments;

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

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public Integer getModuleSequenceOrder() {
		return moduleSequenceOrder;
	}

	public void setModuleSequenceOrder(Integer moduleSequenceOrder) {
		this.moduleSequenceOrder = moduleSequenceOrder;
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

	public String getModuleStatus() {
		return moduleStatus;
	}

	public void setModuleStatus(String moduleStatus) {
		this.moduleStatus = moduleStatus;
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

	public List<Assessment> getAssessments() {
		return assessments;
	}

	public void setAssessments(List<Assessment> assessments) {
		this.assessments = assessments;
	}

	public Module(Integer moduleId, String moduleName, Course course, Integer moduleSequenceOrder,
			LocalDateTime startDate, LocalDateTime endDate, String moduleStatus, LocalDateTime createdAt,
			LocalDateTime updatedAt, List<Assessment> assessments) {
		super();
		this.moduleId = moduleId;
		this.moduleName = moduleName;
		this.course = course;
		this.moduleSequenceOrder = moduleSequenceOrder;
		this.startDate = startDate;
		this.endDate = endDate;
		this.moduleStatus = moduleStatus;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.assessments = assessments;
	}

	public Module() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}