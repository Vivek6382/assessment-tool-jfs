package com.assessment.service;

import com.assessment.dto.AdminDTO;
import com.assessment.dto.AdminProfileUpdateDTO;
import com.assessment.dto.DashboardStatsDTO;
import com.assessment.dto.EducatorDTO;
import com.assessment.dto.EducatorProfileDTO;
import com.assessment.dto.EducatorRegistrationDTO;
import com.assessment.dto.EducatorRegistrationRequest;
import com.assessment.dto.EducatorUpdateDTO;
import com.assessment.dto.StudentProfileDTO;
import com.assessment.dto.StudentProfileUpdateDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${api.base-url}")
    private String apiBaseUrl;
    
    // Get all educators
    public List<EducatorDTO> getAllEducators() {
        try {
            ResponseEntity<List<EducatorDTO>> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<EducatorDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    // Get active educators
    public List<EducatorDTO> getActiveEducators() {
        try {
            ResponseEntity<List<EducatorDTO>> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/active",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<EducatorDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
 // Get active students
    public List<StudentProfileDTO> getActiveStudents() {
        try {
            ResponseEntity<List<StudentProfileDTO>> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/activeStudents",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<StudentProfileDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    // Get inactive educators
    public List<EducatorDTO> getInactiveEducators() {
        try {
            ResponseEntity<List<EducatorDTO>> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/inactive",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<EducatorDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
 // Get inactive students
    public List<StudentProfileDTO> getInactiveStudents() {
        try {
            ResponseEntity<List<StudentProfileDTO>> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/inactiveStudents",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<StudentProfileDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    // Get educator by ID
    public EducatorProfileDTO getEducatorById(Integer id) {
    	try {
            ResponseEntity<EducatorProfileDTO> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/" + id,
                    HttpMethod.GET,
                    null,
                    EducatorProfileDTO.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to fetch educator: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching educator data", e);
        }
    }
    
    // Get dashboard statistics
    public DashboardStatsDTO getDashboardStats() {
        try {
            ResponseEntity<DashboardStatsDTO> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/dashboard-stats",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<DashboardStatsDTO>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new DashboardStatsDTO(0L, 0L, 0L, 0L);
        }
    }
    
    // Activate educators
    public void activateEducators(List<Integer> educatorIds) {
        try {
            restTemplate.postForEntity(
                    apiBaseUrl + "/api/educators/activate",
                    educatorIds,
                    Void.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error activating educators: " + e.getMessage());
        }
    }
    
    // Deactivate educators
    public void deactivateEducators(List<Integer> educatorIds) {
        try {
            restTemplate.postForEntity(
                    apiBaseUrl + "/api/educators/deactivate",
                    educatorIds,
                    Void.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error deactivating educators: " + e.getMessage());
        }
    }
    
 // Activate students
    public void activateStudents(List<Integer> studentIds) {
        try {
            restTemplate.postForEntity(
                    apiBaseUrl + "/api/educators/activateStudents",
                    studentIds,
                    Void.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error activating students: " + e.getMessage());
        }
    }
    
 // Deactivate students
    public void deactivateStudents(List<Integer> studentIds) {
        try {
            restTemplate.postForEntity(
                    apiBaseUrl + "/api/educators/deactivateStudents",
                    studentIds,
                    Void.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error deactivating students: " + e.getMessage());
        }
    }
    
    public Map<String, Object> registerEducators(EducatorRegistrationRequest request) {
        try {
        	List<EducatorRegistrationDTO> educators = request.getEducators();
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/register-multiple",
                    HttpMethod.POST,
                    new HttpEntity<>(educators),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage());
        }
    }
    
    public AdminDTO getAdminById(Integer adminId) {
        try {
            ResponseEntity<AdminDTO> response = restTemplate.exchange(
                    apiBaseUrl + "/api/admin/" + adminId,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<AdminDTO>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Get admin by username
     */
    public AdminDTO getAdminByUsername(String username) {
        try {
            ResponseEntity<AdminDTO> response = restTemplate.exchange(
                    apiBaseUrl + "/api/admin/username/" + username,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<AdminDTO>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Update admin profile
     */
    public Map<String, Object> updateAdminProfile(AdminProfileUpdateDTO updateDTO) {
        try {
            ResponseEntity<AdminDTO> response = restTemplate.exchange(
                    apiBaseUrl + "/api/admin/update-profile",
                    HttpMethod.PUT,
                    new HttpEntity<>(updateDTO),
                    new ParameterizedTypeReference<AdminDTO>() {}
            );
            
            // Return success response
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("admin", response.getBody());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            // Return error response
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return result;
        }
    }
    
    public Map<String, Object> updateEducatorProfile(EducatorUpdateDTO updateDTO) {
        try {
            ResponseEntity<EducatorProfileDTO> response = restTemplate.exchange(
                    apiBaseUrl + "/api/educators/update-profile",
                    HttpMethod.PUT,
                    new HttpEntity<>(updateDTO),
                    new ParameterizedTypeReference<EducatorProfileDTO>() {}
            );
            
            // Return success response
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("educator", response.getBody());
            return result;
        } catch (HttpClientErrorException e) {
            // Handle 4xx errors specifically
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getResponseBodyAsString());
            return result;
        } catch (Exception e) {
            // Handle other errors
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return result;
        }
    }
    
    public Map<String, Object> updateStudent(StudentProfileUpdateDTO updateDTO) {
        try {
            ResponseEntity<StudentProfileDTO> response = restTemplate.exchange(
                apiBaseUrl + "/api/educators/update-student-profile",
                HttpMethod.PUT,
                new HttpEntity<>(updateDTO),
                new ParameterizedTypeReference<StudentProfileDTO>() {}
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("student", response.getBody());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return result;
        }
    }
    
    // Dashboard methods
}