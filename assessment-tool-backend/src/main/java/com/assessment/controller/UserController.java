package com.assessment.controller;

import com.assessment.dto.LoginRequest;
import com.assessment.dto.LoginResponse;
import com.assessment.dto.UserDTO;
import com.assessment.model.User;
import com.assessment.repository.UserRepository;
import com.assessment.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }
    
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable Integer roleId) {
        List<UserDTO> users = userService.getUsersByRole(roleId);
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public String addUser(@RequestBody User user) {
        userService.saveUser(user);
        return "User added successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Integer id, @RequestBody User user) {
        try {
            userService.updateUser(id, user);
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update user: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
            
            // Check if user is an educator (role_id = 2)
//            if (user.getRole().getRoleId() != 1) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                    .body("Access restricted to educators only");
//            }
            
            // Create and return response with user details
            LoginResponse response = new LoginResponse(
                user.getUserId(),
                user.getUsername(),
                user.getRole().getRoleName()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
        @RequestParam String email,
        @RequestParam String newPassword) {
        
        User user = userRepository.findByUserEmail(email);
        user.setUserPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok("Password updated");
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
        @RequestBody Map<String, String> request) {
        
        try {
            String email = request.get("email");
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            // Validate inputs
            if (email == null || currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }
            
            User user = userRepository.findByUserEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getUserPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Current password is incorrect");
            }
            
            // Update password
            user.setUserPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            return ResponseEntity.ok("Password updated successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error changing password: " + e.getMessage());
        }
    }
}
