package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {
	private Integer optionId;
    private Integer studentId;
    private Integer questionId;
    private String responseText;
    private Boolean isResponseCorrect;
    private Integer marksObtained;
    private LocalDateTime responseTimestamp;
	public Integer getOptionId() {
		return optionId;
	}
	public void setOptionId(Integer optionId) {
		this.optionId = optionId;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public Integer getQuestionId() {
		return questionId;
	}
	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}
	public String getResponseText() {
		return responseText;
	}
	public void setResponseText(String responseText) {
		this.responseText = responseText;
	}
	public Boolean getIsResponseCorrect() {
		return isResponseCorrect;
	}
	public void setIsResponseCorrect(Boolean isResponseCorrect) {
		this.isResponseCorrect = isResponseCorrect;
	}
	public Integer getMarksObtained() {
		return marksObtained;
	}
	public void setMarksObtained(Integer marksObtained) {
		this.marksObtained = marksObtained;
	}
	public LocalDateTime getResponseTimestamp() {
		return responseTimestamp;
	}
	public void setResponseTimestamp(LocalDateTime responseTimestamp) {
		this.responseTimestamp = responseTimestamp;
	}
	public Response(Integer optionId, Integer studentId, Integer questionId, String responseText,
			Boolean isResponseCorrect, Integer marksObtained, LocalDateTime responseTimestamp) {
		super();
		this.optionId = optionId;
		this.studentId = studentId;
		this.questionId = questionId;
		this.responseText = responseText;
		this.isResponseCorrect = isResponseCorrect;
		this.marksObtained = marksObtained;
		this.responseTimestamp = responseTimestamp;
	}
	public Response() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
} 