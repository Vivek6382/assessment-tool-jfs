package com.assessment.dto;

import java.util.ArrayList;
import java.util.List;

public class EducatorRegistrationRequest {
    
    private List<EducatorRegistrationDTO> educators = new ArrayList<>();
    
    public List<EducatorRegistrationDTO> getEducators() {
        return educators;
    }
    
    public void setEducators(List<EducatorRegistrationDTO> educators) {
        this.educators = educators;
    }
}