package com.assessment.dto;

import java.time.LocalDateTime;

public class EducatorDTO {
    private Integer userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private String userStatus;
    private int studentCount;
    private LocalDateTime userCreatedAt;
    private LocalDateTime userLastLogin;
    
    public EducatorDTO() {}
    
    public EducatorDTO(Integer userId, String userFirstName, String userLastName, 
                       String userEmail, String userStatus, int studentCount,
                       LocalDateTime userCreatedAt, LocalDateTime userLastLogin) {
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userEmail = userEmail;
        this.userStatus = userStatus;
        this.studentCount = studentCount;
        this.userCreatedAt = userCreatedAt;
        this.userLastLogin = userLastLogin;
    }

    // Getters and setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
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
