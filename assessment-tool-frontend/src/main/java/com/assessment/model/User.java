package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	 private Integer userId;
	    private String username;
	    private String userEmail;
	    private String userFirstName;
	    private String userLastName;
	    private String userMobileNumber;
	    private String userStatus;
	    private LocalDate userDob;
	    private String userGender;
	    private String userDepartment;
	    private String userHighestQualification;
	    private LocalDateTime userLastLogin;
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
		public String getUserStatus() {
			return userStatus;
		}
		public void setUserStatus(String userStatus) {
			this.userStatus = userStatus;
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
		public String getUserDepartment() {
			return userDepartment;
		}
		public void setUserDepartment(String userDepartment) {
			this.userDepartment = userDepartment;
		}
		public String getUserHighestQualification() {
			return userHighestQualification;
		}
		public void setUserHighestQualification(String userHighestQualification) {
			this.userHighestQualification = userHighestQualification;
		}
		public LocalDateTime getUserLastLogin() {
			return userLastLogin;
		}
		public void setUserLastLogin(LocalDateTime userLastLogin) {
			this.userLastLogin = userLastLogin;
		}
		public User(Integer userId, String username, String userEmail, String userFirstName, String userLastName,
				String userMobileNumber, String userStatus, LocalDate userDob, String userGender, String userDepartment,
				String userHighestQualification, LocalDateTime userLastLogin) {
			super();
			this.userId = userId;
			this.username = username;
			this.userEmail = userEmail;
			this.userFirstName = userFirstName;
			this.userLastName = userLastName;
			this.userMobileNumber = userMobileNumber;
			this.userStatus = userStatus;
			this.userDob = userDob;
			this.userGender = userGender;
			this.userDepartment = userDepartment;
			this.userHighestQualification = userHighestQualification;
			this.userLastLogin = userLastLogin;
		}
		public User() {
			super();
			// TODO Auto-generated constructor stub
		}
    
    
} 