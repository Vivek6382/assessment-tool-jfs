package com.assessment.dto;

import java.util.List;

public class QuestionResponseDTO {
    private Integer questionId;
    private String questionText;
    private String questionType;
    private Integer questionMarks;
    private List<QuestionOptionDTO> options; // Changed from QuestionCreateDTO.QuestionOptionDTO
    private String studentResponse;
    private List<String> selectedOptions;
    private Boolean isCorrect;
    private Integer marksObtained;
    
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
}