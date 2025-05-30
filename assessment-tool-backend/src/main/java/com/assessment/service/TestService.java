package com.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assessment.model.TestEntity;
import com.assessment.repository.TestRepository;

@Service
@Transactional
public class TestService {
    
    @Autowired
    private TestRepository testRepository;
    
    public TestEntity saveTestMessage(TestEntity testEntity) {
        return testRepository.save(testEntity);
    }
    
    public List<TestEntity> getAllTestMessages() {
        return testRepository.findAll();
    }
    
    public TestEntity getTestMessageById(Long id) {
        return testRepository.findById(id).orElse(null);
    }
    
    public TestEntity createDefaultTestMessage() {
        TestEntity testEntity = new TestEntity();
        testEntity.setMessage("Hello from Backend!");
        return testRepository.save(testEntity);
    }
}