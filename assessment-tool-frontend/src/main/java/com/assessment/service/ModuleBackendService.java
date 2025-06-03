package com.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
//import java.util.stream.Collectors;

@Service
public class ModuleBackendService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.base-url}")
    private String baseUrl;

    private static final String MODULE_API = "/api/modules";

    public List<Map<String, Object>> getModulesByCourse(Integer courseId) {
        try {
            // Add courseId as request parameter
            String url = baseUrl + MODULE_API + "?courseId=" + courseId;
            
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            return response.getBody() != null ? response.getBody() : List.of();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
