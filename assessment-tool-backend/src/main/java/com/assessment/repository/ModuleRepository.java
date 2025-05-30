package com.assessment.repository;

import com.assessment.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    
    List<Module> findByModuleName(String moduleName);
    
    List<Module> findByCourse_CourseId(Integer courseId);
    
 // Find modules by course ID
    List<Module> findByCourseCourseId(Integer courseId);
}