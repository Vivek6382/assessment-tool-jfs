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
    
    
} 