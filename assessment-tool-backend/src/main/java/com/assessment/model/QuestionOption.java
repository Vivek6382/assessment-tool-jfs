package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question_options")
public class QuestionOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Integer optionId;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
    
    @Column(name = "option_text", columnDefinition = "TEXT")
    private String optionText;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers;
    
    
    // Shreeni vasu 
    

    // In the QuestionOption class, update the responses collection
       @OneToMany(mappedBy = "option")
       @JsonManagedReference(value = "option-response")
       private List<Response> responses;


	public Integer getOptionId() {
		return optionId;
	}


	public void setOptionId(Integer optionId) {
		this.optionId = optionId;
	}


	public Question getQuestion() {
		return question;
	}


	public void setQuestion(Question question) {
		this.question = question;
	}


	public String getOptionText() {
		return optionText;
	}


	public void setOptionText(String optionText) {
		this.optionText = optionText;
	}


	public Boolean getIsCorrect() {
		return isCorrect;
	}


	public void setIsCorrect(Boolean isCorrect) {
		this.isCorrect = isCorrect;
	}


	public List<Answer> getAnswers() {
		return answers;
	}


	public void setAnswers(List<Answer> answers) {
		this.answers = answers;
	}


	public List<Response> getResponses() {
		return responses;
	}


	public void setResponses(List<Response> responses) {
		this.responses = responses;
	}


	public QuestionOption(Integer optionId, Question question, String optionText, Boolean isCorrect,
			List<Answer> answers, List<Response> responses) {
		super();
		this.optionId = optionId;
		this.question = question;
		this.optionText = optionText;
		this.isCorrect = isCorrect;
		this.answers = answers;
		this.responses = responses;
	}


	public QuestionOption() {
		super();
		// TODO Auto-generated constructor stub
	}
       
       

}