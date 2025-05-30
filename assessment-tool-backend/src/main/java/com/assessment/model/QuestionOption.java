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

}