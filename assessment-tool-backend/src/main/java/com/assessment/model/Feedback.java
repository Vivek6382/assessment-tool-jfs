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
    
}