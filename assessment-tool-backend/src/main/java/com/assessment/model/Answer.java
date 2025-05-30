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
}