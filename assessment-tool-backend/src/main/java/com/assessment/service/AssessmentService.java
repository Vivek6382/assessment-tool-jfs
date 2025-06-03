package com.assessment.service;

import com.assessment.dto.AssessmentDTO;
import com.assessment.model.Assessment;
import com.assessment.model.Question;
import com.assessment.repository.AssessmentRepository;
import com.assessment.repository.QuestionRepository;
import com.assessment.repository.QuestionTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionTypeRepository questionTypeRepository;

	@Autowired
	private AssessmentRepository assessmentRepository;

	/**
	 * Get all assessments
	 */
	public List<Assessment> getAllAssessments() {
		return assessmentRepository.findAll();
	}

	/**
	 * Get assessment by ID
	 */
	public Optional<Assessment> getAssessmentById(Integer id) {
		return assessmentRepository.findById(id);
	}

	/**
	 * Save or update an assessment
	 */
	public Assessment saveAssessment(Assessment assessment) {
		return assessmentRepository.save(assessment);
	}

	/**
	 * Delete an assessment
	 */
	public void deleteAssessment(Integer id) {
		assessmentRepository.deleteById(id);
	}

	/**
	 * Get assessments by module ID
	 */
	public List<Assessment> getAssessmentsByModuleId(Integer moduleId) {
		return assessmentRepository.findByModuleModuleId(moduleId);
	}

	/**
	 * Get assessments by status
	 */
	public List<Assessment> getAssessmentsByStatus(String status) {
		return assessmentRepository.findByAssessmentStatus(status);
	}

//    For the Test set

	// In AssessmentService.java, add this method:
	public Assessment updateQuestionOrder(Integer assessmentId, String questionOrder) {
		Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
		if (!assessmentOpt.isPresent()) {
			throw new RuntimeException("Assessment not found with ID: " + assessmentId);
		}

		Assessment assessment = assessmentOpt.get();
		assessment.setQuestionOrder(questionOrder);
		return assessmentRepository.save(assessment);
	}

//  For the Test start page

	public Assessment updateTestStartSettings(Integer assessmentId, String instructionText, Boolean hasInstructionTime,
			Integer instructionTimeSeconds) {
		Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
		if (assessmentOpt.isPresent()) {
			Assessment assessment = assessmentOpt.get();
			assessment.setInstructionText(instructionText);
			assessment.setHasInstructionTime(hasInstructionTime);
			assessment.setInstructionTimeSeconds(instructionTimeSeconds);
			return assessmentRepository.save(assessment);
		} else {
			throw new RuntimeException("Assessment not found with ID: " + assessmentId);
		}
	}

//    For the grading and summary

	// AssessmentService.java - Add these methods

	public Map<String, Object> getGradingSummary(Integer assessmentId) {
		Map<String, Object> response = new HashMap<>();
		try {
			Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
			if (assessmentOpt.isPresent()) {
				Assessment assessment = assessmentOpt.get();

				// Always calculate fresh total marks from questions
				Integer totalMarks = questionRepository.sumQuestionMarksByAssessmentId(assessmentId);
				if (totalMarks == null)
					totalMarks = 0;

				// Ensure assessment has correct total marks
				assessment.setAssessmentTotalMarks(totalMarks);
				assessmentRepository.save(assessment);

				// Count manual grading questions
				Long manualGradingCount = questionRepository
						.countByAssessmentAssessmentIdAndRequiresManualGrading(assessmentId, true);

				response.put("success", true);
				response.put("assessmentId", assessment.getAssessmentId());
				response.put("assessmentTitle", assessment.getAssessmentTitle());
				response.put("totalMarks", totalMarks);
				response.put("assessmentPassingScore",
						assessment.getAssessmentPassingScore() != null ? assessment.getAssessmentPassingScore() : 1);
				response.put("passingScoreUnit",
						assessment.getPassingScoreUnit() != null ? assessment.getPassingScoreUnit() : "POINTS");
				response.put("manualGradingCount", manualGradingCount);

				return response;
			} else {
				response.put("success", false);
				response.put("error", "Assessment not found");
				return response;
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("error", "Error retrieving grading summary");
			return response;
		}
	}

	public Map<String, Object> saveGradingSummary(Integer assessmentId, Integer passingScore, String unit) {
		Map<String, Object> response = new HashMap<>();
		try {
			if (passingScore == null || unit == null) {
				response.put("success", false);
				response.put("error", "Passing score and unit are required");
				return response;
			}

			Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
			if (assessmentOpt.isPresent()) {
				Assessment assessment = assessmentOpt.get();

				// Get total marks
				Integer totalMarks = questionRepository.sumQuestionMarksByAssessmentId(assessmentId);
				if (totalMarks == null)
					totalMarks = 0;

				// For points unit, validate against total marks
				if ("POINTS".equals(unit)) {
					if (passingScore < 0) {
						response.put("success", false);
						response.put("error", "Passing score cannot be negative");
						return response;
					}
					if (passingScore > totalMarks) {
						response.put("success", false);
						response.put("error", "Passing score cannot exceed total marks (" + totalMarks + "p)");
						return response;
					}
				}

				// For percent unit, standard validation
				if ("PERCENT".equals(unit)) {
					if (passingScore < 0 || passingScore > 100) {
						response.put("success", false);
						response.put("error", "Percentage must be between 0-100");
						return response;
					}
					// Convert percentage to points
					passingScore = (int) Math.round((passingScore / 100.0) * totalMarks);
					unit = "POINTS"; // Store as points in database
				}

				assessment.setAssessmentPassingScore(passingScore);
				assessment.setPassingScoreUnit(unit);
				assessment.setAssessmentTotalMarks(totalMarks);

				assessmentRepository.save(assessment);

				response.put("success", true);
				response.put("message", "Grading summary saved successfully");
				response.put("totalMarks", totalMarks);
				return response;
			} else {
				response.put("success", false);
				response.put("error", "Assessment not found");
				return response;
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("error", "Error saving grading summary");
			return response;
		}
	}

//  For the Time Settings

	public Map<String, Object> saveTimeSettings(Integer assessmentId, String duration, LocalDateTime startDate,
			LocalDateTime endDate) {
		Map<String, Object> response = new HashMap<>();

		try {
			Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
			if (assessmentOpt.isPresent()) {
				Assessment assessment = assessmentOpt.get();

				// Convert HH:MM duration to minutes
				String[] durationParts = duration.split(":");
				int hours = Integer.parseInt(durationParts[0]);
				int minutes = Integer.parseInt(durationParts[1]);
				int totalMinutes = (hours * 60) + minutes;

				// Update assessment fields
				assessment.setAssessmentDurationMinutes(totalMinutes);
				assessment.setStartDate(startDate);
				assessment.setEndDate(endDate);

				// Save to database
				assessmentRepository.save(assessment);

				response.put("success", true);
				response.put("message", "Time settings saved successfully");
			} else {
				response.put("success", false);
				response.put("error", "Assessment not found with ID: " + assessmentId);
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("error", "Error saving time settings: " + e.getMessage());
		}

		return response;
	}
	
	
	
	
    // For The Test Info page 
	
	
	
	// Add to AssessmentService.java
	 // Add this method if you need it elsewhere in AssessmentService
    public int getQuestionCountByAssessmentId(Integer assessmentId) {
        return questionRepository.countByAssessmentId(assessmentId);
    }

    // Add this method if you need it elsewhere in AssessmentService
    public Integer calculateTotalMarksByAssessmentId(Integer assessmentId) {
        return questionRepository.calculateTotalMarksByAssessmentId(assessmentId);
    }


    public boolean activateAssessment(Integer assessmentId) {
        Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
        if (assessmentOpt.isPresent()) {
            Assessment assessment = assessmentOpt.get();
            
            // Calculate total marks if not set
            if (assessment.getAssessmentTotalMarks() == null) {
                Integer totalMarks = questionRepository.calculateTotalMarksByAssessmentId(assessmentId);
                assessment.setAssessmentTotalMarks(totalMarks);
            }
            
            assessment.setAssessmentStatus("active");
            assessmentRepository.save(assessment);
            return true;
        }
        return false;
    }

    
    
    
//    For Session
    
    
//    Syed Anees
    
    
    public void markAssessmentInactive(Integer assessmentId) {
        Optional<Assessment> optionalAssessment = assessmentRepository.findById(assessmentId);
        if (optionalAssessment.isPresent()) {
            Assessment assessment = optionalAssessment.get();
            assessment.setAssessmentStatus("inactive");
            assessmentRepository.save(assessment);
        } else {
            throw new RuntimeException("Assessment not found");
        }
    }
    
    
    
    // Shreeni vasu
    
    
    /**
     * Get assessments by module ID as DTOs
     */
    public List<AssessmentDTO> getAssessmentsByModuleIdAsDTO(Integer moduleId) {
        return assessmentRepository.findByModuleModuleId(moduleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all assessments as DTOs
     */
    public List<AssessmentDTO> getAllAssessmentsAsDTO() {
        return assessmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    
    /**
     * Convert Assessment entity to AssessmentDTO
     */
    public AssessmentDTO convertToDTO(Assessment assessment) {
        AssessmentDTO dto = new AssessmentDTO();
        dto.setAssessmentId(assessment.getAssessmentId());
        
        // Set module information if available
        if (assessment.getModule() != null) {
            dto.setModuleId(assessment.getModule().getModuleId());
            dto.setModuleName(assessment.getModule().getModuleName());
        }
        
        dto.setAssessmentTitle(assessment.getAssessmentTitle());
        dto.setAssessmentDescription(assessment.getAssessmentDescription());
        
        // Set creator information if available
        if (assessment.getCreator() != null) {
            dto.setCreatorId(assessment.getCreator().getUserId());
            dto.setCreatorName(assessment.getCreator().getUserFirstName() + " " + 
                              assessment.getCreator().getUserLastName());
        }
        
        dto.setAssessmentType(assessment.getAssessmentType());
        dto.setAssessmentDurationMinutes(assessment.getAssessmentDurationMinutes());
        dto.setAssessmentTotalMarks(assessment.getAssessmentTotalMarks());
        dto.setAssessmentPassingScore(assessment.getAssessmentPassingScore());
        dto.setAssessmentStatus(assessment.getAssessmentStatus());
        dto.setStartDate(assessment.getStartDate());
        dto.setEndDate(assessment.getEndDate());
        dto.setInstructionText(assessment.getInstructionText());
        dto.setInstructionTimeMinutes(assessment.getInstructionTimeSeconds());
        dto.setCreatedAt(assessment.getCreatedAt());
        
        return dto;
    }
}