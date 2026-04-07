package com.pragesh.merogunaso.dto;

import com.pragesh.merogunaso.entity.Role;

public class AuthResponse {
    private String id;
    private String email;
    private String name;
    private Role role;
    private String departmentId;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(String id, String email, String name, Role role, String departmentId, String token) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.departmentId = departmentId;
        this.token = token;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
