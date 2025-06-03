package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "results")
public class Result {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Integer resultId;
    
    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @Column(name = "total_marks")
    private Integer totalMarks;
    
    @Column(name = "obtained_marks")
    private Integer obtainedMarks;
    
    @Column(name = "result_percentage")
    private Float resultPercentage;
    
    @Column(name = "result_status")
    private String resultStatus;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @OneToMany(mappedBy = "result")
    private List<Feedback> feedback;

	public Integer getResultId() {
		return resultId;
	}

	public void setResultId(Integer resultId) {
		this.resultId = resultId;
	}

	public Assessment getAssessment() {
		return assessment;
	}

	public void setAssessment(Assessment assessment) {
		this.assessment = assessment;
	}

	public User getStudent() {
		return student;
	}

	public void setStudent(User student) {
		this.student = student;
	}

	public Integer getTotalMarks() {
		return totalMarks;
	}

	public void setTotalMarks(Integer totalMarks) {
		this.totalMarks = totalMarks;
	}

	public Integer getObtainedMarks() {
		return obtainedMarks;
	}

	public void setObtainedMarks(Integer obtainedMarks) {
		this.obtainedMarks = obtainedMarks;
	}

	public Float getResultPercentage() {
		return resultPercentage;
	}

	public void setResultPercentage(Float resultPercentage) {
		this.resultPercentage = resultPercentage;
	}

	public String getResultStatus() {
		return resultStatus;
	}

	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus;
	}

	public LocalDateTime getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(LocalDateTime completedDate) {
		this.completedDate = completedDate;
	}

	public List<Feedback> getFeedback() {
		return feedback;
	}

	public void setFeedback(List<Feedback> feedback) {
		this.feedback = feedback;
	}

	public Result(Integer resultId, Assessment assessment, User student, Integer totalMarks, Integer obtainedMarks,
			Float resultPercentage, String resultStatus, LocalDateTime completedDate, List<Feedback> feedback) {
		super();
		this.resultId = resultId;
		this.assessment = assessment;
		this.student = student;
		this.totalMarks = totalMarks;
		this.obtainedMarks = obtainedMarks;
		this.resultPercentage = resultPercentage;
		this.resultStatus = resultStatus;
		this.completedDate = completedDate;
		this.feedback = feedback;
	}

	public Result() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
    
}