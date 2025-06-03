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
@Table(name = "questions")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;
    
    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;
    
    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;
    
    @ManyToOne
    @JoinColumn(name = "question_type_id")
    private QuestionType questionType;
    
    @Column(name = "question_marks")
    private Integer questionMarks;
    
    @Column(name = "max_word_count")
    private Integer maxWordCount;
    
    @Column(name = "requires_manual_grading")
    private Boolean requiresManualGrading;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options;
    
    
    // Shreeni vasu 
    

    // Add this to the class if it has a collection of responses
      @OneToMany(mappedBy = "question")
      @JsonManagedReference(value = "question-response")
      private List<Response> responses;


	public Question(Integer questionId, Assessment assessment, String questionText, QuestionType questionType,
			Integer questionMarks, Integer maxWordCount, Boolean requiresManualGrading, List<QuestionOption> options,
			List<Response> responses) {
		super();
		this.questionId = questionId;
		this.assessment = assessment;
		this.questionText = questionText;
		this.questionType = questionType;
		this.questionMarks = questionMarks;
		this.maxWordCount = maxWordCount;
		this.requiresManualGrading = requiresManualGrading;
		this.options = options;
		this.responses = responses;
	}


	public Question() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Integer getQuestionId() {
		return questionId;
	}


	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}


	public Assessment getAssessment() {
		return assessment;
	}


	public void setAssessment(Assessment assessment) {
		this.assessment = assessment;
	}


	public String getQuestionText() {
		return questionText;
	}


	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}


	public QuestionType getQuestionType() {
		return questionType;
	}


	public void setQuestionType(QuestionType questionType) {
		this.questionType = questionType;
	}


	public Integer getQuestionMarks() {
		return questionMarks;
	}


	public void setQuestionMarks(Integer questionMarks) {
		this.questionMarks = questionMarks;
	}


	public Integer getMaxWordCount() {
		return maxWordCount;
	}


	public void setMaxWordCount(Integer maxWordCount) {
		this.maxWordCount = maxWordCount;
	}


	public Boolean getRequiresManualGrading() {
		return requiresManualGrading;
	}


	public void setRequiresManualGrading(Boolean requiresManualGrading) {
		this.requiresManualGrading = requiresManualGrading;
	}


	public List<QuestionOption> getOptions() {
		return options;
	}


	public void setOptions(List<QuestionOption> options) {
		this.options = options;
	}


	public List<Response> getResponses() {
		return responses;
	}


	public void setResponses(List<Response> responses) {
		this.responses = responses;
	}
      
      
       
}