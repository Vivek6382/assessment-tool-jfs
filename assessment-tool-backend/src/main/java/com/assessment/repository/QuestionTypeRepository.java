package com.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assessment.model.QuestionType;

@Repository
public interface QuestionTypeRepository extends JpaRepository<QuestionType, Integer> {
    QuestionType findByQuestionTypeName(String name);
}