package com.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class UserBackendService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.base-url}")
    private String baseUrl;

    private final String USER_API = "/api/users";

    /**
     * Get user information by user ID
     * @param userId The ID of the user to retrieve
     * @return Map containing user information or null if not found
     */
    public Map<String, Object> getUserById(Integer userId) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                baseUrl + USER_API + "/" + userId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public List<Map<String, Object>> getUsersByRole(Integer roleId) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                baseUrl + USER_API + "/role/" + roleId,
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

    /**
     * Update user information
     * @param userId The ID of the user to update
     * @param userData Map containing updated user data
     * @return boolean indicating success or failure
     */
    public boolean updateUser(Integer userId, Map<String, Object> userData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(userData, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + USER_API + "/" + userId,
                HttpMethod.PUT,
                request,
                String.class
            );
            
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Get all users - admin functionality
     * @return List of all users or empty list if error
     */
    public List<Map<String, Object>> getAllUsers() {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                baseUrl + USER_API,
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
    
    /**
     * Add new user
     * @param userData Map containing user data
     * @return boolean indicating success or failure
     */
    public boolean addUser(Map<String, Object> userData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(userData, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + USER_API,
                HttpMethod.POST,
                request,
                String.class
            );
            
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean changePassword(String email, String currentPassword, String newPassword) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("email", email);
            requestBody.put("currentPassword", currentPassword);
            requestBody.put("newPassword", newPassword);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + USER_API + "/change-password",
                HttpMethod.POST,
                request,
                String.class
            );
            
            return response.getStatusCode().is2xxSuccessful();
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}