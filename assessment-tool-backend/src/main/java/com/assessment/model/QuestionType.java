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
}