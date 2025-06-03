package com.assessment.controller;

import com.assessment.model.Response;
import com.assessment.model.User;
import com.assessment.service.ResponseService;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "*")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8"})
    public ResponseEntity<Response> saveResponse(@RequestBody Response response) {
        try {
            Response savedResponse = responseService.saveResponse(response);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping(path = "/text", consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8"})
    public ResponseEntity<Response> saveTextResponse(@RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("Received text response data: " + requestData);
            Integer studentId = Integer.valueOf(requestData.get("studentId").toString());
            Integer questionId = Integer.valueOf(requestData.get("questionId").toString());
            String responseText = (String) requestData.get("responseText");
            
            Response savedResponse = responseService.saveTextResponse(studentId, questionId, responseText);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}