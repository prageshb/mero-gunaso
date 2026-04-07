package com.pragesh.merogunaso.controller;

import com.pragesh.merogunaso.entity.AuditLog;
import com.pragesh.merogunaso.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')") // For now, restrict universal fetch strictly to Super Admins
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllAuditLogs());
    }
}
