package com.assessment.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assessments")
public class Assessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Integer assessmentId;
    
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "module_id")
    private Module module;
    
    @Column(name = "assessment_title")
    private String assessmentTitle;
    
    @Column(name = "assessment_description", columnDefinition = "TEXT")
    private String assessmentDescription;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "assessment_type")
    private String assessmentType;
    
    @Column(name = "assessment_status")
    private String assessmentStatus;
    
    // Add this new field for question ordering
    @Column(name = "question_order")
    private String questionOrder; // Can be: FIXED, RANDOM, DIFFICULTY
    
    
 // Add these fields to your Assessment.java model class
    @Column(name = "instruction_text", columnDefinition = "TEXT")
    private String instructionText;

    @Column(name = "instruction_time_seconds")
    private Integer instructionTimeSeconds;

    @Column(name = "has_instruction_time")
    private Boolean hasInstructionTime;
    
    
    
    
 // Add these fields to your Assessment.java model class
    @Column(name = "assessment_total_marks")
    private Integer assessmentTotalMarks;

    @Column(name = "assessment_passing_score")
    private Integer assessmentPassingScore;

    @Column(name = "passing_score_unit")
    private String passingScoreUnit; // Can be "PERCENT" or "POINTS"
    
    
    
    
 // Add these fields to your Assessment.java model class
    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "assessment_duration_minutes")
    private Integer assessmentDurationMinutes;
    
    
    
    // Syed Anees
    
    @ManyToOne
    @JoinColumn(name = "assessment_creator_id")
    private User creator;
    
}