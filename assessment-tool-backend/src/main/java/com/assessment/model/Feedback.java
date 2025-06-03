package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Integer feedbackId;
    
    @ManyToOne
    @JoinColumn(name = "result_id")
    private Result result;
    
    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;
    
    @ManyToOne
    @JoinColumn(name = "feedback_generated_by")
    private User feedbackGenerator;
    
    @Column(name = "feedback_date")
    private LocalDateTime feedbackDate;

	public Integer getFeedbackId() {
		return feedbackId;
	}

	public void setFeedbackId(Integer feedbackId) {
		this.feedbackId = feedbackId;
	}

	public Result getResult() {
		return result;
	}

	public void setResult(Result result) {
		this.result = result;
	}

	public String getFeedbackText() {
		return feedbackText;
	}

	public void setFeedbackText(String feedbackText) {
		this.feedbackText = feedbackText;
	}

	public User getFeedbackGenerator() {
		return feedbackGenerator;
	}

	public void setFeedbackGenerator(User feedbackGenerator) {
		this.feedbackGenerator = feedbackGenerator;
	}

	public LocalDateTime getFeedbackDate() {
		return feedbackDate;
	}

	public void setFeedbackDate(LocalDateTime feedbackDate) {
		this.feedbackDate = feedbackDate;
	}

	public Feedback(Integer feedbackId, Result result, String feedbackText, User feedbackGenerator,
			LocalDateTime feedbackDate) {
		super();
		this.feedbackId = feedbackId;
		this.result = result;
		this.feedbackText = feedbackText;
		this.feedbackGenerator = feedbackGenerator;
		this.feedbackDate = feedbackDate;
	}

	public Feedback() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
    
}