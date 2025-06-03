package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionWithOptions {
    private Integer questionId;
    private String questionText;
    private String questionType;
    private Integer questionMarks;
    private List<QuestionOption> options;
	public Integer getQuestionId() {
		return questionId;
	}
	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}
	public String getQuestionText() {
		return questionText;
	}
	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}
	public String getQuestionType() {
		return questionType;
	}
	public void setQuestionType(String questionType) {
		this.questionType = questionType;
	}
	public Integer getQuestionMarks() {
		return questionMarks;
	}
	public void setQuestionMarks(Integer questionMarks) {
		this.questionMarks = questionMarks;
	}
	public List<QuestionOption> getOptions() {
		return options;
	}
	public void setOptions(List<QuestionOption> options) {
		this.options = options;
	}
	public QuestionWithOptions(Integer questionId, String questionText, String questionType, Integer questionMarks,
			List<QuestionOption> options) {
		super();
		this.questionId = questionId;
		this.questionText = questionText;
		this.questionType = questionType;
		this.questionMarks = questionMarks;
		this.options = options;
	}
	public QuestionWithOptions() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}