package com.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.assessment.service.AssessmentService;

//import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

//import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
//import java.util.stream.Collectors;

@Controller
@RequestMapping("/EducatorConfig")
public class EducatorConfigController {

    @Autowired
    private AssessmentService assessmentService;

    // Basic Settings
    @GetMapping("/TestConfiguration/BasicSettings")
    public String showBasicSettings(Model model, HttpSession session,
            @RequestParam(required = false) Integer assessmentId) {
        
        // Clear session when no assessmentId is provided (new test clicked)
        if (assessmentId == null) {
            session.removeAttribute("currentAssessmentId");
            model.addAttribute("isNewAssessment", true);
            model.addAttribute("assessment", createDefaultAssessment());
            return "EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Set new assessment ID if provided
        if (assessmentId != null && assessmentId > 0) {
            session.setAttribute("currentAssessmentId", assessmentId);
        }
        
        Integer currentAssessmentId = (Integer) session.getAttribute("currentAssessmentId");
        Map<String, Object> assessment = new HashMap<>();
        boolean isNewAssessment = false;
        
        if (currentAssessmentId != null) {
            // Get existing assessment data
            assessment = assessmentService.getAssessmentById(currentAssessmentId);
            
            // Check if assessment was found
            if (assessment.containsKey("success") && (boolean)assessment.get("success") == false) {
                // Reset session if assessment not found
                session.removeAttribute("currentAssessmentId");
                assessment = createDefaultAssessment();
                isNewAssessment = true;
            }
        } else {
            // Set default values for new assessment
            assessment = createDefaultAssessment();
            isNewAssessment = true;
        }
        
        // Ensure assessmentStatus is always present
        if (!assessment.containsKey("assessmentStatus")) {
            assessment.put("assessmentStatus", "draft");
        }
        
        // Get modules for dropdown
        Map<String, Object> modulesResponse = assessmentService.getAllAssessmentModules();
        
        model.addAttribute("assessment", assessment);
        model.addAttribute("isNewAssessment", isNewAssessment);
        model.addAttribute("hasAssessmentId", currentAssessmentId != null);
        
        if (modulesResponse.containsKey("success") && (boolean)modulesResponse.get("success")) {
            model.addAttribute("modules", modulesResponse.get("data"));
        } else {
            model.addAttribute("modules", Collections.emptyList());
        }
        
        return "EducatorConfig/TestConfiguration/BasicSettings";
    }
     
    
    
    @PostMapping("/TestConfiguration/SaveBasicSettings")
    @ResponseBody
    public Map<String, Object> saveBasicSettings(
            @RequestBody Map<String, Object> assessmentData,
            HttpSession session) {
        
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        Map<String, Object> result;
        
        if (assessmentId == null) {
            // Create new assessment
            result = assessmentService.createAssessment(assessmentData);
            
            if (result.containsKey("success") && (boolean)result.get("success") && result.containsKey("assessmentId")) {
                session.setAttribute("currentAssessmentId", result.get("assessmentId"));
            }
        } else {
            // Update existing assessment
            result = assessmentService.updateAssessment(assessmentId, assessmentData);
        }
        
        return result;
    }

    
    @PutMapping("/TestConfiguration/UpdateBasicSettings")
    @ResponseBody
    public Map<String, Object> updateBasicSettings(
            @RequestBody Map<String, Object> assessmentData,
            @RequestParam Integer assessmentId) {
        
        return assessmentService.updateAssessment(assessmentId, assessmentData);
    }
    
    // Helper method to create default assessment data
    private Map<String, Object> createDefaultAssessment() {
        Map<String, Object> assessment = new HashMap<>();
        assessment.put("assessmentTitle", "New test");
        assessment.put("assessmentDescription", "");
        assessment.put("moduleId", null);
        assessment.put("moduleName", null);
        assessment.put("assessmentStatus", "draft"); // Add this to prevent template error
        return assessment;
    }
    
    // Other tab endpoints that should redirect if no assessment exists
    @GetMapping("/TestConfiguration/{tab}")
    public String handleTabNavigation(@PathVariable String tab, HttpSession session, Model model) {
        // Check if assessment exists in session
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            // Redirect to BasicSettings if no assessment ID in session
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Verify assessment exists in database
        Map<String, Object> assessmentResponse = assessmentService.getAssessmentById(assessmentId);
        if (assessmentResponse.containsKey("success") && !(boolean)assessmentResponse.get("success")) {
            // If assessment not found, clear session and redirect
            session.removeAttribute("currentAssessmentId");
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Add assessment data to model
        model.addAttribute("assessment", assessmentResponse);
        
        // Return appropriate view based on tab
        return "EducatorConfig/TestConfiguration/" + tab;
    }
    
    
    
    
//    For Modules 
    
    
 // Changed endpoints to use /api/assessment-modules
    
  // For Modules
    @PostMapping("/api/assessment-modules")
    @ResponseBody
    public Map<String, Object> createAssessmentModule(@RequestBody Map<String, Object> moduleData) {
        return assessmentService.createAssessmentModule(moduleData);
    }

    @GetMapping("/api/assessment-modules")
    @ResponseBody
    public Map<String, Object> getAllAssessmentModules() {
        return assessmentService.getAllAssessmentModules();
    }
 
    
    // Simple endpoint to render QuestionDashboard
    @GetMapping("/TestConfiguration/QuestionDashboard")
    public String showQuestionDashboard(Model model, HttpSession session) {
        // Check if assessment exists in session
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Get assessment data to check status
        Map<String, Object> assessment = assessmentService.getAssessmentById(assessmentId);
        if (assessment == null || !(boolean)assessment.get("success")) {
            session.removeAttribute("currentAssessmentId");
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Add assessment data to model
        model.addAttribute("assessment", assessment);
        
        return "EducatorConfig/TestConfiguration/QuestionDashboard";
    }
    
    
    
    
 // Question Management
    
    
    
    @GetMapping("/TestConfiguration/QuestionManager")
    public String getQuestionManager(
        @RequestParam(required = false) Integer questionId, 
        Model model) {
        
        try {
            // If editing existing question
            if (questionId != null) {
                Map<String, Object> response = assessmentService.getQuestionById(questionId);
                
                // Debug print - remove after testing
                System.out.println("Question Data Response: " + response);
                
                if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                    model.addAttribute("question", response.get("question"));
                    model.addAttribute("questionId", questionId);
                    model.addAttribute("isEditMode", true);
                } else {
                    String errorMsg = "Question not found or error loading question";
                    if (response != null && response.containsKey("error")) {
                        errorMsg = (String) response.get("error");
                    }
                    model.addAttribute("error", errorMsg);
                    // Stay on page but show error
                }
            }
            
            // Always load question types
            Map<String, Object> questionTypes = assessmentService.getQuestionTypes();
            model.addAttribute("questionTypes", questionTypes);
            
            return "EducatorConfig/TestConfiguration/QuestionManager";
            
        } catch (Exception e) {
            model.addAttribute("error", "System error: " + e.getMessage());
            // Stay on page but show error
            return "EducatorConfig/TestConfiguration/QuestionManager";
        }
    }

    
    
 // Get all questions for dashboard
    @GetMapping("/TestConfiguration/GetAllQuestions")
    @ResponseBody
    public Map<String, Object> getAllQuestions(HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return Map.of("success", false, "error", "No assessment selected");
        }
        
        try {
            // First get assessment to check status
            Map<String, Object> assessmentResponse = assessmentService.getAssessmentById(assessmentId);
            if (!(boolean)assessmentResponse.get("success")) {
                return Map.of("success", false, "error", "Assessment not found");
            }
            
            // Then get questions for this assessment
            Map<String, Object> questionsResponse = assessmentService.getQuestionsByAssessmentId(assessmentId);
            
            // Combine responses
            Map<String, Object> result = new HashMap<>();
            result.putAll(questionsResponse);
            result.put("assessmentStatus", assessmentResponse.get("assessmentStatus"));
            
            return result;
        } catch (Exception e) {
            return Map.of("success", false, "error", "Error loading questions: " + e.getMessage());
        }
    }
    
    
    
    // Question Management
    @PostMapping("/TestConfiguration/SaveQuestion")
    @ResponseBody
    public ResponseEntity<?> saveQuestion(
            @RequestParam(required = false) Integer questionId,
            @RequestBody Map<String, Object> questionData,
            HttpSession session) {
        
        try {
            // Add assessment ID to question data if available in session
            Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
            if (assessmentId != null) {
                questionData.put("assessmentId", assessmentId);
            }
            
            Map<String, Object> response;
            
            if (questionId == null) {
                // Create new question
                response = assessmentService.createQuestion(questionData);
            } else {
                // Update existing question
                response = assessmentService.updateQuestion(questionId, questionData);
            }
            
            // Check if the operation was successful
            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                // Get saved question ID from response
                Map<String, Object> savedQuestion = (Map<String, Object>) response.get("question");
                
                // Add redirect URL to response
                Boolean saveAndAddNext = (Boolean) questionData.get("saveAndAddNext");
                if (Boolean.TRUE.equals(saveAndAddNext)) {
                    response.put("redirectUrl", "/EducatorConfig/TestConfiguration/QuestionManager");
                } else {
                    response.put("redirectUrl", "/EducatorConfig/TestConfiguration/QuestionDashboard");
                }
                
                return ResponseEntity.ok(response);
            } else {
                // Something went wrong
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(response != null ? response : Map.of("success", false, "error", "Unknown error occurred"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    
    
 // Add this method to EducatorConfigController
    @PutMapping("/TestConfiguration/SaveQuestion")
    @ResponseBody
    public ResponseEntity<?> updateQuestion(
            @RequestParam Integer questionId,
            @RequestBody Map<String, Object> questionData,
            HttpSession session) {
        
        try {
            // Add assessment ID to question data if available in session
            Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
            if (assessmentId != null) {
                questionData.put("assessmentId", assessmentId);
            }
            
            // Call the service to update the question
            Map<String, Object> response = assessmentService.updateQuestion(questionId, questionData);
            
            // Check if the operation was successful
            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                // Add redirect URL to response
                response.put("redirectUrl", "/EducatorConfig/TestConfiguration/QuestionDashboard");
                return ResponseEntity.ok(response);
            } else {
                // Something went wrong
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(response != null ? response : Map.of("success", false, "error", "Unknown error occurred"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    
//    For test sets 
    
    
  
    @GetMapping("/TestConfiguration/TestSets")
    public String showTestSets(Model model, HttpSession session) {
        // Check if there's an assessment ID in the session
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        
        if (assessmentId == null) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Get assessment data
        Map<String, Object> assessment = assessmentService.getAssessmentById(assessmentId);
        
        if (assessment == null || !(boolean)assessment.get("success")) {
            session.removeAttribute("currentAssessmentId");
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Add assessment data to model
        model.addAttribute("assessment", assessment);
        
        // Get module data if available
        if (assessment.containsKey("moduleId") && assessment.get("moduleId") != null) {
        	Map<String, Object> module = assessmentService.getAssessmentModuleById((Integer) assessment.get("moduleId"));
            model.addAttribute("module", module.get("data"));
        }
        
        return "EducatorConfig/TestConfiguration/TestSets";
    }
    
    
    
    @GetMapping("/TestConfiguration/GetAssessmentById")
    @ResponseBody
    public Map<String, Object> getAssessmentById(@RequestParam Integer assessmentId) {
        return assessmentService.getAssessmentById(assessmentId);
    }

    @PostMapping("/TestConfiguration/SaveQuestionOrder")
    @ResponseBody
    public Map<String, Object> saveQuestionOrder(
            @RequestBody Map<String, String> requestBody,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        
        if (assessmentId == null) {
            response.put("success", false);
            response.put("error", "No assessment selected. Please start from Basic Settings.");
            return response;
        }
        
        String questionOrder = requestBody.get("questionOrder");
        if (questionOrder == null || !questionOrder.matches("FIXED|RANDOM|DIFFICULTY")) {
            response.put("success", false);
            response.put("error", "Invalid question order value. Must be FIXED, RANDOM or DIFFICULTY");
            return response;
        }
        
        try {
            // Call the service to update the question order
            Map<String, Object> serviceResponse = assessmentService.updateQuestionOrder(assessmentId, questionOrder);
            
            if (serviceResponse.containsKey("success") && (boolean)serviceResponse.get("success")) {
                response.put("success", true);
                response.put("message", "Question order updated successfully");
                response.put("questionOrder", questionOrder);
            } else {
                response.put("success", false);
                response.put("error", serviceResponse.getOrDefault("error", "Failed to update question order"));
            }
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error saving question order: " + e.getMessage());
            return response;
        }
    }
    
    
    

//  For the test start page
  
    
 // In EducatorConfigController.java - update showTestStartPage method
    @GetMapping("/TestConfiguration/TestStartPage")
    public String showTestStartPage(Model model, HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        
        if (assessmentId == null) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Get assessment data
        Map<String, Object> assessment = assessmentService.getAssessmentById(assessmentId);
        
        if (assessment == null || !(boolean)assessment.get("success")) {
            session.removeAttribute("currentAssessmentId");
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Add all assessment data to model
        model.addAllAttributes(assessment);
        return "EducatorConfig/TestConfiguration/TestStartPage";
    }

    @PostMapping("/TestConfiguration/SaveTestStartSettings")
    @ResponseBody
    public Map<String, Object> saveTestStartSettings(
            @RequestBody Map<String, Object> settingsData,
            HttpSession session) {
        
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return Map.of("success", false, "error", "No assessment selected");
        }
        
        return assessmentService.saveTestStartSettings(assessmentId, settingsData);
    }
    
    
    
    
//    For the Grading and Summary
    
    
    @GetMapping("/TestConfiguration/GradingSummary")
    public String showGradingSummary(Model model, HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        
        if (assessmentId == null) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Get grading summary data
        Map<String, Object> gradingSummary = assessmentService.getGradingSummary(assessmentId);
        
        if (gradingSummary == null || !(boolean)gradingSummary.get("success")) {
            session.removeAttribute("currentAssessmentId");
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        model.addAttribute("gradingSummary", gradingSummary);
        return "EducatorConfig/TestConfiguration/GradingSummary";
    }

    @PostMapping("/TestConfiguration/SaveGradingSummary")
    @ResponseBody
    public Map<String, Object> saveGradingSummary(
            @RequestBody Map<String, Object> gradingData,
            HttpSession session) {
        
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return Map.of("success", false, "error", "No assessment selected");
        }
        
        return assessmentService.saveGradingSummary(assessmentId, gradingData);
    }
    
    
    
    
    
//    For the Time Settings
    
    @GetMapping("/TestConfiguration/TimeSettings")
    public String showTimeSettings(Model model, HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Get assessment details including time settings
        Map<String, Object> assessment = assessmentService.getAssessmentById(assessmentId);
        if (assessment == null || !(Boolean)assessment.get("success")) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Convert duration minutes to HH:MM format
        Integer durationMinutes = (Integer) assessment.get("assessmentDurationMinutes");
        if (durationMinutes != null) {
            int hours = durationMinutes / 60;
            int minutes = durationMinutes % 60;
            assessment.put("duration", String.format("%02d:%02d", hours, minutes));
        }
        
        // Add dates in the format needed by the frontend
        LocalDateTime startDate = assessment.get("startDate") != null ? 
            LocalDateTime.parse(assessment.get("startDate").toString()) : null;
        LocalDateTime endDate = assessment.get("endDate") != null ? 
            LocalDateTime.parse(assessment.get("endDate").toString()) : null;
            
        if (startDate != null) {
            assessment.put("formattedStartDate", formatDateForDisplay(startDate));
            assessment.put("startDateTimestamp", startDate.toInstant(ZoneOffset.UTC).toEpochMilli());
        }
        
        if (endDate != null) {
            assessment.put("formattedEndDate", formatDateForDisplay(endDate));
            assessment.put("endDateTimestamp", endDate.toInstant(ZoneOffset.UTC).toEpochMilli());
        }
        
        model.addAttribute("assessmentId", assessmentId);
        model.addAttribute("assessment", assessment);
        
        return "EducatorConfig/TestConfiguration/TimeSettings";
    }
    

    private String formatDateForDisplay(LocalDateTime dateTime) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        
        return dateTime.format(dateFormatter) + " " + dateTime.format(timeFormatter);
    }

    @PostMapping("/TestConfiguration/SaveTimeSettings")
    @ResponseBody
    public Map<String, Object> saveTimeSettings(
            @RequestBody Map<String, Object> timeSettingsData,
            HttpSession session) {
        
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return Map.of("success", false, "error", "No assessment selected");
        }
        
        return assessmentService.saveTimeSettings(assessmentId, timeSettingsData);
    }

    
    
    
//    For The Test Dashboard
    
    
    @GetMapping("/TestDashboard")
    public String showTestDashboard(Model model) {
        try {
            Map<String, Object> assessmentsResponse = assessmentService.getAllAssessments();
            
            if (assessmentsResponse != null && 
                assessmentsResponse.containsKey("success") && 
                (Boolean)assessmentsResponse.get("success") && 
                assessmentsResponse.containsKey("data")) {
                
                // Convert the data to a List of Maps for easier handling in Thymeleaf
                List<Map<String, Object>> assessments = (List<Map<String, Object>>) assessmentsResponse.get("data");
                
                // For each assessment, ensure module data is properly structured
                for (Map<String, Object> assessment : assessments) {
                    if (assessment.containsKey("moduleId") && assessment.get("moduleId") != null) {
                        // Create a proper module map structure
                        Map<String, Object> module = new HashMap<>();
                        module.put("moduleId", assessment.get("moduleId"));
                        module.put("moduleName", assessment.get("moduleName"));
                        assessment.put("module", module);
                    }
                }
                
                model.addAttribute("assessments", assessments);
            } else {
                model.addAttribute("assessments", Collections.emptyList());
                if (assessmentsResponse != null && assessmentsResponse.containsKey("error")) {
                    model.addAttribute("error", assessmentsResponse.get("error"));
                }
            }
            
            return "EducatorConfig/TestDashboard/TestDashboard";
        } catch (Exception e) {
            model.addAttribute("error", "Failed to load assessments: " + e.getMessage());
            model.addAttribute("assessments", Collections.emptyList());
            return "EducatorConfig/TestDashboard/TestDashboard";
        }
    }
    
    
    
//    For TestInfo Pages
    
    
    
 // Add to EducatorConfigController.java
    @GetMapping("/TestInfo")
    public String showTestInfo(Model model, HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return "redirect:/EducatorConfig/TestConfiguration/BasicSettings";
        }
        
        // Get test info data
        Map<String, Object> testInfo = assessmentService.getTestInfo(assessmentId);
        model.addAttribute("testInfo", testInfo);
        
        return "EducatorConfig/TestConfiguration/TestInfo";
    }

    @PostMapping("/TestInfo/ActivateTest")
    @ResponseBody
    public Map<String, Object> activateTest(HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return Map.of("success", false, "error", "No assessment selected");
        }
        
        return assessmentService.activateAssessment(assessmentId);
    }
    
    
    
    @GetMapping("/TestInfo/GetTestInfo")
    @ResponseBody
    public Map<String, Object> getTestInfo(HttpSession session) {
        Integer assessmentId = (Integer) session.getAttribute("currentAssessmentId");
        if (assessmentId == null) {
            return Map.of("success", false, "error", "No assessment selected");
        }
        
        // Get test info data
        return assessmentService.getTestInfo(assessmentId);
    }
    
    
}