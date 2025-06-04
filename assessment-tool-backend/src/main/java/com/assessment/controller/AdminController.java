package com.assessment.controller;

import com.assessment.dto.AdminDTO;
import com.assessment.dto.AdminProfileUpdateDTO;
import com.assessment.dto.AssessmentPerformanceDTO;
import com.assessment.dto.AssessmentReportDTO;
import com.assessment.dto.QuestionAccuracyDTO;
import com.assessment.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(adminService.getAdminById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<AdminDTO> getAdminByUsername(@PathVariable String username) {
        try {
            return ResponseEntity.ok(adminService.getAdminByUsername(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateAdminProfile(@RequestBody AdminProfileUpdateDTO updateDTO) {
        try {
            AdminDTO updatedAdmin = adminService.updateAdminProfile(updateDTO);
            return ResponseEntity.ok(updatedAdmin);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
// Dashboard methods
    
    @GetMapping("/course-performance")
    public ResponseEntity<List<AssessmentPerformanceDTO>> getCoursePerformance(@RequestParam Long courseId) {
        return ResponseEntity.ok(adminService.getAveragePerformanceByCourse(courseId));
    }
    
    @GetMapping("/question-analysis")
    public ResponseEntity<List<QuestionAccuracyDTO>> getQuestionAccuracy(
            @RequestParam Long courseId,
            @RequestParam Integer assessmentId) {
        return ResponseEntity.ok(adminService.getQuestionAnalysis(courseId, assessmentId));
    }
    
    @GetMapping("/student-progress")
    public ResponseEntity<List<AssessmentPerformanceDTO>> getStudentProgress(
            @RequestParam Long courseId,
            @RequestParam Integer studentId) {
        return ResponseEntity.ok(adminService.getStudentProgress(courseId, studentId));
    }
    
    @GetMapping("/assessment-report")
    public ResponseEntity<List<AssessmentReportDTO>> getAssessmentReports() {
        return ResponseEntity.ok(adminService.getAssessmentReports());
    }
    
}