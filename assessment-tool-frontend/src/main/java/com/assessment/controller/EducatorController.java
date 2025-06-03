package com.assessment.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.assessment.dto.LoginRequest;
import com.assessment.dto.LoginResponse;
import com.assessment.dto.ResultDTO;
import com.assessment.service.CourseBackendService;
import com.assessment.service.ModuleBackendService;
import com.assessment.service.ResultBackendService;
import com.assessment.service.UserBackendService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/Educator")
public class EducatorController {
	
	@Autowired
	private CourseBackendService courseBackendService;
	
	@Autowired
	private UserBackendService userBackendService;
	
	@Autowired
	private ModuleBackendService moduleBackendService;
	
	@Autowired ResultBackendService resultBackendService;
	
	 @Autowired
	 private RestTemplate restTemplate;

    @Value("${api.base-url}")
    private String apiBaseUrl;

	// Dashboard
	@GetMapping("/Dashboard")
	public String showDashboard(Model model, HttpSession session) {
		
		 Integer userId = (Integer) session.getAttribute("userId");
		    if (userId == null) {
		        return "redirect:/Educator/Login";
		    }
		    
		 // Get all courses for the instructor
		    List<Map<String, Object>> courses = courseBackendService.getCoursesByInstructor(userId);
		    
		    List<Map<String, Object>> recentCourses = courseBackendService.getRecentCourses(3); // recent
		    
		 // Get all students (users with role ID 3)
		    List<Map<String, Object>> students = userBackendService.getUsersByRole(3);
		    
		    // Add to model
		    model.addAttribute("userInfo", userBackendService.getUserById(userId));
		    model.addAttribute("courses", courses);
		    model.addAttribute("recentCourses", recentCourses);
		    model.addAttribute("students", students);
		    
		    List<ResultDTO> results;
		    // 🚀 NEW: Fetch all results
		    results = resultBackendService.getAllResults();

	        try {
	            String resultsJson = new ObjectMapper().writeValueAsString(results);
	            model.addAttribute("resultsJson", resultsJson);
	        } catch (Exception e) {
	            e.printStackTrace();
	            model.addAttribute("resultsJson", "[]");
	        }

		    model.addAttribute("results", results);
		    
		    
		    
		    return "Educator/Dashboard";
	}
	
	@GetMapping("/CourseManagement")
	public String showCourseManagement(
	        Model model, 
	        HttpSession session,
	        @RequestParam(required = false) String search,
	        @RequestParam(required = false, defaultValue = "default") String sort,
	        @RequestParam(required = false, defaultValue = "asc") String direction) {
	    
	    Integer userId = (Integer) session.getAttribute("userId");
	    if (userId == null) {
	        return "redirect:/Educator/Login";
	    }
	    
	    // Get all courses for the instructor
	    List<Map<String, Object>> courses = courseBackendService.getCoursesByInstructor(userId);
	    List<Map<String, Object>> recentCourses = courseBackendService.getRecentCourses(3); // 5 recent
	    
	    // Add to model
	    model.addAttribute("userInfo", userBackendService.getUserById(userId));
	    model.addAttribute("courses", courses);
	    model.addAttribute("recentCourses", recentCourses);
	    model.addAttribute("hasCourses", !courses.isEmpty());
	    model.addAttribute("currentSearch", search);
	    model.addAttribute("currentSort", sort);
	    model.addAttribute("currentDirection", direction);
	    
	    return "Educator/CourseManagement";
	}

    // Modules Management
	@GetMapping("/ModulesManagement")
	public String showModulesManagement(@RequestParam("courseId") Integer courseId, Model model, HttpSession session) {
		Integer userId = (Integer) session.getAttribute("userId");

	    if (userId == null) {
	        return "redirect:/Educator/Login"; // Not logged in
	    }
	    
	 // Get user information
	    Map<String, Object> userInfo = userBackendService.getUserById(userId);
	    if (userInfo != null) {
	        model.addAttribute("userInfo", userInfo);
	    }

	    List<Map<String, Object>> modules = moduleBackendService.getModulesByCourse(courseId);
	    model.addAttribute("courseId", courseId);
	    
	    Map<String, Object> courseDetails = courseBackendService.getCourseById(courseId);
	    model.addAttribute("courseDetails", courseDetails);
	    
	    session.setAttribute("courseId", courseId);
	    model.addAttribute("modules", modules);
	    model.addAttribute("hasModules", !modules.isEmpty());
	    return "Educator/ModulesManagement";
	}


    // Profile Management
	@GetMapping("/ProfileManagement")
	public String showProfileManagement(
	        Model model,
	        HttpSession session,
	        @RequestParam(required = false) String search,
	        @RequestParam(required = false, defaultValue = "title") String sort,
	        @RequestParam(required = false, defaultValue = "asc") String direction) {

	    Integer userId = (Integer) session.getAttribute("userId");
	    if (userId == null) {
	        return "redirect:/Educator/Login";
	    }

	    // 1. Get all courses from backend (no filtering)
	    List<Map<String, Object>> allCourses = courseBackendService.getCoursesByInstructor(userId);

	    // 2. Filter for active courses first, then apply additional filtering and sorting
	    List<Map<String, Object>> activeCourses = allCourses.stream()
	            .filter(course -> course.containsKey("courseStatus") && 
	                    "active".equalsIgnoreCase(course.get("courseStatus").toString()))
	            .collect(Collectors.toList());

	    // 3. Apply search and sort to active courses
	    List<Map<String, Object>> filteredCourses = filterAndSortCourses(activeCourses, search, sort, direction);
	    
	    List<Map<String, Object>> students = userBackendService.getUsersByRole(3);

	    List<Map<String, Object>> recentCourses = courseBackendService.getRecentCourses(3); // recent

	    model.addAttribute("userInfo", userBackendService.getUserById(userId));
	    model.addAttribute("ongoingCourses", filteredCourses);
	    model.addAttribute("allCourses", allCourses);
	    model.addAttribute("recentCourses", recentCourses);
	    model.addAttribute("hasCourses", !activeCourses.isEmpty());
	    model.addAttribute("currentSearch", search);
	    model.addAttribute("currentSort", sort);
	    model.addAttribute("currentDirection", direction);
	    model.addAttribute("students", students);

	    
	    List<ResultDTO> results;
	    // 🚀 NEW: Fetch all results
	    results = resultBackendService.getAllResults();

        try {
            String resultsJson = new ObjectMapper().writeValueAsString(results);
            model.addAttribute("resultsJson", resultsJson);
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("resultsJson", "[]");
        }

	    model.addAttribute("results", results);

	    return "Educator/ProfileManagement";
	}

	private List<Map<String, Object>> filterAndSortCourses(
	        List<Map<String, Object>> courses,
	        String search,
	        String sortBy,
	        String direction) {

	    // Filtering
	    Stream<Map<String, Object>> stream = courses.stream();

	    if (search != null && !search.isEmpty()) {
	        String finalSearch = search.toLowerCase();
	        stream = stream.filter(course ->
	                course.get("courseName").toString().toLowerCase().contains(finalSearch) ||
	                course.get("courseId").toString().contains(search) ||
	                (course.containsKey("instructorName") && 
	                 course.get("instructorName").toString().toLowerCase().contains(finalSearch))
	        );
	    }

	    // Sorting
	    Comparator<Map<String, Object>> comparator = getComparator(sortBy);
	    if ("desc".equalsIgnoreCase(direction)) {
	        comparator = comparator.reversed();
	    }

	    return stream.sorted(comparator).collect(Collectors.toList());
	}

	private Comparator<Map<String, Object>> getComparator(String sortBy) {
	    switch (sortBy.toLowerCase()) {
	        case "title":
	            return Comparator.comparing(c -> c.get("courseName").toString());
	        case "date":
	            return Comparator.comparing(c -> {
	                // Handle potential different date formats
	                if (c.get("courseEndDate") instanceof LocalDateTime) {
	                    return (LocalDateTime) c.get("courseEndDate");
	                } else {
	                    return LocalDateTime.parse(c.get("courseEndDate").toString());
	                }
	            });
	        case "credits":
	            return Comparator.comparing(c -> Integer.parseInt(c.get("courseCredits").toString()));
	        case "id":
	            return Comparator.comparing(c -> Integer.parseInt(c.get("courseId").toString()));
	        default:
	            return Comparator.comparing(c -> c.get("courseName").toString());
	    }
	}
    // Login Page (GET)
    @GetMapping("/Login")
    public String showLoginPage() {
        return "Educator/Login";
    }
    
	// Dashboard
	@GetMapping("/MyClasses")
	public String showClasses(Model model, HttpSession session) {
		 Integer userId = (Integer) session.getAttribute("userId");
		    if (userId == null) {
		        return "redirect:/Educator/Login";
		    }
		    
		 // Get all courses for the instructor
		    List<Map<String, Object>> courses = courseBackendService.getCoursesByInstructor(userId);
		    
		 // Get all students (users with role ID 3)
		    List<Map<String, Object>> students = userBackendService.getUsersByRole(3);
		    
		    // Add to model
		    model.addAttribute("userInfo", userBackendService.getUserById(userId));
		    model.addAttribute("courses", courses);
		    model.addAttribute("students", students);
		    
		return "Educator/MyClasses";
	}
	
	@GetMapping("/StudentsManagement")
	public String showStudentManagementPage(Model model, HttpSession session,
	                                        @RequestParam(value = "studentId", required = false) Integer studentId,
	                                        @RequestParam(value = "moduleId", required = false) Integer moduleId) {
	    Integer userId = (Integer) session.getAttribute("userId");
	    if (userId == null) return "redirect:/Educator/Login";

	    List<Map<String, Object>> courses = courseBackendService.getCoursesByInstructor(userId);
	    List<Map<String, Object>> students = userBackendService.getUsersByRole(3);

	    model.addAttribute("userInfo", userBackendService.getUserById(userId));
	    model.addAttribute("courses", courses);
	    model.addAttribute("students", students);

	    List<ResultDTO> results;
	    if (studentId != null && moduleId != null) {
	        results = resultBackendService.getStudentResultsByModule(studentId, moduleId);
	    } else if (studentId != null) {
	        results = resultBackendService.getResultsByStudent(studentId);
	    } else {
	        // 🚀 NEW: Fetch all results
	        results = resultBackendService.getAllResults();
	    }

	    model.addAttribute("results", results);
	    return "Educator/StudentsManagement";
	}


    
    @GetMapping("/Logout")
    public String logout(HttpSession session) {
        session.invalidate(); // Destroys session and clears all attributes
        return "redirect:/Educator/Login"; // Or redirect to general login page
    }

    
    // Add a GET endpoint to fetch course data for editing
    @GetMapping("/courses/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Integer id, Principal principal) {
    	try {
    		// Call backend service to get course data
    		Map<String, Object> course = courseBackendService.getCourseById(id);
    		
    		if (course == null) {
    			return ResponseEntity.notFound().build();
    		}
    		
    		return ResponseEntity.ok()
    				.contentType(MediaType.APPLICATION_JSON)
    				.body(course);
    		
    	} catch (Exception e) {
    		return ResponseEntity.badRequest()
    				.contentType(MediaType.APPLICATION_JSON)
    				.body(Collections.singletonMap("error", "Failed to fetch course: " + e.getMessage()));
    	}
    }
    
    @GetMapping("/student/{id}/enrolled-courses")
    public ResponseEntity<?> getEnrolledCourses(@PathVariable("id") Integer studentId) {
        try {
            List<Map<String, Object>> courses = courseBackendService.getEnrolledCoursesByStudentId(studentId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    
    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> courseData,
            Principal principal) {

        try {
            // Extract data from request body
            String courseName = (String) courseData.get("courseName");
            String courseDescription = (String) courseData.get("courseDescription");
            int courseCredits = ((Number) courseData.get("courseCredits")).intValue();
            String courseStartDate = (String) courseData.get("courseStartDate");
            String courseEndDate = (String) courseData.get("courseEndDate");
            String courseStatus = (String) courseData.get("courseStatus");

            // Get current course data to preserve instructor information
            Map<String, Object> currentCourse = courseBackendService.getCourseById(id);
            if (currentCourse == null) {
                return ResponseEntity.notFound().build();
            }

            // Build nested instructor map
            Map<String, Object> instructor = new HashMap<>();
            instructor.put("userId", currentCourse.get("instructorId"));

            // Build request payload
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("courseName", courseName);
            requestData.put("courseDescription", courseDescription);
            requestData.put("courseCredits", courseCredits);
            requestData.put("courseStartDate", LocalDateTime.parse(courseStartDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME).toString());
            requestData.put("courseEndDate", LocalDateTime.parse(courseEndDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME).toString());
            requestData.put("courseStatus", courseStatus.toLowerCase());
            requestData.put("instructor", instructor);  // ✅ Nest instructor properly

            // Call backend service
            String result = courseBackendService.updateCourse(id, requestData);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("message", result));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("error", "Failed to update course: " + e.getMessage()));
        }
    }


    // Login Handler (POST)
    @PostMapping("/Login")
    public String handleLogin(@RequestParam String username,
                            @RequestParam String password,
                            HttpSession session,
                            Model model) {
        
        try {
            // Call backend API
            ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                apiBaseUrl + "/api/users/login",
                new LoginRequest(username, password),
                LoginResponse.class
            );

            // Store user info in session
            LoginResponse user = response.getBody();
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("role", user.getRole());
            
            // Role-based redirection
            if ("Educator".equalsIgnoreCase(user.getRole())) {
                return "redirect:/Educator/CourseManagement";
            } 
            else if ("Admin".equalsIgnoreCase(user.getRole())) {
                return "redirect:/Admin/AdminDashboard";
            } 
            else if ("student".equalsIgnoreCase(user.getRole())) {
            	return "redirect:/Student/Profile";
            } 
            else {
                model.addAttribute("error", "Unauthorized role access");
                return "Login";  // Or show access denied page
            }
            
        } catch (HttpClientErrorException e) {
            String error = "Invalid username or password";
            if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                error = "Access restricted to educators only";
            }
            model.addAttribute("error", error);
            return "Educator/Login";
        }
    }
    
    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> courseData, HttpSession session) {
        try {
            // 1. Extract logged-in user ID from session
            Integer userId = (Integer) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "User not logged in"));
            }

            // 2. Extract course data from request
            String courseName = (String) courseData.get("courseName");
            String courseDescription = (String) courseData.get("courseDescription");
            int courseCredits = ((Number) courseData.get("courseCredits")).intValue();
            String courseStartDate = (String) courseData.get("courseStartDate");
            String courseEndDate = (String) courseData.get("courseEndDate");
            String courseStatus = (String) courseData.get("courseStatus");

            // 3. Prepare request body with instructor ID
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("courseName", courseName);
            requestData.put("courseDescription", courseDescription);
            requestData.put("courseCredits", courseCredits);

            Map<String, Object> instructor = new HashMap<>();
            instructor.put("userId", userId); // ← dynamic instructor ID
            requestData.put("instructor", instructor);

            // 4. Format and assign dates
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            requestData.put("courseStartDate", LocalDateTime.parse(courseStartDate, formatter).toString());
            requestData.put("courseEndDate", LocalDateTime.parse(courseEndDate, formatter).toString());

            requestData.put("courseStatus", courseStatus.toLowerCase());

            // 5. Send to backend
            String result = courseBackendService.addCourse(requestData);
            
            System.out.println("Course created by userId: " + userId);


            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Collections.singletonMap("message", result));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Collections.singletonMap("error", "Failed to create course: " + e.getMessage()));
        }
    }
    
    @PostMapping("/updateProfile")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> userData, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        Map<String, Object> response = new HashMap<>();
        
        if (userId == null) {
            response.put("success", false);
            response.put("message", "User not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        // Only include fields that exist in your User model
        Map<String, Object> filteredUserData = new HashMap<>();
        filteredUserData.put("username", userData.get("username"));
        filteredUserData.put("userFirstName", userData.get("userFirstName"));
        filteredUserData.put("userLastName", userData.get("userLastName"));
        filteredUserData.put("userEmail", userData.get("userEmail"));
        filteredUserData.put("userMobileNumber", userData.get("userMobileNumber"));
        filteredUserData.put("userStatus", userData.get("userStatus"));
        filteredUserData.put("userDob", userData.get("userDob"));
        filteredUserData.put("userGender", userData.get("userGender"));
        filteredUserData.put("userDepartment", userData.get("userDepartment"));
        filteredUserData.put("userHighestQualification", userData.get("userHighestQualification"));
        
        boolean updated = userBackendService.updateUser(userId, filteredUserData);
        
        if (updated) {
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to update profile");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
        @RequestParam String currentPassword,
        @RequestParam String newPassword,
        HttpSession session) {

        try {
            // Get userId from session, similar to how you do in showProfileManagement
            Integer userId = (Integer) session.getAttribute("userId");
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
            }
            
            // Get user information to retrieve email
            Map<String, Object> userInfo = userBackendService.getUserById(userId);
            
            if (userInfo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User information not found");
            }
            
            String email = (String) userInfo.get("userEmail");
            
            // Call backend service
            boolean success = userBackendService.changePassword(email, currentPassword, newPassword);

            if (success) {
                return ResponseEntity.ok("Password updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to update password");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Integer id, Principal principal) {
        try {
            // Get course details first to verify it exists
            Map<String, Object> course = courseBackendService.getCourseById(id);
            if (course == null) {
                return ResponseEntity.notFound()
                        .build();
            }
            
            // Call the service to delete the course
            String result = courseBackendService.deleteCourse(id);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("message", result));
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("error", "Failed to delete course: " + e.getMessage()));
        }
    }
}
