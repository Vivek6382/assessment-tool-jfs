package com.assessment.controller;

import com.assessment.dto.ModuleDTO;
import com.assessment.dto.ModulesDTO;
import com.assessment.exception.ResourceNotFoundException;
import com.assessment.model.Module;
import com.assessment.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController_Syed {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules(
            @RequestParam(required = false) Integer courseId) {
        
        List<ModuleDTO> modules;
        if (courseId != null) {
            modules = moduleService.getModulesByCourse(courseId);
        } else {
            modules = moduleService.getAllModules();
        }
        
        if (modules.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModule(@PathVariable Integer id) {
        ModuleDTO module = moduleService.getModuleById(id);
        if (module == null) {
            throw new ResourceNotFoundException("Module with ID " + id + " not found.");
        }
        return ResponseEntity.ok(module);
    }

    @PostMapping
    public ResponseEntity<String> createModule(@RequestBody Module module) {
        Module savedModule = moduleService.saveModule(module);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Module created successfully with ID: " + savedModule.getModuleId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateModule(@PathVariable Integer id, @RequestBody Module module) {
        ModuleDTO existing = moduleService.getModuleById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Module with ID " + id + " not found.");
        }

        module.setModuleId(id);
        ModuleDTO updatedModule = moduleService.updateModule(module);
        return ResponseEntity.ok("Module updated successfully with ID: " + updatedModule.getModuleId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteModule(@PathVariable Integer id) {
        ModuleDTO existing = moduleService.getModuleById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Module with ID " + id + " not found.");
        }

        moduleService.deleteModule(id);
        return ResponseEntity.ok("Module soft deleted successfully (status set to inactive)");
    }
    
    //vasu
    

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ModulesDTO>> getModulesByCourseId(@PathVariable Integer courseId) {
        try {
            List<ModulesDTO> modules = moduleService.getModulesByCourseIdAsDTO(courseId);
            return ResponseEntity.ok(modules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
