package com.assessment.dto;

import java.util.List;

public class QuestionWithOptionsDTO {
    private Integer questionId;
    private String questionText;
    private String questionType;
    private Integer questionMarks;
    private List<QuestionOptionDTO> options;
    
    // Getters and setters
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
    
    public List<QuestionOptionDTO> getOptions() {
        return options;
    }
    
    public void setOptions(List<QuestionOptionDTO> options) {
        this.options = options;
    }
}