package com.pragesh.merogunaso.service;

import com.pragesh.merogunaso.entity.AuditLog;
import com.pragesh.merogunaso.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public void logStatusChange(String complaintId, String oldStatus, String newStatus, String adminId) {
        AuditLog log = new AuditLog(complaintId, "STATUS_CHANGE", adminId, "Status updated from " + oldStatus + " to " + newStatus);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        auditLogRepository.save(log);
    }

    public void logNoteAddition(String complaintId, String adminId, String summarizedContent) {
        AuditLog log = new AuditLog(complaintId, "INTERNAL_NOTE_ADDED", adminId, "Note added: " + summarizedContent);
        auditLogRepository.save(log);
    }
}
