package com.assessment.controller;

import com.assessment.dto.AdminDTO;
import com.assessment.dto.AdminProfileUpdateDTO;
import com.assessment.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	
    //before merge
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(adminService.getAdminById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<AdminDTO> getAdminByUsername(@PathVariable String username) {
        try {
            return ResponseEntity.ok(adminService.getAdminByUsername(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateAdminProfile(@RequestBody AdminProfileUpdateDTO updateDTO) {
        try {
            AdminDTO updatedAdmin = adminService.updateAdminProfile(updateDTO);
            return ResponseEntity.ok(updatedAdmin);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
}