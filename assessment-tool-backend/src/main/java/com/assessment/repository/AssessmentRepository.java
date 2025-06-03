package com.assessment.repository;

import com.assessment.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
    
	@Query("SELECT a FROM Assessment a WHERE a.module.moduleId = :moduleId")
    List<Assessment> findByModuleModuleId(@Param("moduleId") Integer moduleId);
    
    List<Assessment> findByAssessmentStatus(String status);
    
    List<Assessment> findByAssessmentTitle(String title);
    
    List<Assessment> findByModule_ModuleId(Integer moduleId);
    
    @Query("SELECT a FROM Assessment a WHERE a.module.course.id = :courseId")
    List<Assessment> findByCourseId(@Param("courseId") Long courseId);
}