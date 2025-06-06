package com.assessment.service;

import com.assessment.dto.ResultDTO;
import com.assessment.model.Assessment;
import com.assessment.model.Result;
import com.assessment.model.User;
import com.assessment.repository.AssessmentRepository;
import com.assessment.repository.ResultRepository;
import com.assessment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    /**
     * Get result by student ID and assessment ID
     */
    public Optional<ResultDTO> getResultByStudentAndAssessment(Integer studentId, Integer assessmentId) {
        Optional<User> student = userRepository.findById(studentId);
        Optional<Assessment> assessment = assessmentRepository.findById(assessmentId);
        
        if (student.isPresent() && assessment.isPresent()) {
            Optional<Result> result = resultRepository.findByStudentAndAssessment(student.get(), assessment.get());
            return result.map(this::convertToDTO);
        }
        
        return Optional.empty();
    }
    
    /**
     * Get all results for a student
     */
    public List<ResultDTO> getResultsByStudent(Integer studentId) {
        Optional<User> student = userRepository.findById(studentId);
        if (student.isPresent()) {
            return resultRepository.findByStudent(student.get()).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    /**
     * Get all results for an assessment
     */
    public List<ResultDTO> getResultsByAssessment(Integer assessmentId) {
        Optional<Assessment> assessment = assessmentRepository.findById(assessmentId);
        if (assessment.isPresent()) {
            return resultRepository.findByAssessment(assessment.get()).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    /**
     * Get all results for a student for a specific module
     * @param studentId the ID of the student
     * @param moduleId the ID of the module
     * @return list of result DTOs for the student and module
     */
    public List<ResultDTO> getStudentResultsByModule(Integer studentId, Integer moduleId) {
        Optional<User> student = userRepository.findById(studentId);
        
        if (student.isPresent()) {
            // Find all results where the student ID matches and the assessment's module ID matches
            List<Result> results = resultRepository.findByStudentUserIdAndAssessmentModuleModuleId(
                    studentId, moduleId);
            
            return results.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        
        return List.of();
    }
    /**
     * Convert Result entity to ResultDTO
     */
    private ResultDTO convertToDTO(Result result) {
        ResultDTO dto = new ResultDTO();
        dto.setResultId(result.getResultId());
        
        // Set assessment information
        if (result.getAssessment() != null) {
            dto.setAssessmentId(result.getAssessment().getAssessmentId());
            dto.setAssessmentTitle(result.getAssessment().getAssessmentTitle());
        }
        
        // Set student information
        if (result.getStudent() != null) {
            dto.setStudentId(result.getStudent().getUserId());
            dto.setStudentName(result.getStudent().getUserFirstName() + " " + 
                              result.getStudent().getUserLastName());
        }
        
        dto.setTotalMarks(result.getTotalMarks());
        dto.setObtainedMarks(result.getObtainedMarks());
        dto.setResultPercentage(result.getResultPercentage());
        dto.setResultStatus(result.getResultStatus());
        dto.setCompletedDate(result.getCompletedDate());
        
        return dto;
    }
}