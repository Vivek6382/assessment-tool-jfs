package com.assessment.service;

import com.assessment.dto.AdminDTO;
import com.assessment.dto.AdminProfileUpdateDTO;
//import com.assessment.model.Role;
import com.assessment.model.User;
//import com.assessment.repository.RoleRepository;
import com.assessment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    
//    @Autowired
//    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Get admin by ID
     */
    public AdminDTO getAdminById(Integer adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        // Verify this is an admin user
        if (admin.getRole() == null || !admin.getRole().getRoleName().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("User is not an admin");
        }
        
        return convertToDTO(admin);
    }
    
    /**
     * Get admin by username
     */
    public AdminDTO getAdminByUsername(String username) {
        User admin = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Admin not found with username: " + username));
        
//        if (admin == null) {
//            throw new RuntimeException("Admin not found with username: " + username);
//        }
        
        // Verify this is an admin user
        if (admin.getRole() == null || !admin.getRole().getRoleName().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("User is not an admin");
        }
        
        return convertToDTO(admin);
    }
    
    /**
     * Update admin profile (email and password)
     */
    @Transactional
    public AdminDTO updateAdminProfile(AdminProfileUpdateDTO updateDTO) {
    	User admin = userRepository.findById(updateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + updateDTO.getUserId()));
        
        // Verify this is an admin
        if (admin.getRole() == null || !admin.getRole().getRoleName().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("User is not an admin");
        }
        
        // Update email if provided
        if (updateDTO.getUserEmail() != null && !updateDTO.getUserEmail().isEmpty()) {
            admin.setUserEmail(updateDTO.getUserEmail());
        }
        
        // Update password if provided
        if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {
            admin.setUserPasswordHash(passwordEncoder.encode(updateDTO.getNewPassword()));
        }
        
        // Save updated admin
        admin = userRepository.save(admin);
        
        return convertToDTO(admin);
    }
    
    /**
     * Convert User entity to AdminDTO
     */
    private AdminDTO convertToDTO(User user) {
        AdminDTO dto = new AdminDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setUserEmail(user.getUserEmail());
        dto.setUserFirstName(user.getUserFirstName());
        dto.setUserLastName(user.getUserLastName());
        dto.setUserMobileNumber(user.getUserMobileNumber());
        dto.setUserDob(user.getUserDob());
        dto.setUserGender(user.getUserGender());
        dto.setUserCreatedAt(user.getUserCreatedAt());
        dto.setUserLastLogin(user.getUserLastLogin());
        return dto;
    }
    
    /**
     * Verify password
     */
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
    	return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}