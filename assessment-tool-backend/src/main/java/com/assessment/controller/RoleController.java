package com.assessment.controller;

import com.assessment.dto.RoleDTO;
import com.assessment.model.Role;
import com.assessment.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    public List<RoleDTO> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public RoleDTO getRoleById(@PathVariable Integer id) {
        return roleService.getRoleById(id);
    }

    @PostMapping
    public String addRole(@RequestBody Role role) {
        roleService.saveRole(role);
        return "Role added successfully";
    }

    @PutMapping("/{id}")
    public String updateRole(@PathVariable Integer id, @RequestBody Role role) {
        roleService.updateRole(id, role);
        return "Role updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
        return "Role deleted successfully";
    }
}
