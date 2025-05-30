// Create this file in: src/main/java/com/assessment/dto/QuestionCreateDTO.java
package com.assessment.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionCreateDTO {
    private String questionText;
    private Integer questionTypeId;
    private Integer questionMarks;
    private Boolean requiresManualGrading;
    private Integer maxWordCount;
    private Integer assessmentId;
    private List<QuestionOptionDTO> options;
    private Boolean saveAndAddNext;
    
    @Data
    public static class QuestionOptionDTO {
        private Integer optionId;
        private String optionText;
        private Boolean isCorrect;
        private List<AnswerDTO> answers;
    }
    
    @Data
    public static class AnswerDTO {
        private Integer answerId;
        private String correctAnswerText;
        private Integer points;
    }
}