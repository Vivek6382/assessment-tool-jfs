package com.assessment.controller;

import com.assessment.dto.CourseDTO;
import com.assessment.dto.CoursesDTO;
import com.assessment.exception.ResourceNotFoundException;
import com.assessment.model.Course;
import com.assessment.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        if (courses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Integer id) {
        CourseDTO course = courseService.getCourseById(id);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }
    
    @GetMapping("/educator/{userId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByInstructor(@PathVariable Integer userId) {
        List<CourseDTO> courses = courseService.getCoursesByInstructorId(userId);
        return ResponseEntity.ok(courses);
    }


    @GetMapping("/recent")
    public ResponseEntity<List<CourseDTO>> getRecentCourses(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(courseService.getRecentCourses(limit));
    }


    
    @PostMapping
    public ResponseEntity<String> addCourse(@RequestBody Course course) {
        courseService.saveCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCourse(@PathVariable Integer id, @RequestBody Course course) {
        CourseDTO existing = courseService.getCourseById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Course with ID " + id + " not found.");
        }
        course.setCourseId(id);
        courseService.updateCourse(course);
        return ResponseEntity.ok("Course updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Integer id) {
        CourseDTO existing = courseService.getCourseById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Course with ID " + id + " not found.");
        }
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Course soft deleted successfully (status set to inactive)");
    }


    
    //Shreeni Vasu
    
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CoursesDTO>> getCoursesByStudentId(@PathVariable Integer studentId) {
        try {
            List<CoursesDTO> courses = courseService.getCoursesByStudentIdAsDTO(studentId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
    
}