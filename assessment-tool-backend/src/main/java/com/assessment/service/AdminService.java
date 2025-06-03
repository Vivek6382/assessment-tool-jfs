package com.assessment.service;

import com.assessment.dto.AdminDTO;
import com.assessment.dto.AdminProfileUpdateDTO;
import com.assessment.dto.AssessmentPerformanceDTO;
import com.assessment.dto.AssessmentReportDTO;
import com.assessment.dto.QuestionAccuracyDTO;
import com.assessment.model.Assessment;
import com.assessment.model.Question;
import com.assessment.model.Response;
import com.assessment.model.Result;
//import com.assessment.model.Role;
import com.assessment.model.User;
import com.assessment.repository.AssessmentRepository;
//import com.assessment.repository.CourseRepository;
import com.assessment.repository.QuestionRepository;
import com.assessment.repository.ResponseRepository;
import com.assessment.repository.ResultRepository;
//import com.assessment.repository.RoleRepository;
import com.assessment.repository.UserRepository;

//import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    
//    @Autowired
//    private RoleRepository roleRepository;
    
//    @Autowired
//    private CourseRepository courseRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    @Autowired
    private ResultRepository resultRepository;
    
    @Autowired
    private ResponseRepository responseRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Get admin by ID
     */
    public AdminDTO getAdminById(Integer adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        // Verify this is an admin user
        if (admin.getRole() == null || !admin.getRole().getRoleName().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("User is not an admin");
        }
        
        return convertToDTO(admin);
    }
    
    /**
     * Get admin by username
     */
    public AdminDTO getAdminByUsername(String username) {
        User admin = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Admin not found with username: " + username));
        
//        if (admin == null) {
//            throw new RuntimeException("Admin not found with username: " + username);
//        }
        
        // Verify this is an admin user
        if (admin.getRole() == null || !admin.getRole().getRoleName().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("User is not an admin");
        }
        
        return convertToDTO(admin);
    }
    
    /**
     * Update admin profile (email and password)
     */
    @Transactional
    public AdminDTO updateAdminProfile(AdminProfileUpdateDTO updateDTO) {
    	User admin = userRepository.findById(updateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + updateDTO.getUserId()));
        
        // Verify this is an admin
        if (admin.getRole() == null || !admin.getRole().getRoleName().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("User is not an admin");
        }
        
        // Update email if provided
        if (updateDTO.getUserEmail() != null && !updateDTO.getUserEmail().isEmpty()) {
            admin.setUserEmail(updateDTO.getUserEmail());
        }
        
        // Update password if provided
        if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {
            admin.setUserPasswordHash(passwordEncoder.encode(updateDTO.getNewPassword()));
        }
        
        // Save updated admin
        admin = userRepository.save(admin);
        
        return convertToDTO(admin);
    }
    
    /**
     * Convert User entity to AdminDTO
     */
    private AdminDTO convertToDTO(User user) {
        AdminDTO dto = new AdminDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setUserEmail(user.getUserEmail());
        dto.setUserFirstName(user.getUserFirstName());
        dto.setUserLastName(user.getUserLastName());
        dto.setUserMobileNumber(user.getUserMobileNumber());
        dto.setUserDob(user.getUserDob());
        dto.setUserGender(user.getUserGender());
        dto.setUserCreatedAt(user.getUserCreatedAt());
        dto.setUserLastLogin(user.getUserLastLogin());
        return dto;
    }
    
    /**
     * Verify password
     */
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
    	return passwordEncoder.matches(rawPassword, hashedPassword);
    }
    
    // Dashboard Methods

    public List<AssessmentPerformanceDTO> getAveragePerformanceByCourse(Long courseId) {
        List<Assessment> assessments = assessmentRepository.findByCourseId(courseId);
        List<AssessmentPerformanceDTO> results = new ArrayList<>();

        for (Assessment assessment : assessments) {
            List<Result> resultsForAssessment = resultRepository.findByAssessment_AssessmentId(assessment.getAssessmentId());
            double total = resultsForAssessment.stream().mapToDouble(Result::getObtainedMarks).sum();
            double maxTotal = resultsForAssessment.size() * assessment.getAssessmentTotalMarks();
            double percentage = (maxTotal > 0) ? (total / maxTotal) * 100 : 0;
            
            percentage = Math.round(percentage * 100.0) / 100.0;

            results.add(new AssessmentPerformanceDTO(assessment.getAssessmentTitle(), percentage));
        }

        return results;
    }
    
    public List<QuestionAccuracyDTO> getQuestionAnalysis(Long courseId, Integer assessmentId) {
    	// Step 1: Validate the assessment belongs to the course
        Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
        if (assessmentOpt.isEmpty() || !courseId.equals(assessmentOpt.get().getModule().getCourse().getCourseId().longValue())) {
            return Collections.emptyList(); // or throw exception
        }

        // Step 2: Get questions in the assessment
        List<Question> questions = questionRepository.findByAssessmentAssessmentId(assessmentId);
        List<QuestionAccuracyDTO> data = new ArrayList<>();

        // Step 3: For each question, calculate accuracy
        for (Question question : questions) {
            List<Response> responses = responseRepository.findByQuestion_QuestionId(question.getQuestionId());
            long total = responses.size();
            long correct = responses.stream().filter(r -> Boolean.TRUE.equals(r.getIsResponseCorrect())).count();
            double percentage = (total > 0) ? ((double) correct / total) * 100 : 0;

            data.add(new QuestionAccuracyDTO(question.getQuestionText(), percentage));
        }

        return data;
    }
    
    public List<AssessmentPerformanceDTO> getStudentProgress(Long courseId, Integer studentId) {
    	List<Result> results = resultRepository.findByStudentIdAndCourseId(studentId, courseId);
        List<AssessmentPerformanceDTO> progress = new ArrayList<>();

        for (Result result : results) {
            String title = result.getAssessment().getAssessmentTitle();
            double percentage = (result.getResultPercentage() != null) ? result.getResultPercentage() : 0.0;
            progress.add(new AssessmentPerformanceDTO(title, percentage));
        }

        return progress;
    }
    
    public List<AssessmentReportDTO> getAssessmentReports() {
        List<Assessment> assessments = assessmentRepository.findAll();
        List<AssessmentReportDTO> reports = new ArrayList<>();

        for (Assessment assessment : assessments) {
            List<Result> results = resultRepository.findByAssessment_AssessmentId(assessment.getAssessmentId());
            if (results.isEmpty()) continue;

            double total = results.stream().mapToDouble(Result::getObtainedMarks).sum();
            //double maxTotal = results.size() * assessment.getAssessmentTotalMarks();
            double avg = (total > 0) ? (total / results.size())  : 0;

            double high = results.stream().mapToDouble(Result::getObtainedMarks).max().orElse(0);
            double low = results.stream().mapToDouble(Result::getObtainedMarks).min().orElse(0);
//            long totalEnrolled = userRepository.countStudentsByCourseId(assessment.getModule().getCourse().getCourseId());
//            double completionRate = totalEnrolled > 0 ? (results.size() * 100.0) / totalEnrolled : 0;

            reports.add(new AssessmentReportDTO(
                    assessment.getAssessmentTitle(),
                    avg,
                    (high),
                    (low)
                    //completionRate
                    ));
        }

        return reports;
    }

}