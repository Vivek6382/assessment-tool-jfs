package com.assessment.controller;

import com.assessment.dto.AssessmentDTO;
import com.assessment.model.Assessment;
import com.assessment.model.Module;
import com.assessment.model.Question;
import com.assessment.service.AssessmentService;
import com.assessment.service.ModuleService;
import com.assessment.service.QuestionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private ModuleService moduleService;
    
    
    @Autowired
    private QuestionService questionService;
    
    /**
     * Get all assessments
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAssessments() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Assessment> assessments = assessmentService.getAllAssessments();
            response.put("success", true);
            response.put("data", assessments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving assessments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get assessment by ID
     */
 // In AssessmentController.java, update the getAssessmentById method:
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAssessmentById(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Assessment> assessment = assessmentService.getAssessmentById(id);
            if (assessment.isPresent()) {
                Assessment a = assessment.get();
                response.put("success", true);
                response.put("assessmentId", a.getAssessmentId());
                response.put("assessmentTitle", a.getAssessmentTitle());
                response.put("assessmentDescription", a.getAssessmentDescription());
                response.put("questionOrder", a.getQuestionOrder());
                response.put("assessmentStatus", a.getAssessmentStatus()); // Add this line
                
                // Add test start settings
                response.put("instructionText", a.getInstructionText() != null ? a.getInstructionText() : "");
                response.put("hasInstructionTime", a.getHasInstructionTime() != null ? a.getHasInstructionTime() : false);
                response.put("instructionTimeSeconds", a.getInstructionTimeSeconds() != null ? a.getInstructionTimeSeconds() : 0);
                
                // Add time settings
                response.put("assessmentDurationMinutes", a.getAssessmentDurationMinutes());
                response.put("startDate", a.getStartDate());
                response.put("endDate", a.getEndDate());
                
                if (a.getModule() != null) {
                    response.put("moduleId", a.getModule().getModuleId());
                    response.put("moduleName", a.getModule().getModuleName());
                } else {
                    response.put("moduleId", null);
                    response.put("moduleName", null);
                }
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Assessment not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Create a new assessment
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAssessment(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract data from request
            String assessmentTitle = (String) requestData.get("assessmentTitle");
            String assessmentDescription = (String) requestData.get("assessmentDescription");
            Integer moduleId = null;
            
            if (requestData.get("moduleId") != null) {
                if (requestData.get("moduleId") instanceof Integer) {
                    moduleId = (Integer) requestData.get("moduleId");
                } else if (requestData.get("moduleId") instanceof String) {
                    try {
                        moduleId = Integer.parseInt((String) requestData.get("moduleId"));
                    } catch (NumberFormatException e) {
                        // Handle case where moduleId is not a valid integer
                        moduleId = null;
                    }
                }
            }
            
            // Create assessment object
            Assessment assessment = new Assessment();
            assessment.setAssessmentTitle(assessmentTitle);
            assessment.setAssessmentDescription(assessmentDescription);
            assessment.setCreatedAt(LocalDateTime.now()); // Set creation time
            assessment.setAssessmentStatus("draft"); // Default status
            
            // Set module if valid moduleId is provided
            if (moduleId != null) {
            	Optional<Module> moduleOpt = moduleService.getAssessmentModuleById(moduleId);  // Changed method call
                if (moduleOpt.isPresent()) {
                    assessment.setModule(moduleOpt.get());
                }
            }
            
            // Save assessment
            Assessment savedAssessment = assessmentService.saveAssessment(assessment);
            
            // Build response
            response.put("success", true);
            response.put("message", "Assessment created successfully");
            response.put("assessmentId", savedAssessment.getAssessmentId());
            response.put("assessmentTitle", savedAssessment.getAssessmentTitle());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error creating assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Update an existing assessment
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAssessment(
            @PathVariable Integer id, 
            @RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check if assessment exists
            Optional<Assessment> existingAssessment = assessmentService.getAssessmentById(id);
            if (!existingAssessment.isPresent()) {
                response.put("success", false);
                response.put("error", "Assessment not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Assessment assessment = existingAssessment.get();
            
            // Update assessment data
            if (requestData.containsKey("assessmentTitle")) {
                assessment.setAssessmentTitle((String) requestData.get("assessmentTitle"));
            }
            
            if (requestData.containsKey("assessmentDescription")) {
                assessment.setAssessmentDescription((String) requestData.get("assessmentDescription"));
            }
            
            // Update module if moduleId is provided
            if (requestData.containsKey("moduleId") && requestData.get("moduleId") != null) {
                Integer moduleId = null;
                
                if (requestData.get("moduleId") instanceof Integer) {
                    moduleId = (Integer) requestData.get("moduleId");
                } else if (requestData.get("moduleId") instanceof String) {
                    try {
                        moduleId = Integer.parseInt((String) requestData.get("moduleId"));
                    } catch (NumberFormatException e) {
                        // Handle case where moduleId is not a valid integer
                        moduleId = null;
                    }
                }
                
                if (moduleId != null) {
                	Optional<Module> moduleOpt = moduleService.getAssessmentModuleById(moduleId);  // Changed method call
                    if (moduleOpt.isPresent()) {
                        assessment.setModule(moduleOpt.get());
                    }
                } else {
                    assessment.setModule(null);
                }
            }
            
            // Update other fields if provided
            if (requestData.containsKey("assessmentType")) {
                assessment.setAssessmentType((String) requestData.get("assessmentType"));
            }
            
            if (requestData.containsKey("assessmentStatus")) {
                assessment.setAssessmentStatus((String) requestData.get("assessmentStatus"));
            }
            
            // Save updated assessment
            Assessment updatedAssessment = assessmentService.saveAssessment(assessment);
            
            // Build response
            response.put("success", true);
            response.put("message", "Assessment updated successfully");
            response.put("assessmentId", updatedAssessment.getAssessmentId());
            response.put("assessmentTitle", updatedAssessment.getAssessmentTitle());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error updating assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Delete an assessment
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAssessment(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check if assessment exists
            Optional<Assessment> existingAssessment = assessmentService.getAssessmentById(id);
            if (!existingAssessment.isPresent()) {
                response.put("success", false);
                response.put("error", "Assessment not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Delete assessment
            assessmentService.deleteAssessment(id);
            
            // Build response
            response.put("success", true);
            response.put("message", "Assessment deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error deleting assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    
    // For Test Set 
    
    @PostMapping("/{id}/question-order")  // Changed from @PatchMapping to @PostMapping
    public ResponseEntity<Map<String, Object>> updateQuestionOrder(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String questionOrder = request.get("questionOrder");
            
            if (questionOrder == null || !(questionOrder.equals("FIXED") || 
                questionOrder.equals("RANDOM") || questionOrder.equals("DIFFICULTY"))) {
                response.put("success", false);
                response.put("error", "Invalid question order value. Must be FIXED, RANDOM or DIFFICULTY");
                return ResponseEntity.badRequest().body(response);
            }
            
            Assessment updatedAssessment = assessmentService.updateQuestionOrder(id, questionOrder);
            
            response.put("success", true);
            response.put("message", "Question order updated successfully");
            response.put("questionOrder", updatedAssessment.getQuestionOrder());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error updating question order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    
    
//    For Test Start Page
    
    
    
    @PostMapping("/{id}/test-start-settings")
    public ResponseEntity<Map<String, Object>> saveTestStartSettings(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> settingsData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract data from request
            String instructionText = (String) settingsData.get("instructionText");
            Boolean hasInstructionTime = (Boolean) settingsData.get("hasInstructionTime");
            Integer instructionTimeSeconds = (Integer) settingsData.get("instructionTimeSeconds");
            
            // Call service to update
            Assessment updatedAssessment = assessmentService.updateTestStartSettings(
                id, instructionText, hasInstructionTime, instructionTimeSeconds);
            
            response.put("success", true);
            response.put("message", "Test start settings saved successfully");
            response.put("assessmentId", updatedAssessment.getAssessmentId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error saving test start settings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    
    
//    For Grading and Summary
    
    
 // AssessmentController.java - Add these methods

 // Add these methods to your existing AssessmentController

    @GetMapping("/{id}/grading-summary")
    public ResponseEntity<Map<String, Object>> getGradingSummary(@PathVariable Integer id) {
        Map<String, Object> serviceResponse = assessmentService.getGradingSummary(id);
        
        if (serviceResponse.containsKey("success") && (boolean) serviceResponse.get("success")) {
            return ResponseEntity.ok(serviceResponse);
        } else {
            HttpStatus status = serviceResponse.get("error").toString().contains("not found") 
                ? HttpStatus.NOT_FOUND 
                : HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status).body(serviceResponse);
        }
    }
    

    @PostMapping("/{id}/grading-summary")
    public ResponseEntity<Map<String, Object>> saveGradingSummary(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> gradingData) {
        
        Integer passingScore;
        String unit;
        
        try {
            // Handle integer values only
            if (gradingData.get("passingScore") instanceof Double) {
                // Reject decimal values
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Decimal values are not allowed. Please enter whole numbers only.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            passingScore = (Integer) gradingData.get("passingScore");
            unit = (String) gradingData.get("unit");
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Invalid request format. Please provide passingScore as integer and unit as string.");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> serviceResponse = assessmentService.saveGradingSummary(id, passingScore, unit);
        
        if (serviceResponse.containsKey("success") && (boolean) serviceResponse.get("success")) {
            return ResponseEntity.ok(serviceResponse);
        } else {
            HttpStatus status = serviceResponse.get("error").toString().contains("not found") 
                ? HttpStatus.NOT_FOUND 
                : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(serviceResponse);
        }
    }
    
    
    


//  For Time Settings
    
    
    @PostMapping("/{id}/time-settings")
    public ResponseEntity<Map<String, Object>> saveTimeSettings(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> timeSettings) {
        
        try {
            // Parse time settings
            String duration = (String) timeSettings.get("duration");
            LocalDateTime startDate = LocalDateTime.parse((String) timeSettings.get("startDate"));
            LocalDateTime endDate = LocalDateTime.parse((String) timeSettings.get("endDate"));
            
            // Call service to save time settings
            Map<String, Object> serviceResponse = assessmentService.saveTimeSettings(
                id, duration, startDate, endDate);
            
            return ResponseEntity.status(serviceResponse.containsKey("error") ? 
                                      HttpStatus.BAD_REQUEST : HttpStatus.OK)
                              .body(serviceResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Invalid request format: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    
    
    
    // For The Test Info page 
    
    
 // Add to AssessmentController.java
    @GetMapping("/{id}/test-info")
    public ResponseEntity<Map<String, Object>> getTestInfo(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Assessment> assessmentOpt = assessmentService.getAssessmentById(id);
            if (!assessmentOpt.isPresent()) {
                response.put("success", false);
                response.put("error", "Assessment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Assessment assessment = assessmentOpt.get();
            
            // Create assessment data map with all fields
            Map<String, Object> assessmentData = new HashMap<>();
            assessmentData.put("assessmentId", assessment.getAssessmentId());
            assessmentData.put("assessmentTitle", assessment.getAssessmentTitle());
            assessmentData.put("assessmentDescription", assessment.getAssessmentDescription());
            assessmentData.put("createdAt", assessment.getCreatedAt());
            assessmentData.put("assessmentType", assessment.getAssessmentType());
            assessmentData.put("assessmentStatus", assessment.getAssessmentStatus());
            assessmentData.put("questionOrder", assessment.getQuestionOrder());
            assessmentData.put("instructionText", assessment.getInstructionText());
            assessmentData.put("instructionTimeSeconds", assessment.getInstructionTimeSeconds());
            assessmentData.put("hasInstructionTime", assessment.getHasInstructionTime());
            assessmentData.put("assessmentTotalMarks", assessment.getAssessmentTotalMarks());
            assessmentData.put("assessmentPassingScore", assessment.getAssessmentPassingScore());
            assessmentData.put("passingScoreUnit", assessment.getPassingScoreUnit());
            assessmentData.put("startDate", assessment.getStartDate());
            assessmentData.put("endDate", assessment.getEndDate());
            assessmentData.put("assessmentDurationMinutes", assessment.getAssessmentDurationMinutes());
            
            // Handle module safely
            if (assessment.getModule() != null) {
                Map<String, Object> moduleData = new HashMap<>();
                moduleData.put("moduleId", assessment.getModule().getModuleId());
                moduleData.put("moduleName", assessment.getModule().getModuleName());
                assessmentData.put("module", moduleData);
            } else {
                assessmentData.put("module", null);
            }
            
            // Handle creator safely
            if (assessment.getCreator() != null) {
                Map<String, Object> creatorData = new HashMap<>();
                creatorData.put("userId", assessment.getCreator().getUserId());
                assessmentData.put("creator", creatorData);
            } else {
                assessmentData.put("creator", null);
            }
            
            // Get additional data
            int questionCount = assessmentService.getQuestionCountByAssessmentId(id);
            Integer totalMarks = assessmentService.calculateTotalMarksByAssessmentId(id);
            
            // Build response
            response.put("success", true);
            response.put("assessment", assessmentData);
            response.put("questionCount", questionCount);
            response.put("calculatedTotalMarks", totalMarks);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving test info: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activateAssessment(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean activated = assessmentService.activateAssessment(id);
            if (activated) {
                response.put("success", true);
                response.put("message", "Assessment activated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Failed to activate assessment");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error activating assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    
    //Syed Anees 
    
    @PutMapping("/deactivate/{id}")
	public ResponseEntity<String> deactivateAssessment(@PathVariable Integer id) {
	    try {
	        assessmentService.markAssessmentInactive(id);
	        return ResponseEntity.ok("Assessment status updated to inactive");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Failed to deactivate assessment: " + e.getMessage());
	    }
	}
    
    
    // Shreeni Vasu
    
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<AssessmentDTO>> getAssessmentsByModuleId(@PathVariable Integer moduleId) {
        try {
            List<AssessmentDTO> assessments = assessmentService.getAssessmentsByModuleIdAsDTO(moduleId);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
}