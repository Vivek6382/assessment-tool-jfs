package com.assessment.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.assessment.model.QuestionType;
import com.assessment.repository.QuestionTypeRepository;

@Component
public class QuestionTypeInitializer implements CommandLineRunner {

    @Autowired
    private QuestionTypeRepository questionTypeRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize question types if not already present
        if (questionTypeRepository.count() == 0) {
            List<QuestionType> types = new ArrayList<>();
            
            // Don't hardcode IDs - let the database generate them
            types.add(new QuestionType(null, "Single Choice", null));
            types.add(new QuestionType(null, "Multiple Choice", null));
            types.add(new QuestionType(null, "True/False", null));
            types.add(new QuestionType(null, "Short Answer", null));
            types.add(new QuestionType(null, "Essay", null));
            
            questionTypeRepository.saveAll(types);
            
            System.out.println("Question types initialized.");
        }
    }
}