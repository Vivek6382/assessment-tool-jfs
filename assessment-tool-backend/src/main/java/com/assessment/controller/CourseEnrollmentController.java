package com.assessment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assessment.dto.UserDTO;
import com.assessment.service.CourseEnrollmentService;

@RestController
@RequestMapping("/api/enrollments")
public class CourseEnrollmentController {
    
    @Autowired
    private CourseEnrollmentService enrollmentService;
    
    @GetMapping("/course/{courseId}/students")
    public ResponseEntity<List<UserDTO>> getEnrolledStudents(@PathVariable Integer courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrolledStudents(courseId));
    }
    
    @GetMapping("/course/{courseId}/available-students")
    public ResponseEntity<List<UserDTO>> getAvailableStudents(@PathVariable Integer courseId) {
        return ResponseEntity.ok(enrollmentService.getAvailableStudents(courseId));
    }
    
    @GetMapping("/student/{studentId}/courses")
    public ResponseEntity<List<Map<String, Object>>> getCoursesForStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(enrollmentService.getCoursesByStudentId(studentId));
    }

    
    @PostMapping("/course/{courseId}/enroll")
    public ResponseEntity<Void> enrollStudents(
            @PathVariable Integer courseId,
            @RequestBody List<Integer> studentIds) {
        enrollmentService.enrollStudents(courseId, studentIds);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/course/{courseId}/unenroll")
    public ResponseEntity<Void> unenrollStudents(
            @PathVariable Integer courseId,
            @RequestBody List<Integer> studentIds) {
        enrollmentService.unenrollStudents(courseId, studentIds);
        return ResponseEntity.ok().build();
    }
}