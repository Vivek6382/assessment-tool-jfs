package com.assessment.repository;

import com.assessment.model.Response;
import com.assessment.model.User;
import com.assessment.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Integer> {
    
    // Find responses by student ID
    List<Response> findByStudentUserId(Integer studentId);
    
    List<Response> findByStudentAndOptionQuestionAssessment(User student, Assessment assessment);
    
    // Find responses by student ID and assessment ID
    @Query("SELECT r FROM Response r JOIN r.option o JOIN o.question q WHERE r.student.userId = :studentId AND q.assessment.assessmentId = :assessmentId")
    List<Response> findByStudentIdAndAssessmentId(@Param("studentId") Integer studentId, @Param("assessmentId") Integer assessmentId);

	List<Response> findByStudentUserIdAndQuestionAssessmentAssessmentId(Integer studentId, Integer assessmentId);
	
	List<Response> findByQuestion_QuestionId(Integer questionId);
}