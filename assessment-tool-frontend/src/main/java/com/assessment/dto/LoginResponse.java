package com.assessment.dto;

public class LoginResponse {
    private Integer userId;
    private String username;
    private String role;
    
    // getters and setters
    public LoginResponse() {
		super();
		// TODO Auto-generated constructor stub
	}
	public LoginResponse(Integer userId, String username, String role) {
		super();
		this.userId = userId;
		this.username = username;
		this.role = role;
	}
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
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
}