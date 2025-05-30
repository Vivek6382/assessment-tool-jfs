package com.assessment.service;

import com.assessment.dto.RoleDTO;
import com.assessment.model.Role;
import com.assessment.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RoleDTO getRoleById(Integer id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.map(this::convertToDTO).orElse(null);
    }

    public void saveRole(Role role) {
        roleRepository.save(role);
    }

    public void updateRole(Integer id, Role role) {
        role.setRoleId(id);
        roleRepository.save(role);
    }

    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }

    private RoleDTO convertToDTO(Role role) {
        return new RoleDTO(role.getRoleId(), role.getRoleName());
    }
}
