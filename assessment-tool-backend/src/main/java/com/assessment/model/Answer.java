package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answers")
public class Answer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer answerId;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "option_id")
    private QuestionOption option;
    
    @Column(name = "correct_answer_text", columnDefinition = "TEXT")
    private String correctAnswerText;
    
    @Column(name = "points")
    private Integer points;

	public Integer getAnswerId() {
		return answerId;
	}

	public void setAnswerId(Integer answerId) {
		this.answerId = answerId;
	}

	public QuestionOption getOption() {
		return option;
	}

	public void setOption(QuestionOption option) {
		this.option = option;
	}

	public String getCorrectAnswerText() {
		return correctAnswerText;
	}

	public void setCorrectAnswerText(String correctAnswerText) {
		this.correctAnswerText = correctAnswerText;
	}

	public Integer getPoints() {
		return points;
	}

	public void setPoints(Integer points) {
		this.points = points;
	}

	public Answer(Integer answerId, QuestionOption option, String correctAnswerText, Integer points) {
		super();
		this.answerId = answerId;
		this.option = option;
		this.correctAnswerText = correctAnswerText;
		this.points = points;
	}

	public Answer() {
		super();
		// TODO Auto-generated constructor stub
	}
    
	
}