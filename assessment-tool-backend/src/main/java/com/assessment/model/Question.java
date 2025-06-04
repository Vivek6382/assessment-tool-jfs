package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
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
       
}