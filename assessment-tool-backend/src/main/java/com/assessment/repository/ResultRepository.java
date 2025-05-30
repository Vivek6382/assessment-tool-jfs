package com.assessment.repository;

import com.assessment.model.Assessment;
import com.assessment.model.Result;
import com.assessment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    
    // Find result by student and assessment
    Optional<Result> findByStudentAndAssessment(User student, Assessment assessment);
    
    // Find all results for a specific student
    List<Result> findByStudent(User student);
    
    // Find all results for a specific assessment
    List<Result> findByAssessment(Assessment assessment);
    
    // Find all results for a specific assessment ordered by percentage (highest first)
    List<Result> findByAssessmentOrderByResultPercentageDesc(Assessment assessment);
    
    // Find all results with a specific status
    List<Result> findByResultStatus(String resultStatus);
    
    // Find all results for a specific module
    List<Result> findByAssessment_Module_ModuleId(Integer moduleId);
    
    List<Result> findByStudentUserIdAndAssessmentModuleModuleId(Integer studentId, Integer moduleId);

    
    // Count results by status for a specific assessment
    @Query("SELECT COUNT(r) FROM Result r WHERE r.assessment.assessmentId = ?1 AND r.resultStatus = ?2")
    Long countByAssessmentIdAndResultStatus(Integer assessmentId, String resultStatus);
    
    // Get average percentage for a specific assessment
    @Query("SELECT AVG(r.resultPercentage) FROM Result r WHERE r.assessment.assessmentId = ?1")
    Float getAveragePercentageByAssessmentId(Integer assessmentId);
    
    // Find top performers (highest percentage) for a specific assessment
    @Query("SELECT r FROM Result r WHERE r.assessment.assessmentId = ?1 ORDER BY r.resultPercentage DESC")
    List<Result> findTopPerformersByAssessmentId(Integer assessmentId);
}