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
}