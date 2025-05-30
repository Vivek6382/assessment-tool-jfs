package com.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assessment.dto.QuestionCreateDTO;
import com.assessment.dto.QuestionOptionDTO;
import com.assessment.dto.QuestionWithOptionsDTO;
import com.assessment.model.Answer;
import com.assessment.model.Assessment;
import com.assessment.model.Question;
import com.assessment.model.QuestionOption;
import com.assessment.model.QuestionType;
import com.assessment.repository.AssessmentRepository;
import com.assessment.repository.QuestionRepository;
import com.assessment.repository.QuestionTypeRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuestionTypeRepository questionTypeRepository;
    
    @Autowired
    private AssessmentRepository assessmentRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Integer id) {
        return questionRepository.findById(id).orElse(null);
    }

    @Transactional
    public Question createQuestion(QuestionCreateDTO questionData) {
        Question question = new Question();
        
        // Set question text
        question.setQuestionText(questionData.getQuestionText());
        
        // Set assessment if provided
        if (questionData.getAssessmentId() != null) {
            Assessment assessment = assessmentRepository.findById(questionData.getAssessmentId()).orElse(null);
            question.setAssessment(assessment);
        }
        
        // Set question type
        if (questionData.getQuestionTypeId() != null) {
            QuestionType questionType = questionTypeRepository.findById(questionData.getQuestionTypeId()).orElse(null);
            question.setQuestionType(questionType);
        }
        
        // Set question marks
        question.setQuestionMarks(questionData.getQuestionMarks());
        
        // Set max word count (essay questions)
        question.setMaxWordCount(questionData.getMaxWordCount());
        
        // Set manual grading flag
        question.setRequiresManualGrading(questionData.getRequiresManualGrading());
        
        // Save question first to get ID
        question = questionRepository.save(question);
        
        // Handle options
        if (questionData.getOptions() != null && !questionData.getOptions().isEmpty()) {
            List<QuestionOption> options = new ArrayList<>();
            
            for (QuestionCreateDTO.QuestionOptionDTO optionData : questionData.getOptions()) {
                QuestionOption option = new QuestionOption();
                option.setQuestion(question);
                option.setOptionText(optionData.getOptionText());
                option.setIsCorrect(optionData.getIsCorrect());
                
                // Handle answers for short answer questions
                if (optionData.getAnswers() != null && !optionData.getAnswers().isEmpty()) {
                    List<Answer> answers = new ArrayList<>();
                    
                    for (QuestionCreateDTO.AnswerDTO answerData : optionData.getAnswers()) {
                        Answer answer = new Answer();
                        answer.setOption(option);
                        answer.setCorrectAnswerText(answerData.getCorrectAnswerText());
                        answer.setPoints(answerData.getPoints());
                        answers.add(answer);
                    }
                    
                    option.setAnswers(answers);
                }
                
                options.add(option);
            }
            
            question.setOptions(options);
        }
        
        // Save again with options
        return questionRepository.save(question);
    }
    

    @Transactional
    public Question updateQuestion(Integer id, QuestionCreateDTO questionData) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        
        if (!optionalQuestion.isPresent()) {
            return null;
        }
        
        Question question = optionalQuestion.get();
        
        // Update basic properties
        question.setQuestionText(questionData.getQuestionText());
        
        // Update assessment if provided
        if (questionData.getAssessmentId() != null) {
            Assessment assessment = assessmentRepository.findById(questionData.getAssessmentId()).orElse(null);
            question.setAssessment(assessment);
        } else {
            question.setAssessment(null);
        }
        
        // Update question type
        if (questionData.getQuestionTypeId() != null) {
            QuestionType questionType = questionTypeRepository.findById(questionData.getQuestionTypeId()).orElse(null);
            question.setQuestionType(questionType);
        }
        
        // Update other properties
        question.setQuestionMarks(questionData.getQuestionMarks());
        question.setMaxWordCount(questionData.getMaxWordCount());
        question.setRequiresManualGrading(questionData.getRequiresManualGrading());
        
        // Handle options - FIXED VERSION
        if (questionData.getOptions() != null) {
            // Create a map of existing options by ID for quick lookup
            Map<Integer, QuestionOption> existingOptionsMap = new HashMap<>();
            if (question.getOptions() != null) {
                for (QuestionOption option : question.getOptions()) {
                    if (option.getOptionId() != null) {
                        existingOptionsMap.put(option.getOptionId(), option);
                    }
                }
            } else {
                question.setOptions(new ArrayList<>());
            }
            
            // Keep track of processed options to identify ones to remove
            Set<Integer> processedOptionIds = new HashSet<>();
            
            // Process each option from the DTO
            for (QuestionCreateDTO.QuestionOptionDTO optionData : questionData.getOptions()) {
                QuestionOption option;
                
                // Check if we're updating an existing option
                if (optionData.getOptionId() != null && existingOptionsMap.containsKey(optionData.getOptionId())) {
                    // Update existing option
                    option = existingOptionsMap.get(optionData.getOptionId());
                    option.setOptionText(optionData.getOptionText());
                    option.setIsCorrect(optionData.getIsCorrect());
                    
                    // Mark as processed
                    processedOptionIds.add(optionData.getOptionId());
                } else {
                    // Create new option
                    option = new QuestionOption();
                    option.setQuestion(question);
                    option.setOptionText(optionData.getOptionText());
                    option.setIsCorrect(optionData.getIsCorrect());
                    option.setAnswers(new ArrayList<>());
                    
                    // Add to the question's collection
                    question.getOptions().add(option);
                }
                
                // Handle answers
                if (optionData.getAnswers() != null) {
                    // Similar approach for answers as we did for options
                    Map<Integer, Answer> existingAnswersMap = new HashMap<>();
                    if (option.getAnswers() != null) {
                        for (Answer answer : option.getAnswers()) {
                            if (answer.getAnswerId() != null) {
                                existingAnswersMap.put(answer.getAnswerId(), answer);
                            }
                        }
                    } else {
                        option.setAnswers(new ArrayList<>());
                    }
                    
                    Set<Integer> processedAnswerIds = new HashSet<>();
                    
                    for (QuestionCreateDTO.AnswerDTO answerData : optionData.getAnswers()) {
                        Answer answer;
                        
                        if (answerData.getAnswerId() != null && existingAnswersMap.containsKey(answerData.getAnswerId())) {
                            // Update existing answer
                            answer = existingAnswersMap.get(answerData.getAnswerId());
                            answer.setCorrectAnswerText(answerData.getCorrectAnswerText());
                            answer.setPoints(answerData.getPoints());
                            
                            processedAnswerIds.add(answerData.getAnswerId());
                        } else {
                            // Create new answer
                            answer = new Answer();
                            answer.setOption(option);
                            answer.setCorrectAnswerText(answerData.getCorrectAnswerText());
                            answer.setPoints(answerData.getPoints());
                            
                            option.getAnswers().add(answer);
                        }
                    }
                    
                    // Remove answers that weren't in the update - using Iterator to avoid ConcurrentModificationException
                    option.getAnswers().removeIf(answer -> 
                        answer.getAnswerId() != null && 
                        !processedAnswerIds.contains(answer.getAnswerId()));
                }
            }
            
            // Remove options that weren't in the update - using Iterator to avoid ConcurrentModificationException
            question.getOptions().removeIf(option -> 
                option.getOptionId() != null && 
                !processedOptionIds.contains(option.getOptionId()));
        }
        
        return questionRepository.save(question);
    }
    

    public boolean deleteQuestion(Integer id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<QuestionType> getAllQuestionTypes() {
        return questionTypeRepository.findAll();
    }
    
    
    
 // Add this method to your existing QuestionService

    public List<Question> getQuestionsByAssessmentId(Integer assessmentId) {
        return questionRepository.findByAssessmentAssessmentId(assessmentId);
    }
    
    public int getQuestionCountByAssessmentId(Integer assessmentId) {
        return questionRepository.countByAssessmentId(assessmentId);
    }

    public Integer calculateTotalMarksByAssessmentId(Integer assessmentId) {
        return questionRepository.calculateTotalMarksByAssessmentId(assessmentId);
    }
    
    
    // Shreeni vasu
    
    public List<QuestionWithOptionsDTO> getQuestionsWithOptionsByAssessmentId(Integer assessmentId) {
        List<Question> questions = questionRepository.findByAssessmentAssessmentId(assessmentId);
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get a specific question with its options
     */
    public QuestionWithOptionsDTO getQuestionWithOptionsById(Integer questionId) {
        return questionRepository.findById(questionId)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    
    
    /**
     * Convert Question entity to QuestionWithOptionsDTO
     */
    private QuestionWithOptionsDTO convertToDTO(Question question) {
        QuestionWithOptionsDTO dto = new QuestionWithOptionsDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType().getQuestionTypeName());
        dto.setQuestionMarks(question.getQuestionMarks());
        
        // Convert options
        List<QuestionOptionDTO> optionDTOs = question.getOptions().stream()
                .map(this::convertOptionToDTO)
                .collect(Collectors.toList());
        
        dto.setOptions(optionDTOs);
        
        return dto;
    }
    
    /**
     * Convert QuestionOption entity to QuestionOptionDTO
     */
    private QuestionOptionDTO convertOptionToDTO(QuestionOption option) {
        QuestionOptionDTO dto = new QuestionOptionDTO();
        dto.setOptionId(option.getOptionId());
        dto.setOptionText(option.getOptionText());
        dto.setIsCorrect(option.getIsCorrect());
        return dto;
    }
    
    
    
    
}