package com.assessment.controller;

import com.assessment.dto.ModuleDTO;
import com.assessment.model.Module;
import com.assessment.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment-modules")  // Changed from "/api/modules"
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAssessmentModules() {  // Changed method name
        Map<String, Object> response = new HashMap<>();
        try {
            List<ModuleDTO> modules = moduleService.getAllAssessmentModulesAsDTO();  // Changed method call
            response.put("success", true);
            response.put("data", modules);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving modules: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAssessmentModule(@PathVariable Integer id) {  // Changed method name
        Map<String, Object> response = new HashMap<>();
        try {
            ModuleDTO module = moduleService.getAssessmentModuleByIdAsDTO(id);  // Changed method call
            if (module != null) {
                response.put("success", true);
                response.put("data", module);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Module not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error retrieving module: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAssessmentModule(@RequestBody ModuleDTO moduleDTO) {  // Changed method name
        Map<String, Object> response = new HashMap<>();
        try {
            Module module = moduleService.convertAssessmentModuleToEntity(moduleDTO);  // Changed method call
            Module savedModule = moduleService.saveAssessmentModule(module);  // Changed method call
            ModuleDTO savedModuleDTO = moduleService.getAssessmentModuleByIdAsDTO(savedModule.getModuleId());  // Changed method call
            
            response.put("success", true);
            response.put("message", "Module created successfully");
            response.put("data", savedModuleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error creating module: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAssessmentModule(@PathVariable Integer id, @RequestBody ModuleDTO moduleDTO) {  // Changed method name
        Map<String, Object> response = new HashMap<>();
        try {
            // Check if module exists
            if (!moduleService.getAssessmentModuleById(id).isPresent()) {  // Changed method call
                response.put("success", false);
                response.put("error", "Module not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            moduleDTO.setModuleId(id);
            Module module = moduleService.convertAssessmentModuleToEntity(moduleDTO);  // Changed method call
            Module updatedModule = moduleService.saveAssessmentModule(module);  // Changed method call
            ModuleDTO updatedModuleDTO = moduleService.getAssessmentModuleByIdAsDTO(updatedModule.getModuleId());  // Changed method call
            
            response.put("success", true);
            response.put("message", "Module updated successfully");
            response.put("data", updatedModuleDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error updating module: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAssessmentModule(@PathVariable Integer id) {  // Changed method name
        Map<String, Object> response = new HashMap<>();
        try {
            // Check if module exists
            if (!moduleService.getAssessmentModuleById(id).isPresent()) {  // Changed method call
                response.put("success", false);
                response.put("error", "Module not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            moduleService.deleteAssessmentModule(id);  // Changed method call
            
            response.put("success", true);
            response.put("message", "Module deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Error deleting module: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    //vasu
    
    
}