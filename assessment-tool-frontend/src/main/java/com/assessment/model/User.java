package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    
    
} 