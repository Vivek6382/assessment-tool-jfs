package com.assessment.service;

import com.assessment.dto.AssessmentDTO;
import com.assessment.dto.ModuleDTO;
import com.assessment.dto.ModulesDTO;
import com.assessment.exception.InvalidModuleDataException;
import com.assessment.exception.ResourceNotFoundException;
//import com.assessment.model.Assessment;
import com.assessment.model.Module;
import com.assessment.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModuleService {

	@Autowired
	private ModuleRepository moduleRepository;

	/**
	 * Get all modules
	 */
	public List<Module> getAllAssessmentModules() { // Changed method name
		return moduleRepository.findAll();
	}

	/**
	 * Get all modules as DTOs (for API responses)
	 */
	public List<ModuleDTO> getAllAssessmentModulesAsDTO() { // Changed method name
		return moduleRepository.findAll().stream().map(this::convertAssessmentModuleToDTO) // Changed method call
				.collect(Collectors.toList());
	}

	/**
	 * Get module by ID
	 */
	public Optional<Module> getAssessmentModuleById(Integer id) { // Changed method name
		return moduleRepository.findById(id);
	}

	/**
	 * Get module by ID as DTO
	 */
	public ModuleDTO getAssessmentModuleByIdAsDTO(Integer id) { // Changed method name
		return moduleRepository.findById(id).map(this::convertAssessmentModuleToDTO) // Changed method call
				.orElse(null);
	}

	/**
	 * Save or update a module
	 */
	public Module saveAssessmentModule(Module module) { // Changed method name
		return moduleRepository.save(module);
	}

	/**
	 * Delete a module
	 */
	public void deleteAssessmentModule(Integer id) { // Changed method name
		moduleRepository.deleteById(id);
	}

	/**
	 * Convert Module entity to ModuleDTO
	 */
	private ModuleDTO convertAssessmentModuleToDTO(Module module) { // Changed method name
		ModuleDTO dto = new ModuleDTO();
		dto.setModuleId(module.getModuleId());
		dto.setModuleName(module.getModuleName());
		return dto;
	}

	/**
	 * Convert ModuleDTO to Module entity (for API requests)
	 */
	public Module convertAssessmentModuleToEntity(ModuleDTO dto) { // Changed method name
		Module module = new Module();
		module.setModuleId(dto.getModuleId());
		module.setModuleName(dto.getModuleName());
		return module;
	}

//    Syed Anees

    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ModuleDTO> getModulesByCourse(Integer courseId) {
        return moduleRepository.findByCourse_CourseId(courseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ModuleDTO getModuleById(Integer id) {
        return moduleRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with ID: " + id));
    }

    public Module saveModule(Module module) {
        if (module.getModuleName() == null || module.getModuleName().trim().isEmpty()) {
            throw new InvalidModuleDataException("Module name must not be empty.");
        }
        return moduleRepository.save(module);
    }

    public ModuleDTO updateModule(Module module) {
        Integer id = module.getModuleId();
        if (id == null || !moduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot update. Module not found with ID: " + id);
        }

        if (module.getModuleName() == null || module.getModuleName().trim().isEmpty()) {
            throw new InvalidModuleDataException("Module name must not be empty.");
        }

        Module updatedModule = moduleRepository.save(module);
        return convertToDTO(updatedModule);
    }

    public void deleteModule(Integer id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with ID: " + id));
        module.setModuleStatus("inactive");
        moduleRepository.save(module);
    }

    //vasu
    
    public List<ModulesDTO> getModulesByCourseIdAsDTO(Integer courseId) {
        return moduleRepository.findByCourseCourseId(courseId).stream()
                .map(this::convertToDTOs)
                .collect(Collectors.toList());
    }
    public ModulesDTO convertToDTOs(Module module) {
        ModulesDTO dto = new ModulesDTO();
        dto.setModuleId(module.getModuleId());
        dto.setModuleName(module.getModuleName());
        // Don't set other fields since they don't exist in Module entity
        return dto;
    }
    private ModuleDTO convertToDTO(Module module) {
        if (module == null) {
            return null;
        }

        ModuleDTO dto = new ModuleDTO();
        dto.setModuleId(module.getModuleId());
        dto.setModuleName(module.getModuleName());

        if (module.getCourse() != null) {
            dto.setCourseId(module.getCourse().getCourseId());
        }

        dto.setModuleSequenceOrder(module.getModuleSequenceOrder());
        dto.setStartDate(module.getStartDate());
        dto.setEndDate(module.getEndDate());
        dto.setModuleStatus(module.getModuleStatus());

        if (module.getAssessments() != null && !module.getAssessments().isEmpty()) {
            List<AssessmentDTO> assessmentDTOs = module.getAssessments().stream()
                .map(a -> {
                    AssessmentDTO assessmentDTO = new AssessmentDTO();
                    assessmentDTO.setAssessmentId(a.getAssessmentId());
                    assessmentDTO.setModuleId(module.getModuleId());
                    assessmentDTO.setModuleName(module.getModuleName());
                    assessmentDTO.setAssessmentTitle(a.getAssessmentTitle());
                    assessmentDTO.setAssessmentDescription(a.getAssessmentDescription());
                    
                    // Set creator information if available
                    if (a.getCreator() != null) {
                        assessmentDTO.setCreatorId(a.getCreator().getUserId());
                    }
                    
                    assessmentDTO.setAssessmentType(a.getAssessmentType());
                    assessmentDTO.setAssessmentStatus(a.getAssessmentStatus());
                    assessmentDTO.setQuestionOrder(a.getQuestionOrder());
                    assessmentDTO.setInstructionText(a.getInstructionText());
                    assessmentDTO.setInstructionTimeSeconds(a.getInstructionTimeSeconds());
                    assessmentDTO.setHasInstructionTime(a.getHasInstructionTime());
                    assessmentDTO.setAssessmentTotalMarks(a.getAssessmentTotalMarks());
                    assessmentDTO.setAssessmentPassingScore(a.getAssessmentPassingScore());
                    assessmentDTO.setPassingScoreUnit(a.getPassingScoreUnit());
                    assessmentDTO.setStartDate(a.getStartDate());
                    assessmentDTO.setEndDate(a.getEndDate());
                    assessmentDTO.setAssessmentDurationMinutes(a.getAssessmentDurationMinutes());
                    
                    return assessmentDTO;
                })
                .collect(Collectors.toList());
            dto.setAssessments(assessmentDTOs);
        }

        return dto;
    }

}