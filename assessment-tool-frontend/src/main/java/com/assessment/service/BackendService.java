package com.assessment.service;

import com.assessment.model.*;
import com.assessment.model.Module;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BackendService {
    
    private final RestTemplate restTemplate;
    
    @Value("${api.base-url}")
    private String apiBaseUrl;
    
    @Autowired
    public BackendService() {
        // Initialize RestTemplate with proper message converters
        this.restTemplate = new RestTemplate();
        
        // Configure RestTemplate to handle Java 8 date/time types
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        org.springframework.http.converter.json.MappingJackson2HttpMessageConverter converter = 
            new org.springframework.http.converter.json.MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);
        
        // Replace the default converter with our custom configured one
        this.restTemplate.getMessageConverters().removeIf(
            c -> c instanceof org.springframework.http.converter.json.MappingJackson2HttpMessageConverter);
        this.restTemplate.getMessageConverters().add(converter);
        
        System.out.println("RestTemplate configured with custom Jackson message converter for handling date/time types");
    }
    
    // User methods
    public User getUserById(Integer userId) {
        String url = apiBaseUrl + "/api/users/" + userId;
        return restTemplate.getForObject(url, User.class);
    }
    
    // Course methods
    public List<Course> getStudentCourses(Integer studentId) {
        String url = apiBaseUrl + "/api/courses/student/" + studentId;
        ResponseEntity<List<Course>> response = restTemplate.exchange(
            url, 
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<Course>>() {}
        );
        return response.getBody();
    }
    
    // Module methods
    public List<Module> getModulesByCourseId(Integer courseId) {
        String url = apiBaseUrl + "/api/modules/course/" + courseId;
        ResponseEntity<List<Module>> response = restTemplate.exchange(
            url, 
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<Module>>() {}
        );
        return response.getBody();
    }
    
    // Assessment methods
    public List<Assessment> getAssessmentsByModuleId(Integer moduleId) {
        String url = apiBaseUrl + "/api/assessments/module/" + moduleId;
        ResponseEntity<List<Assessment>> response = restTemplate.exchange(
            url, 
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<Assessment>>() {}
        );
        return response.getBody();
    }
    
    public Assessment getAssessmentById(Integer assessmentId) {
        String url = apiBaseUrl + "/api/assessments/" + assessmentId;
        return restTemplate.getForObject(url, Assessment.class);
    }
    
 // Update the BackendService.java with this method
    public List<QuestionWithOptions> getQuestionsWithOptionsByAssessmentId(Integer assessmentId) {
        String url = apiBaseUrl + "/api/questions/assessment/" + assessmentId;
        try {
            ResponseEntity<List<QuestionWithOptions>> response = restTemplate.exchange(
                url, 
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<QuestionWithOptions>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error fetching questions with options: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    // Response methods
    public void saveResponse(Map<String, Object> response) {
        String url = apiBaseUrl + "/api/responses";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(response, headers);
            
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            System.out.println("Response saved: " + responseEntity.getStatusCode());
        } catch (Exception e) {
            System.err.println("Error saving response: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void saveTextResponse(Map<String, Object> textResponse) {
        String url = apiBaseUrl + "/api/responses/text";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(textResponse, headers);
            
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            System.out.println("Text response saved: " + responseEntity.getStatusCode());
        } catch (Exception e) {
            System.err.println("Error saving text response: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Result methods
    public Result getResultByStudentAndAssessment(Integer studentId, Integer assessmentId) {
        String url = apiBaseUrl + "/api/results/student/" + studentId + "/assessment/" + assessmentId;
        try {
            return restTemplate.getForObject(url, Result.class);
        } catch (HttpClientErrorException.NotFound ex) {
            // Assessment not found or student hasn't taken it yet - return null instead of throwing exception
            System.out.println("No result found for student " + studentId + " and assessment " + assessmentId);
            return null;
        } catch (Exception e) {
            System.err.println("Error fetching result: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    public List<QuestionResponse> getQuestionsWithResponsesByStudentAndAssessment(Integer studentId, Integer assessmentId) {
        String url = apiBaseUrl + "/api/question-responses/student/" + studentId + "/assessment/" + assessmentId;
        ResponseEntity<List<QuestionResponse>> response = restTemplate.exchange(
            url, 
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<QuestionResponse>>() {}
        );
        return response.getBody();
    }
    
    public List<Result> getResultsByStudentId(Integer studentId) {
        String url = apiBaseUrl + "/api/results/student/" + studentId;
        ResponseEntity<List<Result>> response = restTemplate.exchange(
            url, 
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<Result>>() {}
        );
        return response.getBody();
    }
    
    public List<Result> getStudentResultsByModule(Integer studentId, Integer moduleId) {
        String url = apiBaseUrl + "/api/results/student/" + studentId + "/module/" + moduleId;
        try {
            ResponseEntity<List<Result>> response = restTemplate.exchange(
                url, 
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Result>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error fetching student results by module: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
 // Add these methods to BackendService.java
}
   
  