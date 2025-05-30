package com.assessment.dto;

public class DashboardStatsDTO {
    private Long totalEducators;
    private Long activeEducators;
    private Long activeStudents;
    private Long totalStudents;
    
    public DashboardStatsDTO() {}
    
    public DashboardStatsDTO(Long totalEducators, Long activeEducators, 
                            Long activeStudents, Long totalStudents) {
        this.totalEducators = totalEducators;
        this.activeEducators = activeEducators;
        this.activeStudents = activeStudents;
        this.totalStudents = totalStudents;
    }

    public Long getActiveStudents() {
		return activeStudents;
	}

	public void setActiveStudents(Long activeStudents) {
		this.activeStudents = activeStudents;
	}

	public Long getTotalEducators() {
        return totalEducators;
    }

    public void setTotalEducators(Long totalEducators) {
        this.totalEducators = totalEducators;
    }

    public Long getActiveEducators() {
        return activeEducators;
    }

    public void setActiveEducators(Long activeEducators) {
        this.activeEducators = activeEducators;
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }
}