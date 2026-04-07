package com.pragesh.merogunaso.service;

import com.pragesh.merogunaso.dto.AdminUserDto;
import com.pragesh.merogunaso.entity.AdminUser;
import com.pragesh.merogunaso.repository.AdminUserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<AdminUserDto> getAllAdmins() {
        return adminUserRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AdminUserDto createAdmin(AdminUserDto dto) {
        if (adminUserRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists in system");
        }
        
        AdminUser admin = new AdminUser(
                dto.getName(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getPassword()),
                dto.getRole() != null ? dto.getRole() : com.pragesh.merogunaso.entity.Role.ROLE_ADMIN,
                dto.getDepartmentId()
        );
        AdminUser saved = adminUserRepository.save(admin);
        return mapToDto(saved);
    }

    public Optional<AdminUserDto> updateAdmin(ObjectId id, AdminUserDto updatedDto) {
        return adminUserRepository.findById(id).map(existing -> {
            if (updatedDto.getName() != null) existing.setName(updatedDto.getName());
            if (updatedDto.getEmail() != null) existing.setEmail(updatedDto.getEmail());
            if (updatedDto.getRole() != null) existing.setRole(updatedDto.getRole());
            if (updatedDto.getDepartmentId() != null) existing.setDepartmentId(updatedDto.getDepartmentId());
            if (updatedDto.getPassword() != null && !updatedDto.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(updatedDto.getPassword()));
            }
            
            return mapToDto(adminUserRepository.save(existing));
        });
    }

    public void deleteAdmin(ObjectId id) {
        adminUserRepository.deleteById(id);
    }

    private AdminUserDto mapToDto(AdminUser user) {
        return new AdminUserDto(
                user.getId().toHexString(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getDepartmentId(),
                user.getCreatedAt()
        );
    }
}
