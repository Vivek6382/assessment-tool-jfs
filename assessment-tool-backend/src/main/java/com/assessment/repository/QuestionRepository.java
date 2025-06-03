package com.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.assessment.model.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByAssessmentAssessmentId(Integer assessmentId);
    
    @Query("SELECT SUM(q.questionMarks) FROM Question q WHERE q.assessment.assessmentId = :assessmentId")
    Integer sumQuestionMarksByAssessmentId(@Param("assessmentId") Integer assessmentId);
    
    Long countByAssessmentAssessmentIdAndRequiresManualGrading(Integer assessmentId, Boolean requiresManualGrading);
    
 // Add to QuestionRepository.java
    @Query("SELECT COUNT(q) FROM Question q WHERE q.assessment.assessmentId = :assessmentId")
    int countByAssessmentId(@Param("assessmentId") Integer assessmentId);
    
    @Query("SELECT COALESCE(SUM(q.questionMarks), 0) FROM Question q WHERE q.assessment.assessmentId = :assessmentId")
    Integer calculateTotalMarksByAssessmentId(@Param("assessmentId") Integer assessmentId);
    
}