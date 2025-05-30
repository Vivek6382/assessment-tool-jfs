package com.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class CourseBackendService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.base-url}")
    private String baseUrl;

    private final String COURSE_API = "/api/courses";

    public List<Map<String, Object>> getAllCourses() {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    baseUrl + COURSE_API,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    public List<Map<String, Object>> getCoursesByInstructor(Integer userId) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    baseUrl + COURSE_API + "/educator/" + userId,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    
    public List<Map<String, Object>> getRecentCourses(int limit) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    baseUrl + COURSE_API + "/recent?limit=" + limit,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }


    public String addCourse(Map<String, Object> course) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(course, headers);
            restTemplate.postForEntity(baseUrl + COURSE_API, entity, String.class);
            return "Course added!";
        } catch (Exception e) {
            return "Failed to add course: " + e.getMessage();
        }
    }

    public String updateCourse(Integer id, Map<String, Object> updatedCourse) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(updatedCourse, headers);
            restTemplate.exchange(baseUrl + COURSE_API + "/" + id, HttpMethod.PUT, entity, String.class);
            return "Course updated!";
        } catch (Exception e) {
            return "Failed to update course: " + e.getMessage();
        }
    }
    
 // Add this method to your CourseBackendService class
    public Map<String, Object> getCourseById(Integer id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + COURSE_API + "/" + id, 
                HttpMethod.GET, 
                new HttpEntity<>(headers), 
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
            
            return null;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to get course: " + e.getMessage());
        }
    }
    
    
    public List<Map<String, Object>> getEnrolledCoursesByStudentId(Integer studentId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<List> response = restTemplate.exchange(
                baseUrl + "/api/enrollments/student/" + studentId + "/courses",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                List.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }

            return Collections.emptyList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch enrolled courses: " + e.getMessage());
        }
    }

    
    
 // In your BackendService class
    public String deleteCourse(Integer id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Use exchange instead of delete to handle response properly
            ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + COURSE_API + "/" + id,
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return "Course deleted successfully";
            } else {
                return "Failed to delete course: " + response.getBody();
            }
        } catch (Exception e) {
            return "Failed to delete course: " + e.getMessage();
        }
    }
}
