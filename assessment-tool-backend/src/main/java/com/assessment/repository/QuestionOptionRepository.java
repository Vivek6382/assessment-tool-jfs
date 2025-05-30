package com.assessment.repository;

import com.assessment.model.QuestionOption;
import com.assessment.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Integer> {
    
    // Find all options for a specific question
    List<QuestionOption> findByQuestion(Question question);
    
    // Find all options for a specific question ID
    List<QuestionOption> findByQuestionQuestionId(Integer questionId);
    
    // Find correct options for a specific question
    List<QuestionOption> findByQuestionAndIsCorrect(Question question, Boolean isCorrect);
    
    // Find correct options for a specific question ID
    List<QuestionOption> findByQuestionQuestionIdAndIsCorrect(Integer questionId, Boolean isCorrect);
    
    // Count options for a specific question
    Long countByQuestionQuestionId(Integer questionId);
    
    // Count correct options for a specific question
    Long countByQuestionQuestionIdAndIsCorrect(Integer questionId, Boolean isCorrect);
    
    // Find options by IDs
    @Query("SELECT o FROM QuestionOption o WHERE o.optionId IN ?1")
    List<QuestionOption> findByOptionIds(List<Integer> optionIds);
}