package com.assessment.controller;

import com.assessment.dto.QuestionResponseDTO;
import com.assessment.service.QuestionResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-responses")
@CrossOrigin(origins = "*")
public class QuestionResponseController {

    @Autowired
    private QuestionResponseService questionResponseService;
    
    @GetMapping("/student/{studentId}/assessment/{assessmentId}")
    public ResponseEntity<List<QuestionResponseDTO>> getQuestionsWithResponsesByStudentAndAssessment(
            @PathVariable Integer studentId, 
            @PathVariable Integer assessmentId) {
        
        try {
            List<QuestionResponseDTO> questionResponses = 
                questionResponseService.getQuestionsWithResponsesByStudentAndAssessment(studentId, assessmentId);
            
            return ResponseEntity.ok(questionResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}