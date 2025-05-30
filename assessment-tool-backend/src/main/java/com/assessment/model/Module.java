package com.assessment.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "modules")
public class Module {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private Integer moduleId;
    
    @Column(name = "module_name")
    private String moduleName;
    
    
    // Syed Anees 
    

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    
    @Column(name = "module_sequence_order")
    private Integer moduleSequenceOrder;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "module_status")
    private String moduleStatus;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    
    @OneToMany(mappedBy = "module", fetch = FetchType.EAGER)  // Add fetch type EAGER
    @JsonIgnore
    private List<Assessment> assessments;
}