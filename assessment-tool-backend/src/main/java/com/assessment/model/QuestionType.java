package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question_types")
public class QuestionType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_type_id")
    private Integer questionTypeId;
    
    @Column(name = "question_type_name")
    private String questionTypeName;
    
    @JsonIgnore
    @OneToMany(mappedBy = "questionType")
    private List<Question> questions;

	public Integer getQuestionTypeId() {
		return questionTypeId;
	}

	public void setQuestionTypeId(Integer questionTypeId) {
		this.questionTypeId = questionTypeId;
	}

	public String getQuestionTypeName() {
		return questionTypeName;
	}

	public void setQuestionTypeName(String questionTypeName) {
		this.questionTypeName = questionTypeName;
	}

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}

	public QuestionType(Integer questionTypeId, String questionTypeName, List<Question> questions) {
		super();
		this.questionTypeId = questionTypeId;
		this.questionTypeName = questionTypeName;
		this.questions = questions;
	}

	public QuestionType() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}