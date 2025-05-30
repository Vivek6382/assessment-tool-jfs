package com.assessment.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AdminDTO {
    private Integer userId;
    private String username;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String userMobileNumber;
    private LocalDate userDob;
    private String userGender;
    private LocalDateTime userCreatedAt;
    private LocalDateTime userLastLogin;
    
    // Default constructor
    public AdminDTO() {}
    
    // Getters and setters
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getUserEmail() {
        return userEmail;
    }
    
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    
    public String getUserFirstName() {
        return userFirstName;
    }
    
    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }
    
    public String getUserLastName() {
        return userLastName;
    }
    
    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }
    
    public String getUserMobileNumber() {
        return userMobileNumber;
    }
    
    public void setUserMobileNumber(String userMobileNumber) {
        this.userMobileNumber = userMobileNumber;
    }
    
    public LocalDate getUserDob() {
        return userDob;
    }
    
    public void setUserDob(LocalDate userDob) {
        this.userDob = userDob;
    }
    
    public String getUserGender() {
        return userGender;
    }
    
    public void setUserGender(String userGender) {
        this.userGender = userGender;
    }
    
    public LocalDateTime getUserCreatedAt() {
        return userCreatedAt;
    }
    
    public void setUserCreatedAt(LocalDateTime userCreatedAt) {
        this.userCreatedAt = userCreatedAt;
    }
    
    public LocalDateTime getUserLastLogin() {
        return userLastLogin;
    }
    
    public void setUserLastLogin(LocalDateTime userLastLogin) {
        this.userLastLogin = userLastLogin;
    }
}