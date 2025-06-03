package com.assessment.repository;

//import com.assessment.dto.CourseDTO;
import com.assessment.model.Course;

//import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
	
    List<Course> findByInstructorUserId(Integer userId);
	
    @Query("SELECT c FROM Course c ORDER BY c.updatedAt DESC")
    List<Course> findRecentCourses(Pageable pageable);
    
    @Query("SELECT c.courseId, c.courseName FROM Course c ORDER BY c.courseName")
    List<Object[]> getAllCourses();
    
    // Find courses by status
    List<Course> findByCourseStatus(String status);
    
    // Find courses by student ID (enrolled courses)
    @Query("SELECT c FROM Course c JOIN c.enrollments e WHERE e.student.userId = :studentId")
    List<Course> findCoursesByStudentId(@Param("studentId") Integer studentId);

}
