package com.pragesh.merogunaso.controller;

import com.pragesh.merogunaso.entity.AdminUser;
import com.pragesh.merogunaso.entity.Complaint;
import com.pragesh.merogunaso.entity.ComplaintStatus;
import com.pragesh.merogunaso.entity.Role;
import com.pragesh.merogunaso.service.ComplaintService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // Public endpoint to submit a complaint
    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(@RequestBody Complaint complaint) {
        complaint.setId(null);
        complaint.setStatus(ComplaintStatus.NOT_OPENED);
        return ResponseEntity.ok(complaintService.createComplaint(complaint));
    }

    @GetMapping
    public ResponseEntity<?> getComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AdminUser) {
            AdminUser admin = (AdminUser) auth.getPrincipal();
            if (admin.getRole() == Role.ROLE_SUPER_ADMIN) {
                return ResponseEntity.ok(complaintService.getAllComplaints(page, size));
            } else {
                return ResponseEntity.ok(complaintService.getComplaintsByDepartment(admin.getDepartmentId(), page, size));
            }
        }
        
        return ResponseEntity.ok(complaintService.getPublicComplaints(page, size));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getComplaintStats(@RequestParam(required = false) String departmentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String deptId = departmentId;
        
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AdminUser) {
            AdminUser admin = (AdminUser) auth.getPrincipal();
            if (admin.getRole() != Role.ROLE_SUPER_ADMIN) {
                deptId = admin.getDepartmentId();
            }
        }
        
        return ResponseEntity.ok(complaintService.getComplaintStats(deptId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable ObjectId id) {
        return complaintService.getComplaintById(id).map(complaint -> {
            if (complaint.getIsPublic()) return ResponseEntity.ok(complaint);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AdminUser) {
                AdminUser admin = (AdminUser) auth.getPrincipal();
                if (admin.getRole() == Role.ROLE_SUPER_ADMIN || 
                   (admin.getDepartmentId() != null && admin.getDepartmentId().equals(complaint.getDepartmentId()))) {
                    return ResponseEntity.ok(complaint);
                }
            }
            return ResponseEntity.status(403).<Complaint>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable ObjectId id, @RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        AdminUser admin = (AdminUser) auth.getPrincipal();
        
        try {
            ComplaintStatus newStatus = ComplaintStatus.valueOf(body.get("status"));
            Complaint updated = complaintService.updateComplaintStatus(id, newStatus, admin.getId().toString());
            if (updated != null) return ResponseEntity.ok(updated);
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<Complaint> addInternalNote(@PathVariable ObjectId id, @RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        AdminUser admin = (AdminUser) auth.getPrincipal();

        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) return ResponseEntity.badRequest().build();

        Complaint updated = complaintService.addInternalNote(id, content, admin.getId().toString());
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable ObjectId id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok().build();
    }
}
