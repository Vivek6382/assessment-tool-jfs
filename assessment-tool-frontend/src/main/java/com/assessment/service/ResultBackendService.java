package com.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.assessment.dto.ResultDTO;

import java.util.*;

@Service
public class ResultBackendService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.base-url}")
    private String baseUrl;

    private final String RESULT_API = "/api/results";

    public List<ResultDTO> getResultsByStudent(Integer studentId) {
        try {
            ResponseEntity<List<ResultDTO>> response = restTemplate.exchange(
                baseUrl + RESULT_API + "/student/" + studentId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ResultDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<ResultDTO> getStudentResultsByModule(Integer studentId, Integer moduleId) {
        try {
            ResponseEntity<List<ResultDTO>> response = restTemplate.exchange(
                baseUrl + RESULT_API + "/student/" + studentId + "/module/" + moduleId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ResultDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // 🔥 NEW: Fetch result by student + assessment for modal details
    public ResultDTO getResultByStudentAndAssessment(Integer studentId, Integer assessmentId) {
        try {
            return restTemplate.getForObject(
                baseUrl + RESULT_API + "/student/" + studentId + "/assessment/" + assessmentId,
                ResultDTO.class
            );
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public List<ResultDTO> getAllResults() {
        try {
            ResponseEntity<List<ResultDTO>> response = restTemplate.exchange(
                baseUrl + RESULT_API + "/all",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ResultDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

}