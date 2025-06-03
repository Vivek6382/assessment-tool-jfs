package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOption {
    private Integer optionId;
    private String optionText;
    private Boolean isCorrect;
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
	public QuestionOption(Integer optionId, String optionText, Boolean isCorrect) {
		super();
		this.optionId = optionId;
		this.optionText = optionText;
		this.isCorrect = isCorrect;
	}
	public QuestionOption() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
} 