package com.assessment.dto;

public class QuestionOptionDTO {
    private Integer optionId;
    private String optionText;
    private Boolean isCorrect;
    
    // Default constructor
    public QuestionOptionDTO() {
    }
    
    // Getters and Setters
    public Integer getOptionId() {
        return optionId;
    }
    
    public void setOptionId(Integer optionId) {
        this.optionId = optionId;
    }
    
    public String getOptionText() {
        return optionText;
    }
    
    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}