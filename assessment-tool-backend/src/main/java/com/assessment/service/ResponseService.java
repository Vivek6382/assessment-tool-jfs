package com.assessment.service;

import com.assessment.model.*;
import com.assessment.repository.ResponseRepository;
import com.assessment.repository.ResultRepository;
import com.assessment.repository.UserRepository;
import com.assessment.repository.AssessmentRepository;
import com.assessment.repository.QuestionOptionRepository;
import com.assessment.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private QuestionOptionRepository questionOptionRepository;

    @Autowired
    private ResultRepository resultRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Transactional
    public Response saveResponse(Response response) {
        // Set response timestamp
        response.setResponseTimestamp(LocalDateTime.now());
        
        // Get the student entity
        if (response.getStudent() != null && response.getStudent().getUserId() != null) {
            User student = userRepository.findById(response.getStudent().getUserId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            response.setStudent(student);
        }
        
        // Get the question entity
        if (response.getQuestion() != null && response.getQuestion().getQuestionId() != null) {
            Question question = questionRepository.findById(response.getQuestion().getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));
            response.setQuestion(question);
        }
        
        // Handle case where option is null (for text-based responses)
        if (response.getOption() == null || response.getOption().getOptionId() == null) {
            // For text responses, we can't automatically grade
            response.setIsResponseCorrect(null);
            response.setMarksObtained(0); // Initially 0 until manually graded
            
            // Save the response without trying to access the option
            Response savedResponse = responseRepository.save(response);
            
            // Calculate result if question and student are set
            if (response.getQuestion() != null && response.getStudent() != null) {
                calculateAndSaveResult(response.getStudent(), response.getQuestion().getAssessment());
            }
            
            return savedResponse;
        }
        
        // For option-based responses
        try {
            // Get the selected option
            QuestionOption option = questionOptionRepository.findById(response.getOption().getOptionId())
                    .orElseThrow(() -> new RuntimeException("Option not found"));
            
            response.setOption(option);

            // Check if the selected option is correct
            response.setIsResponseCorrect(option.getIsCorrect());

            // If the option is correct, set marks obtained based on question marks
            if (Boolean.TRUE.equals(option.getIsCorrect())) {
                response.setMarksObtained(option.getQuestion().getQuestionMarks());
            } else {
                response.setMarksObtained(0);
            }

            // Save the response
            Response savedResponse = responseRepository.save(response);

            // Check if all questions are answered and calculate result
            if (option.getQuestion() != null && option.getQuestion().getAssessment() != null) {
                calculateAndSaveResult(response.getStudent(), option.getQuestion().getAssessment());
            } else if (response.getQuestion() != null && response.getQuestion().getAssessment() != null) {
                calculateAndSaveResult(response.getStudent(), response.getQuestion().getAssessment());
            }

            return savedResponse;
        } catch (Exception e) {
            // Log the error
            System.err.println("Error processing response: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void calculateAndSaveResult(User student, Assessment assessment) {
        try {
            // Get all questions for the assessment
            List<Question> questions = questionRepository.findByAssessmentAssessmentId(assessment.getAssessmentId());
            
            // Get all responses for this student and assessment
            List<Response> responses = responseRepository.findByStudentUserIdAndQuestionAssessmentAssessmentId(
                    student.getUserId(), assessment.getAssessmentId());
            
            System.out.println("Questions count: " + questions.size() + ", Responses count: " + responses.size());
            
            // Check if all questions are answered
            if (responses.size() >= questions.size()) {
                // Calculate total obtained marks
                Integer obtainedMarks = responses.stream()
                        .mapToInt(r -> r.getMarksObtained() != null ? r.getMarksObtained() : 0)
                        .sum();
                
                // Fetch the fresh assessment data to ensure we have the latest values
                Assessment freshAssessment = assessmentRepository.findById(assessment.getAssessmentId())
                        .orElse(assessment);
                
                // Get the assessment total marks from the assessment entity
                Integer totalMarks = freshAssessment.getAssessmentTotalMarks();
                
                System.out.println("Assessment ID: " + freshAssessment.getAssessmentId() + 
                                  ", Total marks from assessment: " + totalMarks);
                
                // Make sure we have valid total marks to avoid division by zero
                if (totalMarks == null || totalMarks == 0) {
                    // Calculate total marks from questions if not set in assessment
                    totalMarks = questions.stream()
                            .mapToInt(q -> q.getQuestionMarks() != null ? q.getQuestionMarks() : 0)
                            .sum();
                    
                    System.out.println("Calculated total marks from questions: " + totalMarks);
                    
                    // If still zero, set a default to avoid division by zero
                    if (totalMarks == 0) {
                        totalMarks = 100; // Default value
                        System.out.println("Warning: Assessment total marks is zero, using default value of 100");
                    }
                }
                
                // Calculate percentage (as a float between 0 and 100)
                float resultPercentage = (obtainedMarks * 100.0f) / totalMarks;
                
                System.out.println("Obtained marks: " + obtainedMarks + ", Total marks: " + totalMarks + 
                                  ", Percentage: " + resultPercentage);
                
                // Determine result status based on passing score
                Integer passingScore = freshAssessment.getAssessmentPassingScore();
                if (passingScore == null || passingScore == 0) {
                    // Default to 40% if not set
                    passingScore = (int)(totalMarks * 0.4);
                    System.out.println("Warning: Assessment passing score is not set, using default 40%: " + passingScore);
                }
                
                String resultStatus = (obtainedMarks >= passingScore) ? "pass" : "fail";
                
                // Create or update result
                Result result = resultRepository.findByStudentAndAssessment(student, freshAssessment)
                        .orElse(new Result());
                
                result.setStudent(student);
                result.setAssessment(freshAssessment);
                result.setTotalMarks(totalMarks);
                result.setObtainedMarks(obtainedMarks);
                result.setResultPercentage(resultPercentage);
                result.setResultStatus(resultStatus);
                result.setCompletedDate(LocalDateTime.now());
                
                resultRepository.save(result);
                System.out.println("Result saved successfully for student: " + student.getUserId() + 
                                  ", assessment: " + freshAssessment.getAssessmentId() + 
                                  ", percentage: " + resultPercentage + "%, status: " + resultStatus);
            } else {
                System.out.println("Not all questions answered yet. Questions: " + questions.size() + 
                                  ", Responses: " + responses.size());
            }
        } catch (Exception e) {
            System.err.println("Error calculating and saving result: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    @Transactional
    public Response saveTextResponse(Integer studentId, Integer questionId, String responseText) {
        // Get the student
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Get the question
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Create a new response
        Response response = new Response();
        response.setStudent(student);
        response.setQuestion(question); // Set the question explicitly
        response.setResponseText(responseText);
        response.setIsResponseCorrect(null); // Can't determine correctness automatically
        response.setMarksObtained(0); // Initially 0 until manually graded
        response.setResponseTimestamp(LocalDateTime.now());
        
        // Save the response
        Response savedResponse = responseRepository.save(response);
        
        // Calculate and save result
        if (question.getAssessment() != null) {
            calculateAndSaveResult(student, question.getAssessment());
        }
        
        return savedResponse;
    }
}