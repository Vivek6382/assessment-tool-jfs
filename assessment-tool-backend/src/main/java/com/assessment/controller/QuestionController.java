package com.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assessment.dto.QuestionCreateDTO;
import com.assessment.dto.QuestionWithOptionsDTO;
import com.assessment.model.Question;
import com.assessment.model.QuestionType;
import com.assessment.service.QuestionService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllQuestions() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Question> questions = questionService.getAllQuestions();
            
            // Convert to DTO format that includes assessmentId
            List<Map<String, Object>> questionDTOs = questions.stream().map(q -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("questionId", q.getQuestionId());
                dto.put("questionText", q.getQuestionText());
                dto.put("questionType", q.getQuestionType());
                dto.put("questionMarks", q.getQuestionMarks());
                dto.put("assessmentId", q.getAssessment() != null ? q.getAssessment().getAssessmentId() : null);
                // Add other fields as needed
                return dto;
            }).collect(Collectors.toList());
            
            response.put("success", true);
            response.put("questions", questionDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving questions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Question question = questionService.getQuestionById(id);
            if (question != null) {
                response.put("success", true);
                response.put("question", question);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Question not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createQuestion(@RequestBody QuestionCreateDTO questionData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Question question = questionService.createQuestion(questionData);
            response.put("success", true);
            response.put("question", question);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace(); // Add this to see the full stack trace
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateQuestion(@PathVariable Integer id, @RequestBody QuestionCreateDTO questionData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Question question = questionService.updateQuestion(id, questionData);
            if (question != null) {
                response.put("success", true);
                response.put("question", question);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Question not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace(); // Add this to see the full stack trace
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteQuestion(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deleted = questionService.deleteQuestion(id);
            if (deleted) {
                response.put("success", true);
                response.put("message", "Question deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Question not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
 // Add to QuestionController.java if not already there
    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getQuestionTypes() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<QuestionType> types = questionService.getAllQuestionTypes();
            response.put("success", true);
            response.put("questionTypes", types);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    @GetMapping("/by-assessment/{assessmentId}")
    public ResponseEntity<Map<String, Object>> getQuestionsByAssessmentId(@PathVariable Integer assessmentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Question> questions = questionService.getQuestionsByAssessmentId(assessmentId);
            
            if (questions.isEmpty()) {
                response.put("success", true);
                response.put("questions", new ArrayList<>());
                response.put("message", "No questions found for this assessment");
            } else {
                response.put("success", true);
                response.put("questions", questions);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving questions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    
    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<List<QuestionWithOptionsDTO>> getQuestionsWithOptionsByAssessmentId(@PathVariable Integer assessmentId) {
        try {
            List<QuestionWithOptionsDTO> questions = questionService.getQuestionsWithOptionsByAssessmentId(assessmentId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    
}