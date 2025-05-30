package com.assessment.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import com.assessment.dto.UserDTO;
import com.assessment.model.Assessment;
import com.assessment.model.Course;
import com.assessment.model.CourseEnrollment;
import com.assessment.model.User;
import com.assessment.model.Module;
import com.assessment.repository.CourseEnrollmentRepository;
import com.assessment.repository.CourseRepository;
import com.assessment.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CourseEnrollmentService {
    
    @Autowired
    private CourseEnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<UserDTO> getEnrolledStudents(Integer courseId) {
        List<CourseEnrollment> enrollments = enrollmentRepository.findByCourse_CourseId(courseId);
        return enrollments.stream()
                .map(enrollment -> convertToDTO(enrollment.getStudent()))
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getAvailableStudents(Integer courseId) {
        // Get all students (role_id = 3) who are not enrolled in this course
        List<User> allStudents = userRepository.findByRole_RoleId(3);
        List<Integer> enrolledStudentIds = enrollmentRepository.findByCourse_CourseId(courseId)
                .stream()
                .map(e -> e.getStudent().getUserId())
                .collect(Collectors.toList());
                
        return allStudents.stream()
                .filter(student -> !enrolledStudentIds.contains(student.getUserId()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getCoursesByStudentId(Integer studentId) {
        List<CourseEnrollment> enrollments = enrollmentRepository.findByStudent_UserId(studentId);
        LocalDateTime currentDate = LocalDateTime.now();

        return enrollments.stream().map(enrollment -> {
            Map<String, Object> courseMap = new HashMap<>();
            Course course = enrollment.getCourse();

            courseMap.put("courseId", course.getCourseId());
            courseMap.put("courseName", course.getCourseName());
            courseMap.put("enrollmentDate", enrollment.getEnrollmentDate());
            courseMap.put("status", course.getCourseStatus());
            courseMap.put("courseEndDate", course.getCourseEndDate());
            
            // Add module information with assessments
            List<Map<String, Object>> modulesList = new ArrayList<>();
            List<Module> modules = course.getModules();
            
            int completedModulesCount = 0;
            int totalAssessments = 0;
            int completedAssessments = 0;
            
            if (modules != null && !modules.isEmpty()) {
                for (Module module : modules) {
                    Map<String, Object> moduleMap = new HashMap<>();
                    moduleMap.put("moduleId", module.getModuleId());
                    moduleMap.put("moduleName", module.getModuleName());
                    moduleMap.put("startDate", module.getStartDate());
                    moduleMap.put("endDate", module.getEndDate());
                    
                    // Check if module end date exists and has passed
                    boolean moduleCompleted = false;
                    if (module.getEndDate() != null && currentDate.isAfter(module.getEndDate())) {
                        moduleCompleted = true;
                        completedModulesCount++;
                    }
                    
                    moduleMap.put("completed", moduleCompleted);
                    
                    // Process assessments for this module
                    List<Map<String, Object>> assessmentsList = new ArrayList<>();
                    List<Assessment> assessments = module.getAssessments();
                    
                    if (assessments != null && !assessments.isEmpty()) {
                        totalAssessments += assessments.size();
                        
                        for (Assessment assessment : assessments) {
                            Map<String, Object> assessmentMap = new HashMap<>();
                            assessmentMap.put("assessmentId", assessment.getAssessmentId());
                            assessmentMap.put("assessmentName", assessment.getAssessmentTitle());
                            assessmentMap.put("dueDate", assessment.getEndDate());
                            
                            // For now, we'll add placeholder data
                            boolean assessmentCompleted = false;
                            if (assessment.getEndDate() != null && currentDate.isAfter(assessment.getEndDate())) {
                                assessmentCompleted = true;
                                completedAssessments++;
                            }
                            
                            assessmentMap.put("completed", assessmentCompleted);
                            assessmentMap.put("score", 85); // Placeholder score
                            assessmentMap.put("maxScore", 100);
                            
                            assessmentsList.add(assessmentMap);
                        }
                    }
                    else {
                        System.out.println("No assessments found for module ID: " + module.getModuleId());
                    }
                    
                    moduleMap.put("assessments", assessmentsList);
                    modulesList.add(moduleMap);
                }
                
                // Calculate progress percentage
                double progress = (double) completedModulesCount / modules.size() * 100;
                courseMap.put("progress", (int) Math.round(progress));
                
                // Add overall assessment statistics
                courseMap.put("totalAssessments", totalAssessments);
                courseMap.put("completedAssessments", completedAssessments);
                double assessmentProgress = totalAssessments > 0 ? 
                    (double) completedAssessments / totalAssessments * 100 : 0;
                courseMap.put("assessmentProgress", (int) Math.round(assessmentProgress));
            } else {
                courseMap.put("progress", 0);
                courseMap.put("totalAssessments", 0);
                courseMap.put("completedAssessments", 0);
                courseMap.put("assessmentProgress", 0);
            }
            
            courseMap.put("modules", modulesList);

            return courseMap;
        }).collect(Collectors.toList());
    }

    
    @Transactional
    public void enrollStudents(Integer courseId, List<Integer> studentIds) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
                
        for (Integer studentId : studentIds) {
            if (!enrollmentRepository.existsByCourse_CourseIdAndStudent_UserId(courseId, studentId)) {
                User student = userRepository.findById(studentId)
                        .orElseThrow(() -> new RuntimeException("Student not found"));
                        
                CourseEnrollment enrollment = new CourseEnrollment();
                enrollment.setCourse(course);
                enrollment.setStudent(student);
                enrollment.setEnrollmentDate(LocalDateTime.now());
                
                enrollmentRepository.save(enrollment);
            }
        }
    }
    
    @Transactional
    public void unenrollStudents(Integer courseId, List<Integer> studentIds) {
        for (Integer studentId : studentIds) {
            enrollmentRepository.deleteByCourse_CourseIdAndStudent_UserId(courseId, studentId);
        }
    }
    
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getUserEmail(),
                user.getUserFirstName(),
                user.getUserLastName(),
                user.getUserMobileNumber(),
                user.getUserStatus(),
                user.getUserDob(),
                user.getUserGender(),
                user.getUserDepartment(),
                user.getUserHighestQualification(),
                user.getUserLastLogin()
        );
    }
}