package com.assessment.dto;

public class AssessmentPerformanceDTO {
	private String assessmentTitle;
    private double percentage;
	public AssessmentPerformanceDTO(String assessmentTitle, double percentage) {
		super();
		this.assessmentTitle = assessmentTitle;
		this.percentage = percentage;
	}
	public String getAssessmentTitle() {
		return assessmentTitle;
	}
	public void setAssessmentTitle(String assessmentTitle) {
		this.assessmentTitle = assessmentTitle;
	}
	public double getPercentage() {
		return percentage;
	}
	public void setPercentage(double percentage) {
		this.percentage = percentage;
	}
	
}
