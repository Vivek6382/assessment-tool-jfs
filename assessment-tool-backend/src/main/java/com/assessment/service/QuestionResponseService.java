package com.assessment.service;

import com.assessment.dto.QuestionOptionDTO;
import com.assessment.dto.QuestionResponseDTO;
import com.assessment.model.Question;
import com.assessment.model.QuestionOption;
import com.assessment.model.Response;
import com.assessment.repository.QuestionRepository;
import com.assessment.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuestionResponseService {

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private ResponseRepository responseRepository;
    
    public List<QuestionResponseDTO> getQuestionsWithResponsesByStudentAndAssessment(Integer studentId, Integer assessmentId) {
        // Get all questions for the assessment
        List<Question> questions = questionRepository.findByAssessmentAssessmentId(assessmentId);
        
        // Get all responses for the student and assessment
        List<Response> responses = responseRepository.findByStudentIdAndAssessmentId(studentId, assessmentId);
        
        // Group responses by question ID
        Map<Integer, List<Response>> responsesByQuestionId = responses.stream()
                .filter(r -> r.getOption() != null && r.getOption().getQuestion() != null)
                .collect(Collectors.groupingBy(r -> r.getOption().getQuestion().getQuestionId()));
        
        // Create DTOs for each question with its response
        List<QuestionResponseDTO> result = new ArrayList<>();
        
        for (Question question : questions) {
            QuestionResponseDTO dto = new QuestionResponseDTO();
            dto.setQuestionId(question.getQuestionId());
            dto.setQuestionText(question.getQuestionText());
            dto.setQuestionType(question.getQuestionType().getQuestionTypeName());
            dto.setQuestionMarks(question.getQuestionMarks());
            
            // Set options
            List<QuestionOptionDTO> optionDTOs = new ArrayList<>();
            for (QuestionOption option : question.getOptions()) {
                QuestionOptionDTO optionDTO = new QuestionOptionDTO();
                optionDTO.setOptionId(option.getOptionId());
                optionDTO.setOptionText(option.getOptionText());
                optionDTO.setIsCorrect(option.getIsCorrect());
                optionDTOs.add(optionDTO);
            }
            dto.setOptions(optionDTOs);
            
            // Set response data if available
            List<Response> questionResponses = responsesByQuestionId.get(question.getQuestionId());
            if (questionResponses != null && !questionResponses.isEmpty()) {
                // For text responses (short answer, essay)
                if (questionResponses.get(0).getResponseText() != null) {
                    dto.setStudentResponse(questionResponses.get(0).getResponseText());
                }
                
                // For option-based responses (MCQ, true/false)
                List<String> selectedOptions = questionResponses.stream()
                        .filter(r -> r.getOption() != null)
                        .map(r -> r.getOption().getOptionText())
                        .collect(Collectors.toList());
                
                if (!selectedOptions.isEmpty()) {
                    dto.setSelectedOptions(selectedOptions);
                }
                
                // Set correctness and marks
                boolean isCorrect = questionResponses.stream()
                        .allMatch(r -> r.getIsResponseCorrect() != null && r.getIsResponseCorrect());
                
                dto.setIsCorrect(isCorrect);
                
                Integer marksObtained = questionResponses.stream()
                        .map(r -> r.getMarksObtained())
                        .filter(m -> m != null)
                        .reduce(0, Integer::sum);
                
                dto.setMarksObtained(marksObtained);
            }
            
            result.add(dto);
        }
        
        return result;
    }
}