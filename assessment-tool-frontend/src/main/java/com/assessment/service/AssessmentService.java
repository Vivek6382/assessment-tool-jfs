package com.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AssessmentService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${api.base-url}")
    private String apiBaseUrl;
    
    /**
     * Get all assessments
     */
    public Map<String, Object> getAllAssessments() {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving assessments: " + e.getMessage());
            return errorMap;
        }
    }
    
    /**
     * Get assessment by ID
     */
 // In AssessmentService.java (frontend) - update getAssessmentById method
    public Map<String, Object> getAssessmentById(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            Map<String, Object> result = response.getBody();
            if (result != null && result.containsKey("success") && (Boolean)result.get("success")) {
                // Ensure all fields are present with defaults if null
                result.putIfAbsent("instructionText", "");
                result.putIfAbsent("hasInstructionTime", false);
                result.putIfAbsent("instructionTimeSeconds", 0);
                result.putIfAbsent("assessmentDurationMinutes", 60); // Default 1 hour
                result.putIfAbsent("startDate", null);
                result.putIfAbsent("endDate", null);
                
                // Parse dates if they exist
                if (result.get("startDate") != null && result.get("startDate") instanceof String) {
                    result.put("startDate", LocalDateTime.parse((String)result.get("startDate")));
                }
                if (result.get("endDate") != null && result.get("endDate") instanceof String) {
                    result.put("endDate", LocalDateTime.parse((String)result.get("endDate")));
                }
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving assessment: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    /**
     * Create a new assessment
     */
    public Map<String, Object> createAssessment(Map<String, Object> assessmentData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(assessmentData, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error creating assessment: " + e.getMessage());
            return errorMap;
        }
    }
    
    /**
     * Update an existing assessment
     */
    public Map<String, Object> updateAssessment(Integer assessmentId, Map<String, Object> assessmentData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(assessmentData, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId,
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error updating assessment: " + e.getMessage());
            return errorMap;
        }
    }
    
    /**
     * Delete an assessment
     */
    public Map<String, Object> deleteAssessment(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId,
                HttpMethod.DELETE,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error deleting assessment: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    public Map<String, Object> getQuestionsByAssessmentId(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/questions/by-assessment/" + assessmentId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                return Map.of("success", false, "error", "Empty response from server");
            }
            
            return responseBody;
        } catch (Exception e) {
            return Map.of("success", false, "error", "Error retrieving questions: " + e.getMessage());
        }
    }
    
    
//    For modules
    
    // Changed all module-related method names and endpoints
    public Map<String, Object> getAllAssessmentModules() {  // Changed method name
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessment-modules",  // Changed endpoint
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving modules: " + e.getMessage());
            return errorMap;
        }
    }
    
    public Map<String, Object> getAssessmentModuleById(Integer moduleId) {  // Changed method name
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessment-modules/" + moduleId,  // Changed endpoint
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving module: " + e.getMessage());
            return errorMap;
        }
    }
    
    public Map<String, Object> createAssessmentModule(Map<String, Object> moduleData) {  // Changed method name
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(moduleData, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessment-modules",  // Changed endpoint
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error creating module: " + e.getMessage());
            return errorMap;
        }
    }
    
    public Map<String, Object> updateAssessmentModule(Integer moduleId, Map<String, Object> moduleData) {  // Changed method name
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(moduleData, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessment-modules/" + moduleId,  // Changed endpoint
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error updating module: " + e.getMessage());
            return errorMap;
        }
    }

    
    
    
    
    
//    For Question Manager
    
    
    /**
     * Get question by ID
     */
    public Map<String, Object> getQuestionById(Integer questionId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/questions/" + questionId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            // Debug print - remove after testing
            System.out.println("API Response: " + response.getBody());
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new RuntimeException("API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch question: " + e.getMessage());
            return errorResponse;
        }
    }
    
    

    /** 
     * Create a new question 
     */ 
    public Map<String, Object> createQuestion(Map<String, Object> questionData) { 
        try { 
            HttpHeaders headers = new HttpHeaders(); 
            headers.setContentType(MediaType.APPLICATION_JSON); 
             
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(questionData, headers); 
             
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange( 
                apiBaseUrl + "/api/questions", 
                HttpMethod.POST, 
                requestEntity, 
                new ParameterizedTypeReference<Map<String, Object>>() {} 
            ); 
            return response.getBody(); 
        } catch (HttpClientErrorException | HttpServerErrorException e) { 
            e.printStackTrace(); 
            try { 
                // Try to parse error response 
                Map<String, Object> errorMap = new ObjectMapper().readValue(e.getResponseBodyAsString(), Map.class); 
                return errorMap; 
            } catch (IOException ex) {
                Map<String, Object> errorMap = new HashMap<>(); 
                errorMap.put("success", false); 
                errorMap.put("error", "Error creating question: " + e.getMessage()); 
                return errorMap; 
            } 
        } catch (Exception e) { 
            e.printStackTrace(); 
            Map<String, Object> errorMap = new HashMap<>(); 
            errorMap.put("success", false); 
            errorMap.put("error", "Error creating question: " + e.getMessage()); 
            return errorMap; 
        } 
    }
    
    

    /**
     * Update an existing question - EXACT VERSION THAT WILL WORK
     */
    public Map<String, Object> updateQuestion(Integer questionId, Map<String, Object> questionData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // 1. Extract the exact fields your backend expects
            Map<String, Object> backendPayload = new HashMap<>();
            backendPayload.put("questionText", questionData.get("questionText"));
            backendPayload.put("questionTypeId", questionData.get("questionTypeId"));
            backendPayload.put("questionMarks", questionData.get("questionMarks"));
            backendPayload.put("requiresManualGrading", questionData.get("requiresManualGrading"));
            backendPayload.put("maxWordCount", questionData.get("maxWordCount"));
            backendPayload.put("options", questionData.get("options"));
            backendPayload.put("saveAndAddNext", false); // Always false for updates
            
            // 2. If assessmentId exists in the incoming data, add it
            if (questionData.containsKey("assessmentId")) {
                backendPayload.put("assessmentId", questionData.get("assessmentId"));
            }
            
            // 3. Make the request with the properly formatted payload
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(backendPayload, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/questions/" + questionId,
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // Handle 4xx errors
            try {
                return new ObjectMapper().readValue(e.getResponseBodyAsString(), Map.class);
            } catch (IOException ex) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Failed to parse error response: " + e.getMessage());
                return error;
            }
        } catch (HttpServerErrorException e) {
            // Handle 5xx errors
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Server error: " + e.getStatusCode().toString());
            return error;
        } catch (Exception e) {
            // Handle other errors
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Unexpected error: " + e.getMessage());
            return error;
        }
    }
    
    
    /**
     * Get question types - updated to use the proper endpoint
     */
    public Map<String, Object> getQuestionTypes() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/questions/types",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error getting question types: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    
    /**
     * Get all questions
     */
    public Map<String, Object> getAllQuestions() {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/questions",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return response.getBody();
        } catch (Exception e) {
            return Map.of("success", false, "error", "Error retrieving questions: " + e.getMessage());
        }
    }
    
    
    
    
    // For Test Sets
    
    
    public Map<String, Object> updateQuestionOrder(Integer assessmentId, String questionOrder) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("questionOrder", questionOrder);
            
            // Use POST instead of PATCH to avoid issues
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/question-order",
                HttpMethod.POST,
                new HttpEntity<>(requestBody, headers),
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return response.getBody();
        } catch (HttpClientErrorException e) {
            try {
                return new ObjectMapper().readValue(e.getResponseBodyAsString(), Map.class);
            } catch (IOException ex) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Failed to parse error response: " + e.getMessage());
                return error;
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error updating question order: " + e.getMessage());
            return error;
        }
    }
    
    
    
//    For the test start page
    
    
    public Map<String, Object> saveTestStartSettings(Integer assessmentId, 
            Map<String, Object> settingsData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = 
                new HttpEntity<>(settingsData, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/test-start-settings",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error saving test start settings: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    
//    For the grading and summary
    
    
    public Map<String, Object> getGradingSummary(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/grading-summary",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving grading summary: " + e.getMessage());
            return errorMap;
        }
    }

    public Map<String, Object> saveGradingSummary(Integer assessmentId, Map<String, Object> gradingData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(gradingData, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/grading-summary",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error saving grading summary: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    
    

//  For the Time Settings
    
    
    public Map<String, Object> getTimeSettingsData(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/EducatorConfig/TestConfiguration/TimeSettingsData",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving time settings: " + e.getMessage());
            return errorMap;
        }
    }
    
  
    public Map<String, Object> saveTimeSettings(Integer assessmentId, Map<String, Object> timeSettings) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(timeSettings, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/time-settings",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error saving time settings: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    
//    For Test Dashboard - nothing
    
    
//  For TestInfo Pages
    
    
 // Add to AssessmentService.java
    public Map<String, Object> getTestInfo(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/test-info",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error retrieving test info: " + e.getMessage());
            return errorMap;
        }
    }
    

    public Map<String, Object> activateAssessment(Integer assessmentId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiBaseUrl + "/api/assessments/" + assessmentId + "/activate",
                HttpMethod.POST,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("success", false);
            errorMap.put("error", "Error activating assessment: " + e.getMessage());
            return errorMap;
        }
    }
    
    
    
    
//    For Session
    
    
    
}