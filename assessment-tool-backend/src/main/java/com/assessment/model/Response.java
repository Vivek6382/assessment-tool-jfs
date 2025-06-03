package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "responses")
public class Response {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "response_id")
    private Integer responseId;
    
    @ManyToOne
    @JoinColumn(name = "option_id")
    @JsonBackReference(value = "option-response")
    private QuestionOption option;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonBackReference(value = "student-response")
    private User student;
    
    @Column(name = "response_text", columnDefinition = "TEXT")
    private String responseText;
    
    @Column(name = "is_response_correct")
    private Boolean isResponseCorrect;
    
    @Column(name = "marks_obtained")
    private Integer marksObtained;
    
    @Column(name = "response_timestamp")
    private LocalDateTime responseTimestamp;
    
    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonBackReference(value = "question-response")
    private Question question;

	public Integer getResponseId() {
		return responseId;
	}

	public void setResponseId(Integer responseId) {
		this.responseId = responseId;
	}

	public QuestionOption getOption() {
		return option;
	}

	public void setOption(QuestionOption option) {
		this.option = option;
	}

	public User getStudent() {
		return student;
	}

	public void setStudent(User student) {
		this.student = student;
	}

	public String getResponseText() {
		return responseText;
	}

	public void setResponseText(String responseText) {
		this.responseText = responseText;
	}

	public Boolean getIsResponseCorrect() {
		return isResponseCorrect;
	}

	public void setIsResponseCorrect(Boolean isResponseCorrect) {
		this.isResponseCorrect = isResponseCorrect;
	}

	public Integer getMarksObtained() {
		return marksObtained;
	}

	public void setMarksObtained(Integer marksObtained) {
		this.marksObtained = marksObtained;
	}

	public LocalDateTime getResponseTimestamp() {
		return responseTimestamp;
	}

	public void setResponseTimestamp(LocalDateTime responseTimestamp) {
		this.responseTimestamp = responseTimestamp;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public Response(Integer responseId, QuestionOption option, User student, String responseText,
			Boolean isResponseCorrect, Integer marksObtained, LocalDateTime responseTimestamp, Question question) {
		super();
		this.responseId = responseId;
		this.option = option;
		this.student = student;
		this.responseText = responseText;
		this.isResponseCorrect = isResponseCorrect;
		this.marksObtained = marksObtained;
		this.responseTimestamp = responseTimestamp;
		this.question = question;
	}

	public Response() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}