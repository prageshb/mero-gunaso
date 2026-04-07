package com.pragesh.merogunaso.dto;

import com.pragesh.merogunaso.entity.Role;
import java.time.LocalDateTime;

public class AdminUserDto {
    private String id;
    private String email;
    private String name;
    private Role role;
    private String departmentId;
    private LocalDateTime createdAt;
    private String password; // Only used when POSTing/PUTting from frontend, never sent BACK!

    public AdminUserDto() {
    }

    public AdminUserDto(String id, String email, String name, Role role, String departmentId, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.departmentId = departmentId;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
