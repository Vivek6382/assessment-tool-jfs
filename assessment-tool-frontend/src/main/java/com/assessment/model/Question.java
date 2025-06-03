package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    private Integer questionId;
    private String questionText;
    private String questionType;
    private Integer questionMarks;
    private List<QuestionOption> options;
    private String studentResponse;
    private List<String> selectedOptions;
    private Boolean isCorrect;
    private Integer marksObtained;
    private Boolean requiresManualGrading;
    private Integer maxWordCount;
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
	public String getStudentResponse() {
		return studentResponse;
	}
	public void setStudentResponse(String studentResponse) {
		this.studentResponse = studentResponse;
	}
	public List<String> getSelectedOptions() {
		return selectedOptions;
	}
	public void setSelectedOptions(List<String> selectedOptions) {
		this.selectedOptions = selectedOptions;
	}
	public Boolean getIsCorrect() {
		return isCorrect;
	}
	public void setIsCorrect(Boolean isCorrect) {
		this.isCorrect = isCorrect;
	}
	public Integer getMarksObtained() {
		return marksObtained;
	}
	public void setMarksObtained(Integer marksObtained) {
		this.marksObtained = marksObtained;
	}
	public Boolean getRequiresManualGrading() {
		return requiresManualGrading;
	}
	public void setRequiresManualGrading(Boolean requiresManualGrading) {
		this.requiresManualGrading = requiresManualGrading;
	}
	public Integer getMaxWordCount() {
		return maxWordCount;
	}
	public void setMaxWordCount(Integer maxWordCount) {
		this.maxWordCount = maxWordCount;
	}
	public Question(Integer questionId, String questionText, String questionType, Integer questionMarks,
			List<QuestionOption> options, String studentResponse, List<String> selectedOptions, Boolean isCorrect,
			Integer marksObtained, Boolean requiresManualGrading, Integer maxWordCount) {
		super();
		this.questionId = questionId;
		this.questionText = questionText;
		this.questionType = questionType;
		this.questionMarks = questionMarks;
		this.options = options;
		this.studentResponse = studentResponse;
		this.selectedOptions = selectedOptions;
		this.isCorrect = isCorrect;
		this.marksObtained = marksObtained;
		this.requiresManualGrading = requiresManualGrading;
		this.maxWordCount = maxWordCount;
	}
	public Question() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
} 