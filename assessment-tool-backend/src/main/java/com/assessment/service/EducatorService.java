package com.assessment.service;

import com.assessment.dto.CourseDTO;
import com.assessment.dto.EducatorDTO;
import com.assessment.dto.EducatorProfileDTO;
import com.assessment.dto.EducatorRegistrationDTO;
import com.assessment.dto.EducatorUpdateDTO;
import com.assessment.dto.StudentProfileDTO;
import com.assessment.dto.StudentProfileUpdateDTO;
import com.assessment.model.Course;
import com.assessment.model.Role;
import com.assessment.model.User;
import com.assessment.repository.CourseRepository;
import com.assessment.repository.RoleRepository;
import com.assessment.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EducatorService {
    
	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private RoleRepository roleRepository;
	
	@Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    //private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
    
    public List<EducatorDTO> getAllEducators() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "Educator".equals(user.getRole().getRoleName()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<EducatorDTO> getActiveEducators() {
        return userRepository.findActiveEducators().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<EducatorDTO> getInactiveEducators() {
        return userRepository.findInactiveEducators().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<StudentProfileDTO> getActiveStudents() {
        return userRepository.findActiveStudents().stream()
                .map(this::convertToStudentDTO)
                .collect(Collectors.toList());
    }
    
    public List<StudentProfileDTO> getInactiveStudents() {
        return userRepository.findInactiveStudents().stream()
                .map(this::convertToStudentDTO)
                .collect(Collectors.toList());
    }
    
    public EducatorProfileDTO getEducatorById(Integer id) {
        User educator = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Educator not found with id: " + id));
        
        // Get courses taught by this educator
        List<Course> courses = courseRepository.findByInstructorUserId(id);
        
        // Convert to DTO
        return convertToDTO(educator, courses);
    }
    
    private EducatorProfileDTO convertToDTO(User user, List<Course> courses) {
        EducatorProfileDTO dto = new EducatorProfileDTO();
        dto.setId(user.getUserId());
        dto.setFirstName(user.getUserFirstName());
        dto.setLastName(user.getUserLastName());
        dto.setEmail(user.getUserEmail());
        dto.setMobile(user.getUserMobileNumber());
        dto.setStatus(user.getUserStatus());
        dto.setDob(user.getUserDob());
        dto.setGender(user.getUserGender());
        dto.setDepartment(user.getUserDepartment());
        dto.setHighestQualification(user.getUserHighestQualification());
        dto.setSpecialization(user.getUserSpecialization());
        dto.setProfessionalSummary(user.getUserProfessionalSummary());
        
        // Calculate performance metrics
//        dto.setTotalStudents(calculateTotalStudents(courses));
//        dto.setTotalAssessments(calculateTotalAssessments(user)));
//        dto.setCompletionRate(calculateCompletionRate(courses)));
//        dto.setPerformanceScore(calculatePerformanceScore(user)));
        
        // Convert courses to DTOs
        dto.setCourses(courses.stream()
                .map(this::convertCourseToDTO)
                .collect(Collectors.toList()));
        
        return dto;
    }
    
    private StudentProfileDTO convertToStudentDTO(User user) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getUserFirstName());
        dto.setLastName(user.getUserLastName());
        dto.setEmail(user.getUserEmail());
        dto.setMobile(user.getUserMobileNumber());
        dto.setStatus(user.getUserStatus());
        dto.setDob(user.getUserDob());
        dto.setGender(user.getUserGender());
        dto.setDepartment(user.getUserDepartment());
        dto.setUsername(user.getUsername());
        
        // Calculate performance metrics
//        dto.setTotalStudents(calculateTotalStudents(courses));
//        dto.setTotalAssessments(calculateTotalAssessments(user)));
//        dto.setCompletionRate(calculateCompletionRate(courses)));
//        dto.setPerformanceScore(calculatePerformanceScore(user)));
        
        // Convert courses to DTOs
//        dto.setCourses(courses.stream()
//                .map(this::convertCourseToDTO)
//                .collect(Collectors.toList()));
        
        return dto;
    }
    
    private CourseDTO convertCourseToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseDescription(course.getCourseDescription());
        dto.setCourseStartDate(course.getCourseStartDate());
        dto.setCourseEndDate(course.getCourseEndDate());
        return dto;
    }
    
    @Transactional
    public void activateEducators(List<Integer> educatorIds) {
        educatorIds.forEach(id -> {
            User educator = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Educator not found with id: " + id));
            educator.setUserStatus("Active");
            userRepository.save(educator);
        });
    }
    
    @Transactional
    public void deactivateEducators(List<Integer> educatorIds) {
        educatorIds.forEach(id -> {
            User educator = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Educator not found with id: " + id));
            educator.setUserStatus("Inactive");
            userRepository.save(educator);
        });
    }
    
    @Transactional
    public void activateStudents(List<Integer> studentIds) {
        studentIds.forEach(id -> {
            User student = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
            student.setUserStatus("Active");
            userRepository.save(student);
        });
    }
    
    @Transactional
    public void deactivateStudents(List<Integer> studentIds) {
        studentIds.forEach(id -> {
            User student = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
            student.setUserStatus("Inactive");
            System.out.println("Deactivating student ID: " + id + ", Current status: " + 
                    student.getUserStatus() + ", Role: " + student.getRole().getRoleName());
            userRepository.save(student);
        });
    }
    
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalEducators", userRepository.countTotalEducators());
        stats.put("activeEducators", userRepository.countActiveEducators());
        stats.put("inactiveEducators", userRepository.countInactiveEducators());
        stats.put("activeStudents", userRepository.countActiveStudents());
        stats.put("totalStudents", userRepository.countTotalStudents());
        return stats;
    }
    
    @Transactional
    public User registerEducator(EducatorRegistrationDTO registrationDTO) {
        // Check if username or email already exists
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.findByUserEmail(registrationDTO.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        
        // Get the educator role
        Role educatorRole = roleRepository.findByRoleName("EDUCATOR");
        if (educatorRole == null) {
            throw new RuntimeException("Educator role not found");
        }
        
        // Create new user entity
        User educator = new User();
        educator.setUserFirstName(registrationDTO.getFirstName());
        educator.setUserLastName(registrationDTO.getLastName());
        educator.setUserEmail(registrationDTO.getEmail());
        educator.setUsername(registrationDTO.getUsername());
        educator.setUserPasswordHash(passwordEncoder.encode(registrationDTO.getPassword()));
        educator.setUserMobileNumber(registrationDTO.getPhoneNumber());
        educator.setUserDob(registrationDTO.getDateOfBirth());
        educator.setUserGender(registrationDTO.getGender());
        educator.setUserDepartment(registrationDTO.getDepartment());
        educator.setUserHighestQualification(registrationDTO.getHighestQualification());
        educator.setUserSpecialization(registrationDTO.getSpecialization());
        educator.setUserProfessionalSummary(registrationDTO.getProfessionalSummary());
        educator.setRole(educatorRole);
        educator.setUserStatus("Active");
        educator.setUserCreatedAt(LocalDateTime.now());
        
        System.out.println("Saving user: " + registrationDTO.getEmail());
        
        return userRepository.save(educator);
    }
    
    @Transactional
    public User registerStudent(EducatorRegistrationDTO registrationDTO) {
        // Check if username or email already exists
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByUserEmail(registrationDTO.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        // Get the student role
        Role studentRole = roleRepository.findByRoleName("STUDENT");
        if (studentRole == null) {
            throw new RuntimeException("Student role not found");
        }

        // Create new user entity
        User student = new User();
        student.setUserFirstName(registrationDTO.getFirstName());
        student.setUserLastName(registrationDTO.getLastName());
        student.setUserEmail(registrationDTO.getEmail());
        student.setUsername(registrationDTO.getUsername());
        student.setUserPasswordHash(passwordEncoder.encode(registrationDTO.getPassword()));
        student.setUserMobileNumber(registrationDTO.getPhoneNumber());
        student.setUserDob(registrationDTO.getDateOfBirth());
        student.setUserGender(registrationDTO.getGender());
        student.setUserDepartment(registrationDTO.getDepartment());
        // Student-specific fields are left null or can be set to default values
        student.setRole(studentRole);
        student.setUserStatus("Active");
        student.setUserCreatedAt(LocalDateTime.now());

        return userRepository.save(student);
    }
    
    /**
     * Register multiple educators
     */
    @Transactional
    public List<User> registerEducators(List<EducatorRegistrationDTO> registrationDTOs) {
    	 List<User> registeredEducators = new ArrayList<>();
    	    List<String> errorMessages = new ArrayList<>();
    	    
    	    for (int i = 0; i < registrationDTOs.size(); i++) {
    	        EducatorRegistrationDTO dto = registrationDTOs.get(i);
    	        try {
    	        	if("student".equalsIgnoreCase(dto.getRole())) {
    	        		User student = registerStudent(dto);
    	        		registeredEducators.add(student);
    	        	}
    	        	else {
    	            User educator = registerEducator(dto);
    	            registeredEducators.add(educator);}
    	        } catch (Exception e) {
    	            errorMessages.add("Educator " + (i+1) + ": " + e.getMessage());
    	        }
    	    }
    	    
    	    if (!errorMessages.isEmpty() && registeredEducators.isEmpty()) {
    	        throw new RuntimeException("All educators failed: " + String.join(", ", errorMessages));
    	    } else if (!errorMessages.isEmpty()) {
    	        // Log partial failures but still return successfully registered educators
    	        System.out.print("Partial success: " + String.join(", ", errorMessages));
    	    }
    	    
    	    return registeredEducators;
    }
    
    private EducatorDTO convertToDTO(User user) {
        int studentCount = 0;
        
        // Count all students enrolled in courses taught by this educator
        if (user.getTaughtCourses() != null) {
            studentCount = user.getTaughtCourses().stream()
                .mapToInt(course -> {
                    if (course.getEnrollments() != null) {
                        return course.getEnrollments().size();
                    }
                    return 0;
                })
                .sum();
        }
        
        return new EducatorDTO(
                user.getUserId(),
                user.getUserFirstName(),
                user.getUserLastName(),
                user.getUserEmail(),
                user.getUserStatus(),
                studentCount,
                user.getUserCreatedAt(),
                user.getUserLastLogin()
        );
    }
    
    public EducatorProfileDTO updateEducatorProfile(EducatorUpdateDTO updateDTO) {
        // 1. Find the existing educator
        User educator = userRepository.findById(updateDTO.getId())
                .orElseThrow(() -> new RuntimeException("Educator not found with id: " + updateDTO.getId()));

        // 3. Update only the allowed fields
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isBlank()) {
            if (!educator.getUserEmail().equals(updateDTO.getEmail()) && 
                userRepository.existsByUserEmail(updateDTO.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            educator.setUserEmail(updateDTO.getEmail());
        }

        if (updateDTO.getMobile() != null && !updateDTO.getMobile().isBlank()) {
            educator.setUserMobileNumber(updateDTO.getMobile());
        }

        if (updateDTO.getStatus() != null && !updateDTO.getStatus().isBlank()) {
            educator.setUserStatus(updateDTO.getStatus());
        }

        // 4. Save the updated educator
        User updatedEducator = userRepository.save(educator);

        // 5. Get the updated profile with courses
        List<Course> courses = courseRepository.findByInstructorUserId(updatedEducator.getUserId());
        
        // 6. Convert to DTO and return
        return convertToDTO(updatedEducator, courses);
    }
    
    @Transactional
    public StudentProfileDTO updateStudent(StudentProfileUpdateDTO updateDTO) {
        User student = userRepository.findById(updateDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + updateDTO.getUserId()));
        
        // Verify this is a student
        if (student.getRole() == null || !student.getRole().getRoleName().equalsIgnoreCase("STUDENT")) {
            throw new RuntimeException("User is not a student");
        }
        
        // Update mobile if provided
        if (updateDTO.getMobile() != null && !updateDTO.getMobile().isEmpty()) {
            student.setUserMobileNumber(updateDTO.getMobile());
        }
        
        // Update status if provided
        if (updateDTO.getStatus() != null) {
            student.setUserStatus(updateDTO.getStatus());
        }
        
        // Update department if provided
        if (updateDTO.getDepartment() != null && !updateDTO.getDepartment().isEmpty()) {
            student.setUserDepartment(updateDTO.getDepartment());
        }
        
        // Save updated student
        student = userRepository.save(student);
        
        return convertToStudentDTO(student);
    }
}