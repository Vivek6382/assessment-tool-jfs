package com.assessment.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDTO {
	
  
	private Integer moduleId;
    private String moduleName;
    
//    syed anees
    
    private Integer courseId;
    private Integer moduleSequenceOrder;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String moduleStatus;
    private List<AssessmentDTO> assessments;
    
    public ModuleDTO(Integer moduleId2, Integer integer, String moduleName2, Integer moduleSequenceOrder,
			LocalDateTime startDate, LocalDateTime endDate, String moduleStatus, List<AssessmentDTO> assessmentDTOs) {
    	
		// TODO Auto-generated constructor stub
    	this.moduleId = moduleId2;
        this.courseId = integer;
        this.moduleName = moduleName2;
        this.moduleSequenceOrder = moduleSequenceOrder;
        this.startDate = startDate;
        this.endDate = endDate;
        this.moduleStatus = moduleStatus;
        this.assessments = assessmentDTOs;
	}

	public ModuleDTO(Integer moduleId2, String moduleName2, String moduleStatus2, LocalDateTime startDate2,
			LocalDateTime endDate2) {
		// TODO Auto-generated constructor stub
		this.moduleId = moduleId2;
        this.moduleName = moduleName2;
        this.moduleStatus = moduleStatus2;
        this.startDate = startDate2;
        this.endDate = endDate2;
	}

	public ModuleDTO() {
		// TODO Auto-generated constructor stub
	}

	public ModuleDTO(Integer moduleId2, String moduleName2, String moduleStatus2, LocalDateTime startDate2,
			LocalDateTime endDate2, List<AssessmentDTO> collect) {
		// TODO Auto-generated constructor stub
		this.moduleId = moduleId2;
        this.moduleName = moduleName2;
        this.moduleStatus = moduleStatus2;
        this.startDate = startDate2;
        this.endDate = endDate2;
        this.assessments = collect;
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

	public Integer getCourseId() {
		return courseId;
	}

	public void setCourseId(Integer courseId) {
		this.courseId = courseId;
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

	public List<AssessmentDTO> getAssessments() {
		return assessments;
	}

	public void setAssessments(List<AssessmentDTO> assessments) {
		this.assessments = assessments;
	}
	
	
}