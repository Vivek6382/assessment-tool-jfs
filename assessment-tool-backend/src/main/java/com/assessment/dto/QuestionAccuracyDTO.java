package com.assessment.dto;

public class QuestionAccuracyDTO {
	 private String questionText;
	 private double accuracy;
	 public String getQuestionText() {
		return questionText;
	}
	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}
	public double getAccuracy() {
		return accuracy;
	}
	public void setAccuracy(double accuracy) {
		this.accuracy = accuracy;
	}
	public QuestionAccuracyDTO(String questionText, double accuracy) {
		super();
		this.questionText = questionText;
		this.accuracy = accuracy;
	}
	
}
