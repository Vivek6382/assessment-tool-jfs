package com.assessment.dto;

public class AssessmentReportDTO {
    private String assessmentTitle;
    private double averageScore;
    private double highScore;
    private double lowScore;
    //private double completionRate;
    // Constructor, Getters, Setters
	public String getAssessmentTitle() {
		return assessmentTitle;
	}
	public AssessmentReportDTO(String assessmentTitle, double averageScore, double highScore, double lowScore) {
		super();
		this.assessmentTitle = assessmentTitle;
		this.averageScore = averageScore;
		this.highScore = highScore;
		this.lowScore = lowScore;
		//this.completionRate = completionRate;
	}
	public void setAssessmentTitle(String assessmentTitle) {
		this.assessmentTitle = assessmentTitle;
	}
	public double getAverageScore() {
		return averageScore;
	}
	public void setAverageScore(double averageScore) {
		this.averageScore = averageScore;
	}
	public double getHighScore() {
		return highScore;
	}
	public void setHighScore(double highScore) {
		this.highScore = highScore;
	}
	public double getLowScore() {
		return lowScore;
	}
	public void setLowScore(double lowScore) {
		this.lowScore = lowScore;
	}
//	public double getCompletionRate() {
//		return completionRate;
//	}
//	public void setCompletionRate(double completionRate) {
//		this.completionRate = completionRate;
//	}
}