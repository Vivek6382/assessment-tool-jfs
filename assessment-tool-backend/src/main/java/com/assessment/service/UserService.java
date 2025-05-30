package com.assessment.service;

import com.assessment.dto.UserDTO;
import com.assessment.model.Role;
import com.assessment.model.User;
import com.assessment.repository.RoleRepository;
import com.assessment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (!passwordEncoder.matches(password, user.getUserPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        
        user.setUserLastLogin(LocalDateTime.now()); // update last login
        userRepository.save(user); // persist update
        
        return user;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(this::convertToDTO).orElse(null);
    }
    
    public List<UserDTO> getUsersByRole(Integer roleId) {
        List<User> users = userRepository.findByRole_RoleId(roleId);
        return users.stream()
                   .map(this::convertToDTO)
                   .collect(Collectors.toList());
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public void updateUser(Integer id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (updatedUser.getUsername() != null) {
                existingUser.setUsername(updatedUser.getUsername());
            }
            if (updatedUser.getUserFirstName() != null) {
                existingUser.setUserFirstName(updatedUser.getUserFirstName());
            }
            if (updatedUser.getUserLastName() != null) {
                existingUser.setUserLastName(updatedUser.getUserLastName());
            }
            if (updatedUser.getUserEmail() != null) {
                existingUser.setUserEmail(updatedUser.getUserEmail());
            }
            if (updatedUser.getUserMobileNumber() != null) {
                existingUser.setUserMobileNumber(updatedUser.getUserMobileNumber());
            }
            if (updatedUser.getUserStatus() != null) {
                existingUser.setUserStatus(updatedUser.getUserStatus());
            }
            if (updatedUser.getUserDob() != null) {
                existingUser.setUserDob(updatedUser.getUserDob());
            }
            if (updatedUser.getUserGender() != null) {
                existingUser.setUserGender(updatedUser.getUserGender());
            }
            if (updatedUser.getUserDepartment() != null) {
                existingUser.setUserDepartment(updatedUser.getUserDepartment());
            }
            if (updatedUser.getUserHighestQualification() != null) {
                existingUser.setUserHighestQualification(updatedUser.getUserHighestQualification());
            }

            userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }


    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getUserEmail(),
                user.getUserFirstName(),
                user.getUserLastName(),
                user.getUserMobileNumber(),
                user.getUserStatus(),
                user.getUserDob(),
                user.getUserGender(),
                user.getUserDepartment(),
                user.getUserHighestQualification(),
                user.getUserLastLogin()
        );
    }
}
