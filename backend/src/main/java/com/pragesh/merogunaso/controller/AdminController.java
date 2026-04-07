package com.pragesh.merogunaso.controller;

import com.pragesh.merogunaso.dto.AdminUserDto;
import com.pragesh.merogunaso.service.AdminUserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@PreAuthorize("hasRole('SUPER_ADMIN')") // Secures ALL endpoints in this controller
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserDto>> getAllAdmins() {
        return ResponseEntity.ok(adminUserService.getAllAdmins());
    }

    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody AdminUserDto adminUserDto) {
        try {
            return ResponseEntity.ok(adminUserService.createAdmin(adminUserDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminUserDto> updateAdmin(@PathVariable ObjectId id, @RequestBody AdminUserDto adminUserDto) {
        return adminUserService.updateAdmin(id, adminUserDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable ObjectId id) {
        adminUserService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }
}
