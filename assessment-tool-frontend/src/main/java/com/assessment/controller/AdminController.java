package com.assessment.controller;

import java.time.LocalDate;
import java.util.ArrayList;
//import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
//import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.assessment.dto.AdminDTO;
import com.assessment.dto.AdminProfileUpdateDTO;
import com.assessment.dto.EducatorProfileDTO;
import com.assessment.dto.EducatorRegistrationDTO;
import com.assessment.dto.EducatorRegistrationRequest;
import com.assessment.dto.EducatorUpdateDTO;
import com.assessment.dto.StudentProfileUpdateDTO;
import com.assessment.service.AdminService;

@Controller
@RequestMapping("/Admin")
public class AdminController {
	
	@Autowired
    private AdminService adminService;
    
	// Dashboard
		@GetMapping("/AdminDashboard")
		public String showAdminDashboard(Model model) { 
			// Create metrics (unchanged)
		    List<Map<String, String>> metrics = new ArrayList<>();
		    
		    Map<String, String> activeEducators = new HashMap<>();
		    activeEducators.put("icon", "fas fa-chalkboard-teacher");
		    activeEducators.put("value", "3");
		    activeEducators.put("label", "Active Educators");
		    activeEducators.put("bgColor", "bg-primary");
		    metrics.add(activeEducators);
		    
		    Map<String, String> totalCourses = new HashMap<>();
		    totalCourses.put("icon", "fas fa-book");
		    totalCourses.put("value", "8");
		    totalCourses.put("label", "Total Courses");
		    totalCourses.put("bgColor", "bg-success");
		    metrics.add(totalCourses);
		    
		    Map<String, String> totalAssessments = new HashMap<>();
		    totalAssessments.put("icon", "fas fa-tasks");
		    totalAssessments.put("value", "32");
		    totalAssessments.put("label", "Total Assessments");
		    totalAssessments.put("bgColor", "bg-warning");
		    metrics.add(totalAssessments);
		    
		    Map<String, String> activeStudents = new HashMap<>();
		    activeStudents.put("icon", "fas fa-users");
		    activeStudents.put("value", "120");
		    activeStudents.put("label", "Active Students");
		    activeStudents.put("bgColor", "bg-info");
		    metrics.add(activeStudents);
		    
		    model.addAttribute("metrics", metrics);
		    
		    // Prepare data for the grouped bar chart
		    List<String> educatorNames = Arrays.asList("Vivek S", "Syed Anees", "Venkat Ramesh");
		    
		    // Define courses with their colors
		    List<Map<String, Object>> courses = new ArrayList<>();
		    
		    // Mathematics courses
		    courses.add(createCourseData("Mathematics Fundamentals", "#4361ee", Arrays.asList(85, 0, 0)));
		    courses.add(createCourseData("Advanced Calculus", "#3a0ca3", Arrays.asList(65, 0, 0)));
		    courses.add(createCourseData("Discrete Mathematics", "#4895ef", Arrays.asList(72, 0, 0)));
		    
		    // Physics courses
		    courses.add(createCourseData("Advanced Physics", "#06d6a0", Arrays.asList(0, 85, 0)));
		    courses.add(createCourseData("Quantum Mechanics", "#04a777", Arrays.asList(0, 62, 0)));
		    
		    // Chemistry courses
		    courses.add(createCourseData("Chemistry Basics", "#ffd166", Arrays.asList(0, 0, 78)));
		    courses.add(createCourseData("Organic Chemistry", "#ef476f", Arrays.asList(0, 0, 45)));
		    courses.add(createCourseData("Physical Chemistry", "#d62839", Arrays.asList(0, 0, 58)));
		    
		    // Add all the data to the model
		    model.addAttribute("educatorNames", educatorNames);
		    model.addAttribute("courses", courses);
		    return "Admin/AdminDashboard";
		}
		
	private Map<String, Object> createCourseData(String title, String color, List<Integer> completionRates) {
	    Map<String, Object> course = new HashMap<>();
	    course.put("title", title);
	    course.put("color", color);
	    course.put("completionRates", completionRates);
	    return course;
	}

    // Admin Panel
    @GetMapping("/AdminPanel")
    public String showAdminPanel(Model model) {
    	// Get dashboard statistics
        model.addAttribute("stats", adminService.getDashboardStats());
        
        // Get active and inactive educators
        model.addAttribute("activeEducators", adminService.getActiveEducators());
        model.addAttribute("inactiveEducators", adminService.getInactiveEducators());
        model.addAttribute("activeStudents",adminService.getActiveStudents());
        model.addAttribute("inactiveStudents",adminService.getInactiveStudents());
        
        return "Admin/AdminPanel";
    }
    
    @PostMapping("/activateEducators")
    public String activateEducators(@RequestParam("educatorIds") String educatorIdsString) {
        if (educatorIdsString != null && !educatorIdsString.isEmpty()) {
            List<Integer> educatorIds = Arrays.stream(educatorIdsString.split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            
            adminService.activateEducators(educatorIds);
        }
        return "redirect:/Admin/AdminPanel";
    }
    
    @PostMapping("/deactivateEducators")
    public String deactivateEducators(@RequestParam("educatorIds") String educatorIdsString) {
        if (educatorIdsString != null && !educatorIdsString.isEmpty()) {
            List<Integer> educatorIds = Arrays.stream(educatorIdsString.split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            
            adminService.deactivateEducators(educatorIds);
        }
        return "redirect:/Admin/AdminPanel";
    }
    
    @PostMapping("/activateStudents")
    public String activateStudents(@RequestParam("studentIds") String studentIdsString) {
        if (studentIdsString != null && !studentIdsString.isEmpty()) {
            List<Integer> studentIds = Arrays.stream(studentIdsString.split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            
            adminService.activateStudents(studentIds);
        }
        return "redirect:/Admin/AdminPanel";
    }
    
    @PostMapping("/deactivateStudents")
    public String deactivateStudents(@RequestParam("studentIds") String studentIdsString) {
        if (studentIdsString != null && !studentIdsString.isEmpty()) {
            List<Integer> studentIds = Arrays.stream(studentIdsString.split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            
            adminService.deactivateStudents(studentIds);
        }
        System.out.println("Deactivating students with IDs: " + studentIdsString);
        return "redirect:/Admin/AdminPanel";
    }
    
    @GetMapping("/AddUsers")
    public String showAddUsersPage() {
        return "Admin/AddUsers";
    }
    
    @PostMapping("/AddUsers")
    public String registerEducators(
            @RequestParam("totalEducatorsCount") int totalEducatorsCount,
            @RequestParam(value = "firstName", required = false) String[] firstNames,
            @RequestParam(value = "lastName", required = false) String[] lastNames,
            @RequestParam(value = "email", required = false) String[] emails,
            @RequestParam(value = "dateOfBirth", required = false) String[] dateOfBirths,
            @RequestParam(value = "gender", required = false) String[] genders,
            @RequestParam(value = "phoneNumber", required = false) String[] phoneNumbers,
            @RequestParam(value = "username", required = false) String[] usernames,
            @RequestParam(value = "password", required = false) String[] passwords,
            @RequestParam(value = "department", required = false) String[] departments,
            @RequestParam(value = "highestQualification", required = false) String[] highestQualifications,
            @RequestParam(value = "specialization", required = false) String[] specializations,
            @RequestParam(value = "professionalSummary", required = false) String[] professionalSummaries,
            @RequestParam(value = "role", required = false) String[] roles,
            RedirectAttributes redirectAttributes) {
    	
    	
        
        EducatorRegistrationRequest request = new EducatorRegistrationRequest();
        
        // Process educator data
        for (int i = 0; i < totalEducatorsCount; i++) {
        	EducatorRegistrationDTO educator = new EducatorRegistrationDTO();
            
            // Set properties from arrays
            educator.setFirstName(getValue(firstNames, i));
            educator.setLastName(getValue(lastNames, i));
            educator.setEmail(getValue(emails, i));
            educator.setDateOfBirth(getValue(dateOfBirths, i) != null ? LocalDate.parse(getValue(dateOfBirths, i)) : null);
            educator.setGender(getValue(genders, i));
            educator.setPhoneNumber(getValue(phoneNumbers, i));
            educator.setUsername(getValue(usernames, i));
            educator.setPassword(getValue(passwords, i));
            educator.setDepartment(getValue(departments, i));
            educator.setRole(getValue(roles, i));
            if ("Educator".equalsIgnoreCase(getValue(roles, i))) {
            educator.setHighestQualification(getValue(highestQualifications, i));
            educator.setSpecialization(getValue(specializations, i));
            educator.setProfessionalSummary(getValue(professionalSummaries, i));
            }
            request.getEducators().add(educator);
        }
        
        for (EducatorRegistrationDTO edu : request.getEducators()) {
            System.out.println("Educator: " + edu.getFirstName() + " - " + edu.getEmail());
        }

        
        // Call service to register educators
        Map<String, Object> result = adminService.registerEducators(request);
        
        if (result.containsKey("error")) {
            redirectAttributes.addFlashAttribute("error", result.get("error"));
        } else {
            redirectAttributes.addFlashAttribute("success", "Educators registered successfully!");
        }
        
        return "redirect:/Admin/AdminPanel";
    }
    
    // Helper method to safely get array values
    private String getValue(String[] array, int index) {
        if (array == null || index >= array.length) {
            return null;
        }
        return array[index];
    }

    @GetMapping("/AdminProfile")
    public String showAdminProfile(Model model) {
        // For now, we'll hardcode the admin username since we don't have session management
        // In a real app, you'd get this from the session/authentication
        String adminUsername = "admin01"; // Replace with actual admin username
        
        AdminDTO admin = adminService.getAdminByUsername(adminUsername);
        if (admin != null) {
            model.addAttribute("admin", admin);
        }
        
        return "Admin/AdminProfile";
    }
    
    @PostMapping("/updateAdminProfile")
    @ResponseBody
    public Map<String, Object> updateAdminProfile(@RequestBody AdminProfileUpdateDTO updateDTO) {
        return adminService.updateAdminProfile(updateDTO);
    }
    
    @PostMapping("/updateEducatorProfile")
    @ResponseBody
    public Map<String, Object> updateEducatorProfile(@RequestBody EducatorUpdateDTO updateDTO) {
        return adminService.updateEducatorProfile(updateDTO);
    }
    
    @PostMapping("/updateStudentProfile")
    @ResponseBody
    public Map<String, Object> updateStudent(@RequestBody StudentProfileUpdateDTO updateDTO) {
        return adminService.updateStudent(updateDTO);
    }
    
    // Educator Profile Management
    @GetMapping("/EducatorProfile")
    public String showEducatorProfile(@RequestParam Integer id, Model model) {
    	EducatorProfileDTO educator = adminService.getEducatorById(id);
        model.addAttribute("educator", educator);
        return "Admin/EducatorProfile";
    }

    // Login Page (GET)
    @GetMapping("/Login")
    public String showLoginPage() {
        return "Admin/Login";
    }

    // Login Handler (POST)
    @PostMapping("/Login")
    public String handleLogin(@RequestParam String username,
                              @RequestParam String password,
                              Model model) {
        if ("admin".equals(username) && "admin123".equals(password)) {
            return "redirect:/Admin/AdminDashboard";
        }

        model.addAttribute("error", "Invalid username or password.");
        return "Admin/Login";
    }
}