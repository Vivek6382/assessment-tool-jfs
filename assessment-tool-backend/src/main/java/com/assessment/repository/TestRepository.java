package com.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assessment.model.TestEntity;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, Long> {
    // Spring Data JPA provides default implementations for standard CRUD operations
    // No need to write custom methods for basic operations
}