package com.assessment.controller;

import com.assessment.dto.EducatorDTO;
import com.assessment.dto.EducatorProfileDTO;
import com.assessment.dto.EducatorRegistrationDTO;
import com.assessment.dto.EducatorUpdateDTO;
import com.assessment.dto.StudentProfileDTO;
import com.assessment.dto.StudentProfileUpdateDTO;
import com.assessment.model.User;
import com.assessment.service.EducatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/educators")
public class EducatorController {
    
	@Autowired
    private EducatorService educatorService;
        
    @GetMapping
    public ResponseEntity<List<EducatorDTO>> getAllEducators() {
        return ResponseEntity.ok(educatorService.getAllEducators());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<EducatorDTO>> getActiveEducators() {
        return ResponseEntity.ok(educatorService.getActiveEducators());
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<EducatorDTO>> getInactiveEducators() {
        return ResponseEntity.ok(educatorService.getInactiveEducators());
    }
    
    @GetMapping("/activeStudents")
    public ResponseEntity<List<StudentProfileDTO>> getActiveStudents() {
        return ResponseEntity.ok(educatorService.getActiveStudents());
    }
    
    @GetMapping("/inactiveStudents")
    public ResponseEntity<List<StudentProfileDTO>> getInactiveStudents() {
        return ResponseEntity.ok(educatorService.getInactiveStudents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EducatorProfileDTO> getEducatorById(@PathVariable Integer id) {
        EducatorProfileDTO educatorDTO = educatorService.getEducatorById(id);
        return ResponseEntity.ok(educatorDTO);
    }
    
    @PostMapping("/activate")
    public ResponseEntity<Void> activateEducators(@RequestBody List<Integer> educatorIds) {
        educatorService.activateEducators(educatorIds);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/deactivate")
    public ResponseEntity<Void> deactivateEducators(@RequestBody List<Integer> educatorIds) {
        educatorService.deactivateEducators(educatorIds);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/activateStudents")
    public ResponseEntity<Void> activateStudents(@RequestBody List<Integer> studentIds) {
        educatorService.activateStudents(studentIds);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/deactivateStudents")
    public ResponseEntity<Void> deactivateStudents(@RequestBody List<Integer> studentIds) {
        educatorService.deactivateStudents(studentIds);
        System.out.println("Deactivating students with IDs: " + studentIds);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerEducator(@RequestBody EducatorRegistrationDTO registrationDTO) {
        try {
            User educator = educatorService.registerEducator(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "Educator registered successfully", "id", educator.getUserId())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    @PostMapping("/register-multiple")
    public ResponseEntity<?> registerMultipleEducators(@RequestBody List<EducatorRegistrationDTO> registrationDTOs) {
    	 System.out.println("Backend received educators:");
         registrationDTOs.forEach(dto -> 
             System.out.println(dto.getFirstName() + " - " + dto.getEmail())
         );
        try {
            List<User> educators = educatorService.registerEducators(registrationDTOs);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message", "Educators registered successfully", 
                    "count", educators.size()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", e.getMessage())
            );
        }
       
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateEducatorProfile(@RequestBody EducatorUpdateDTO updateDTO) {
        try {
            EducatorProfileDTO updatedEducator = educatorService.updateEducatorProfile(updateDTO);
            return ResponseEntity.ok(updatedEducator);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/update-student-profile")
    public ResponseEntity<?> updateStudent(@RequestBody StudentProfileUpdateDTO updateDTO) {
        try {
            StudentProfileDTO updatedStudent = educatorService.updateStudent(updateDTO);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
        	return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        return ResponseEntity.ok(educatorService.getDashboardStats());
    }
}