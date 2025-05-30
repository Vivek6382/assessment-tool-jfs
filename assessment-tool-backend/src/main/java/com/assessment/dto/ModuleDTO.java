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
	}

	public ModuleDTO(Integer moduleId2, String moduleName2, String moduleStatus2, LocalDateTime startDate2,
			LocalDateTime endDate2) {
		// TODO Auto-generated constructor stub
	}
}