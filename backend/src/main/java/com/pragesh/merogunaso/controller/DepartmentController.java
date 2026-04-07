package com.pragesh.merogunaso.controller;

import com.pragesh.merogunaso.entity.Department;
import com.pragesh.merogunaso.service.DepartmentService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    // Public endpoint so complaint form can fetch departments
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable ObjectId id) {
        return departmentService.getDepartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Only SUPER_ADMIN can create, update, delete
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable ObjectId id, @RequestBody Department department) {
        Department updated = departmentService.updateDepartment(id, department);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable ObjectId id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
}
