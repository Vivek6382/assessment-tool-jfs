package com.assessment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assessment.model.TestEntity;
import com.assessment.service.TestService;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private TestService testService;
    
    @GetMapping
    public ResponseEntity<List<TestEntity>> getAllTestMessages() {
        return ResponseEntity.ok(testService.getAllTestMessages());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TestEntity> getTestMessageById(@PathVariable Long id) {
        TestEntity testEntity = testService.getTestMessageById(id);
        if (testEntity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(testEntity);
    }
    
    @GetMapping("/default")
    public ResponseEntity<TestEntity> createDefaultMessage() {
        return ResponseEntity.ok(testService.createDefaultTestMessage());
    }
    
    @PostMapping
    public ResponseEntity<TestEntity> createTestMessage(@RequestBody TestEntity testEntity) {
        return ResponseEntity.ok(testService.saveTestMessage(testEntity));
    }
}