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
}