package com.assessment.service;

import com.assessment.dto.AssessmentDTO;
import com.assessment.dto.CourseDTO;
import com.assessment.dto.CoursesDTO;
import com.assessment.dto.ModuleDTO;
import com.assessment.exception.CourseServiceException;
import com.assessment.model.Assessment;
import com.assessment.model.Course;
import com.assessment.model.User;
import com.assessment.repository.CourseRepository;
import com.assessment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.assessment.model.Module;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

	    @Autowired
	    private CourseRepository courseRepository;

	    @Autowired
	    private UserRepository userRepository;

	    public List<CourseDTO> getAllCourses() {
	        try {
	            return courseRepository.findAll().stream()
	                    .map(this::convertToDTO)
	                    .collect(Collectors.toList());
	        } catch (Exception e) {
	            throw new CourseServiceException("Failed to retrieve courses", e);
	        }
	    }

	    public CourseDTO getCourseById(Integer id) {
	        return courseRepository.findById(id)
	                .map(this::convertToDTO)
	                .orElseThrow(() -> new CourseServiceException("Course with ID " + id + " not found"));
	    }

	    public List<CourseDTO> getCoursesByInstructorId(Integer userId) {
	        try {
	            List<Course> courses = courseRepository.findByInstructorUserId(userId);
	            return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
	        } catch (Exception e) {
	            throw new CourseServiceException("Failed to get courses for instructor ID: " + userId, e);
	        }
	    }
	    
	    
	    public List<CourseDTO> getRecentCourses(int limit) {
	        List<Course> courses = courseRepository.findRecentCourses(PageRequest.of(0, limit));
	        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
	    }



	    public void saveCourse(Course course) {
	        try {
	            attachInstructor(course);
	            courseRepository.save(course);
	        } catch (Exception e) {
	            throw new CourseServiceException("Failed to save course", e);
	        }
	    }

	    public void updateCourse(Course course) {
	        if (!courseRepository.existsById(course.getCourseId())) {
	            throw new CourseServiceException("Course with ID " + course.getCourseId() + " not found");
	        }
	        try {
	            attachInstructor(course);
	            courseRepository.save(course);
	        } catch (Exception e) {
	            throw new CourseServiceException("Failed to update course", e);
	        }
	    }

	    public void deleteCourse(Integer id) {
	        Course course = courseRepository.findById(id)
	                .orElseThrow(() -> new CourseServiceException("Course with ID " + id + " not found"));
	        try {
	            course.setCourseStatus("inactive");
	            courseRepository.save(course);
	        } catch (Exception e) {
	            throw new CourseServiceException("Failed to delete course", e);
	        }
	    }

	    private void attachInstructor(Course course) {
	        if (course.getInstructor() != null && course.getInstructor().getUserId() != null) {
	            userRepository.findById(course.getInstructor().getUserId()).ifPresent(course::setInstructor);
	        }
	    }

	    private CourseDTO convertToDTO(Course course) {
	        int assessmentCount = 0;
	        List<ModuleDTO> moduleDTOs = new ArrayList<>();

	        if (course.getModules() != null) {
	            for (Module module : course.getModules()) {
	                List<AssessmentDTO> assessmentDTOs = new ArrayList<>();

	                if (module.getAssessments() != null) {
	                    assessmentCount += module.getAssessments().size();

	                    // Convert Assessment (Entity) to AssessmentDTO
	                    for (Assessment assessment : module.getAssessments()) {
	                        AssessmentDTO assessmentDTO = new AssessmentDTO(
	                            assessment.getAssessmentId(),
	                            assessment.getAssessmentTitle(),
	                            assessment.getAssessmentDescription(),
	                            assessment.getAssessmentType(),
	                            assessment.getAssessmentDurationMinutes(),
	                            assessment.getAssessmentPassingScore(),
	                            assessment.getAssessmentTotalMarks(),
	                            assessment.getAssessmentStatus(),
	                            assessment.getStartDate(),
	                            assessment.getEndDate()
	                        );
	                        assessmentDTOs.add(assessmentDTO);
	                    }
	                }

	                // Create ModuleDTO with converted assessments
	                ModuleDTO dto = new ModuleDTO(
	                    module.getModuleId(),
	                    module.getModuleName(),
	                    module.getModuleStatus(),
	                    module.getStartDate(),
	                    module.getEndDate(),
	                    assessmentDTOs
	                );

	                moduleDTOs.add(dto);
	            }
	        }

	        return new CourseDTO(
	            course.getCourseId(),
	            course.getCourseName(),
	            course.getCourseDescription(),
	            course.getCourseCredits(),
	            course.getInstructor() != null ? course.getInstructor().getUserId() : null,
	            course.getInstructor() != null ? course.getInstructor().getUserFirstName() : null,
	            course.getCourseStartDate(),
	            course.getCourseEndDate(),
	            course.getCourseStatus(),
	            course.getUpdatedAt(),
	            moduleDTOs,
	            assessmentCount
	        );
	    }


	    
	    
	    
	    
	    
	    //Shreeni vasu 
	    
	    
	    
	    // Convert Course entity to CourseDTO
	    public CoursesDTO convertToDTOs(Course course) {
	        CoursesDTO dto = new CoursesDTO();
	        dto.setCourseId(course.getCourseId());
	        dto.setCourseName(course.getCourseName());
	        dto.setCourseCredits(course.getCourseCredits());
	        dto.setCourseDescription(course.getCourseDescription());
	        
	        // Get instructor ID and name if available
	        if (course.getInstructor() != null) {
	            dto.setInstructorId(course.getInstructor().getUserId());
	            dto.setInstructorName(course.getInstructor().getUserFirstName() + " " + 
	                                 course.getInstructor().getUserLastName());
	        }
	        
	        // Set dates directly without conversion
	        dto.setCourseStartDate(course.getCourseStartDate());
	        dto.setCourseEndDate(course.getCourseEndDate());
	        dto.setCourseStatus(course.getCourseStatus());
	        
	        return dto;
	    }
	    
	    
	 // Get courses by student ID (enrolled courses)
	    public List<CoursesDTO> getCoursesByStudentIdAsDTO(Integer studentId) {
	        return courseRepository.findCoursesByStudentId(studentId).stream()
	                .map(this::convertToDTOs)
	                .collect(Collectors.toList());
	    }
	    
}