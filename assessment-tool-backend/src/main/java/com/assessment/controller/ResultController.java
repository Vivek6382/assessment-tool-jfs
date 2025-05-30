package com.assessment.controller;

import com.assessment.dto.ResultDTO;
import com.assessment.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping("/student/{studentId}/assessment/{assessmentId}")
    public ResponseEntity<ResultDTO> getResultByStudentAndAssessment(
            @PathVariable Integer studentId,
            @PathVariable Integer assessmentId) {
        
        try {
            Optional<ResultDTO> result = resultService.getResultByStudentAndAssessment(studentId, assessmentId);
            
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ResultDTO>> getResultsByStudent(@PathVariable Integer studentId) {
        try {
            List<ResultDTO> results = resultService.getResultsByStudent(studentId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<List<ResultDTO>> getResultsByAssessment(@PathVariable Integer assessmentId) {
        try {
            List<ResultDTO> results = resultService.getResultsByAssessment(assessmentId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/student/{studentId}/module/{moduleId}")
    public ResponseEntity<List<ResultDTO>> getStudentResultsByModule(
            @PathVariable Integer studentId,
            @PathVariable Integer moduleId) {
        try {
            List<ResultDTO> results = resultService.getStudentResultsByModule(studentId, moduleId);
            if (results.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}