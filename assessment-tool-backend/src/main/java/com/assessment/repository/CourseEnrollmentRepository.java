package com.assessment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.assessment.model.CourseEnrollment;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Integer> {
    
    // Find all enrollments for a specific course
    List<CourseEnrollment> findByCourse_CourseId(Integer courseId);
    
    // Find all enrollments for a specific student
    List<CourseEnrollment> findByStudent_UserId(Integer studentId);
    
    // Check if a specific enrollment exists
    boolean existsByCourse_CourseIdAndStudent_UserId(Integer courseId, Integer studentId);
    
    // Delete a specific enrollment
    void deleteByCourse_CourseIdAndStudent_UserId(Integer courseId, Integer studentId);
}