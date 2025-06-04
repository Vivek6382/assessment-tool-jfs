package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    
    
} 