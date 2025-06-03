package com.assessment.controller;

import com.assessment.model.*;
import com.assessment.model.Module;
import com.assessment.service.BackendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.ParameterizedTypeReference;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;

import javax.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import java.util.stream.Collectors;

@Controller
@RequestMapping("/Student")
public class StudentController {

    @Value("${api.base-url}")
    private String apiBaseUrl;
    
    @Autowired
    private BackendService backendService;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    private final ObjectMapper objectMapper;
    
    public StudentController() {
        // Initialize and configure ObjectMapper to handle Java 8 date/time types
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
    
    @GetMapping("/Login")
    public String showLoginPage() {
        return "Student/Login";
    }
    
   
    // Update the existing profile page method to include model attributes for the forms
    @GetMapping("/Profile")
    public String showProfilePage(HttpSession session, Model model) {
        // Check if user is logged in
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/Student/Login";
        }
        
        try {
            // Fetch user data
            User user = backendService.getUserById(userId);
            model.addAttribute("user", user);
            
            // Fetch courses
            List<Course> courses = backendService.getStudentCourses(userId);
            model.addAttribute("courses", courses);
            
            // Fetch results summary
            List<Result> results = backendService.getResultsByStudentId(userId);
            model.addAttribute("results", results);
            
            // Add empty form binding objects if not already in model
            if (!model.containsAttribute("profileForm")) {
                model.addAttribute("profileForm", user);
            }
            
            if (!model.containsAttribute("passwordForm")) {
                model.addAttribute("passwordForm", new PasswordChangeForm());
            }
            
            return "Student/Profile";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load profile data: " + e.getMessage());
            return "Student/Profile";
        }
    }

    // Create a simple POJO for password change form binding
    public static class PasswordChangeForm {
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;
        
        // Getters and setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
        
        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    }
    
    @GetMapping("/Modules")
    public String showModulesPage(
            @RequestParam(required = false) Integer courseId,
            HttpSession session, 
            Model model) {
        // Check if user is logged in
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/Student/Login";
        }
        
        try {
            // Fetch student courses
            User user = backendService.getUserById(userId);
            model.addAttribute("user", user);
            
            List<Course> courses = backendService.getStudentCourses(userId);
            model.addAttribute("courses", courses);

            // Determine which course ID to use - prioritize request param over session
            final Integer selectedCourseId;
            
            if (courseId != null) {
                // Use the courseId from request parameter if available
                selectedCourseId = courseId;
                // Update session with new selection
                session.setAttribute("selectedCourseId", selectedCourseId);
            } else {
                // No course ID in request, try session or default to first course
                Object sessionCourseId = session.getAttribute("selectedCourseId");
                if (sessionCourseId != null) {
                    if (sessionCourseId instanceof Integer) {
                        selectedCourseId = (Integer) sessionCourseId;
                    } else if (sessionCourseId instanceof String) {
                        selectedCourseId = Integer.parseInt((String) sessionCourseId);
                    } else {
                        // Default to first course if session value is invalid
                        selectedCourseId = courses != null && !courses.isEmpty() ? 
                            courses.get(0).getCourseId() : null;
                        if (selectedCourseId != null) {
                            session.setAttribute("selectedCourseId", selectedCourseId);
                        }
                    }
                } else {
                    // No session value, default to first course
                    selectedCourseId = courses != null && !courses.isEmpty() ? 
                        courses.get(0).getCourseId() : null;
                    if (selectedCourseId != null) {
                        session.setAttribute("selectedCourseId", selectedCourseId);
                    }
                }
            }
            
            // Now selectedCourseId is effectively final for use in lambda
            if (selectedCourseId != null) {
                // Fetch modules for the selected course
                List<Module> modules = backendService.getModulesByCourseId(selectedCourseId);
                model.addAttribute("modules", modules);
                model.addAttribute("selectedCourseId", selectedCourseId);

                // Get the selected course details
                Course selectedCourse = courses.stream()
                    .filter(c -> c.getCourseId().equals(selectedCourseId))
                    .findFirst()
                    .orElse(null);
                model.addAttribute("selectedCourse", selectedCourse);

                // For each module, fetch all assessments and completed assessments
                if (modules != null && !modules.isEmpty()) {
                    Map<Integer, List<Assessment>> assessmentsByModule = new HashMap<>();
                    Map<Integer, List<Result>> completedAssessmentsByModule = new HashMap<>();
                    Map<Integer, List<Assessment>> pendingAssessmentsByModule = new HashMap<>();
                    Map<Integer, String> moduleStatusMap = new HashMap<>();

                    for (Module module : modules) {
                        // Fetch all assessments for this module
                        List<Assessment> assessments = backendService.getAssessmentsByModuleId(module.getModuleId());
                        assessmentsByModule.put(module.getModuleId(), assessments);

                        // Fetch all results for this student for assessments in this module
                        List<Result> moduleResults = backendService.getStudentResultsByModule(userId, module.getModuleId());
                        List<Result> completedAssessments = new ArrayList<>();
                        
                        // Check if moduleResults is not null before trying to stream it
                        if (moduleResults != null) {
                            completedAssessments = moduleResults.stream()
                                .filter(result -> result != null && result.getResultStatus() != null)
                                .collect(Collectors.toList());
                        }
                        completedAssessmentsByModule.put(module.getModuleId(), completedAssessments);

                        // Create a set of completed assessment IDs
                        Set<Integer> completedAssessmentIds = completedAssessments.stream()
                            .map(Result::getAssessmentId)
                            .collect(Collectors.toSet());

                        // Filter to get only pending (not completed) assessments
                        List<Assessment> pendingAssessments = new ArrayList<>();
                        if (assessments != null) {
                            pendingAssessments = assessments.stream()
                                .filter(assessment -> !completedAssessmentIds.contains(assessment.getAssessmentId()))
                                .collect(Collectors.toList());
                        }
                        pendingAssessmentsByModule.put(module.getModuleId(), pendingAssessments);

                        // Calculate module status
                        int total = assessments != null ? assessments.size() : 0;
                        int completed = completedAssessments.size(); // This is now safe since we initialize it as empty list
                        String status;
                        if (total == 0) {
                            status = "not-started";
                        } else if (completed == total) {
                            status = "complete";
                        } else if (completed > 0) {
                            status = "in-progress";
                        } else {
                            status = "not-started";
                        }
                        moduleStatusMap.put(module.getModuleId(), status);
                    }

                    model.addAttribute("assessmentsByModule", assessmentsByModule);
                    model.addAttribute("completedAssessmentsByModule", completedAssessmentsByModule);
                    model.addAttribute("pendingAssessmentsByModule", pendingAssessmentsByModule);
                    model.addAttribute("moduleStatusMap", moduleStatusMap);

                    // Also get overall completed assessments for this student
                    List<Result> allResults = backendService.getResultsByStudentId(userId);
                    // Handle potential null from backend service
                    model.addAttribute("completedAssessments", allResults != null ? allResults : new ArrayList<>());
                }
            }

            return "Student/Modules";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load modules data: " + e.getMessage());
            return "Student/Modules";
        }
    }
    
    @GetMapping("/assessment")
    public String showAssessmentDetails(@RequestParam Integer assessmentId, HttpSession session, Model model) {
        // Check if user is logged in
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/Student/Login";
        }
        
        try {
            // Fetch assessment details
            Assessment assessment = backendService.getAssessmentById(assessmentId);
            if (assessment == null) {
                model.addAttribute("error", "Assessment not found");
                return "Student/error";
            }
            model.addAttribute("assessment", assessment);
            
            // Store assessment ID in session for other pages
            session.setAttribute("currentAssessmentId", assessmentId);
            
            // Check if user has already taken this assessment
            // This might return null if the student hasn't taken the assessment yet
            Result result = backendService.getResultByStudentAndAssessment(userId, assessmentId);
            model.addAttribute("existingResult", result);
            
            return "Student/assessment";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load assessment data: " + e.getMessage());
            return "Student/error";
        }
    }
    
    @GetMapping("/questions/{assessmentId}")
    public String showQuestionsPage(@PathVariable Integer assessmentId, HttpSession session, Model model) {
        // Check if user is logged in
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/Student/Login";
        }
        
        try {
            // Store assessment ID in session
            session.setAttribute("currentAssessmentId", assessmentId);
            
            // Fetch assessment details
            Assessment assessment = backendService.getAssessmentById(assessmentId);
            if (assessment == null) {
                return "redirect:/Student/Modules";
            }
            model.addAttribute("assessment", assessment);
            
            // Fetch questions with options for this assessment
            List<QuestionWithOptions> questions = backendService.getQuestionsWithOptionsByAssessmentId(assessmentId);
            model.addAttribute("questions", questions);
            
            // Add userId to model for form submissions
            model.addAttribute("userId", userId);
            
            return "Student/questions";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load questions: " + e.getMessage());
            return "redirect:/Student/Assessment/" + assessmentId;
        }
    }
    
    @PostMapping("/SubmitAssessment/{assessmentId}")
    public String submitAssessment(
        @PathVariable Integer assessmentId,
        @RequestParam Map<String, String> formData,
        HttpSession session,
        RedirectAttributes redirectAttributes) {
        
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/Student/Login";
        }
        
        try {
            // Process each question response from the form
            for (Map.Entry<String, String> entry : formData.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                
                // Skip non-response fields
                if (!key.startsWith("question_")) {
                    continue;
                }
                
                // Parse the question ID from the field name
                // Format is "question_{id}" or "question_{id}_text" for text responses
                String[] parts = key.split("_");
                if (parts.length < 2) {
                    continue;
                }
                
                Integer questionId = Integer.parseInt(parts[1]);
                
                // Handle different question types
                if (parts.length > 2 && parts[2].equals("text")) {
                    // Text response (short answer or essay) - use the text API endpoint
                    Map<String, Object> textResponse = new HashMap<>();
                    textResponse.put("studentId", userId);
                    textResponse.put("questionId", questionId);
                    textResponse.put("responseText", value);
                    
                    backendService.saveTextResponse(textResponse);
                } else {
                    // Option-based responses - use the regular response API endpoint
                    String[] optionIds = value.split(",");
                    for (String optionId : optionIds) {
                        if (optionId.trim().isEmpty()) {
                            continue;
                        }
                        
                        Map<String, Object> response = new HashMap<>();
                        
                        Map<String, Object> student = new HashMap<>();
                        student.put("userId", userId);
                        response.put("student", student);
                        
                        Map<String, Object> option = new HashMap<>();
                        option.put("optionId", Integer.parseInt(optionId.trim()));
                        response.put("option", option);
                        
                        response.put("responseText", null);
                        
                        backendService.saveResponse(response);
                    }
                }
            }
            
            redirectAttributes.addFlashAttribute("success", "Assessment submitted successfully!");
            return "redirect:/Student/Result/" + assessmentId;
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Failed to submit assessment: " + e.getMessage());
            return "redirect:/Student/questions/" + assessmentId;
        }
    }
    
    @GetMapping("/result")
    public String showResultPage(@RequestParam Integer assessmentId, HttpSession session, Model model) {
        // Check if user is logged in
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/Student/Login";
        }
        
        try {
            // Fetch assessment details
            Assessment assessment = backendService.getAssessmentById(assessmentId);
            model.addAttribute("assessment", assessment);
            
            // Fetch result
            Result result = backendService.getResultByStudentAndAssessment(userId, assessmentId);
            model.addAttribute("result", result);
            
            // Add formatted date strings to the model
            if (result != null && result.getCompletedDate() != null) {
                // Format for "MMM dd, yyyy HH:mm"
                DateTimeFormatter shortFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
                model.addAttribute("formattedCompletionDate", result.getCompletedDate().format(shortFormatter));
                
                // Format for "MMMM dd, yyyy"
                DateTimeFormatter longFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
                model.addAttribute("formattedCertificateDate", result.getCompletedDate().format(longFormatter));
            } else {
                model.addAttribute("formattedCompletionDate", "Not available");
                
                // For certificate, use current date if completion date is not available
                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter longFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
                model.addAttribute("formattedCertificateDate", now.format(longFormatter));
            }
            
            // Fetch question responses
            List<QuestionResponse> questionResponses = 
                backendService.getQuestionsWithResponsesByStudentAndAssessment(userId, assessmentId);
            model.addAttribute("questionResponses", questionResponses);
            
            // Calculate question statistics in the controller
            int totalQuestions = 0;
            int correctAnswers = 0;
            int incorrectAnswers = 0;
            
            if (questionResponses != null) {
                totalQuestions = questionResponses.size();
                
                for (QuestionResponse qr : questionResponses) {
                    if (qr.getIsCorrect()) {
                        correctAnswers++;
                    } else {
                        incorrectAnswers++;
                    }
                }
            }
            
            // Add calculated values to the model
            model.addAttribute("totalQuestions", totalQuestions);
            model.addAttribute("correctAnswers", correctAnswers);
            model.addAttribute("incorrectAnswers", incorrectAnswers);
            
            // Fetch user data for certificate
            User user = backendService.getUserById(userId);
            model.addAttribute("user", user);
            
            return "Student/result";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load result data: " + e.getMessage());
            return "Student/result";
        }
    }
    
    @GetMapping("/Logout")
    public String logout(HttpSession session) {
        try {
            // Get user ID for logging
            Integer userId = (Integer) session.getAttribute("userId");
            if (userId != null) {
                // Call backend logout endpoint (optional)
                try {
                    String logoutUrl = apiBaseUrl + "/api/auth/logout";
                    restTemplate.getForEntity(logoutUrl, Void.class);
                } catch (Exception e) {
                    // If backend logout fails, continue with local logout
                    System.err.println("Backend logout failed: " + e.getMessage());
                }
            }
            
            // Invalidate session
            session.invalidate();
        } catch (Exception e) {
            System.err.println("Logout error: " + e.getMessage());
        }
        
        // Redirect to login page
        return "redirect:/Student/Login";
    }
}