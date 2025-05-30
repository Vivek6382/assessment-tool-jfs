package com.assessment.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "results")
public class Result {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Integer resultId;
    
    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @Column(name = "total_marks")
    private Integer totalMarks;
    
    @Column(name = "obtained_marks")
    private Integer obtainedMarks;
    
    @Column(name = "result_percentage")
    private Float resultPercentage;
    
    @Column(name = "result_status")
    private String resultStatus;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @OneToMany(mappedBy = "result")
    private List<Feedback> feedback;
    
}