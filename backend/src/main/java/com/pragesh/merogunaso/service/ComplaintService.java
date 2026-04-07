package com.pragesh.merogunaso.service;

import com.pragesh.merogunaso.entity.Complaint;
import com.pragesh.merogunaso.entity.ComplaintStatus;
import com.pragesh.merogunaso.entity.InternalNote;
import com.pragesh.merogunaso.repository.ComplaintRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private SequenceGeneratorService sequenceGenerator;

    @Autowired
    private AuditLogService auditLogService;

    public Complaint createComplaint(Complaint complaint) {
        long seq = sequenceGenerator.generateSequence("complaints_sequence");
        complaint.setTicketId("TID-" + (1000 + seq));
        return complaintRepository.save(complaint);
    }

    public Page<Complaint> getAllComplaints(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return complaintRepository.findAll(pageRequest);
    }

    public Page<Complaint> getComplaintsByDepartment(String departmentId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return complaintRepository.findByDepartmentId(departmentId, pageRequest);
    }

    public Page<Complaint> getPublicComplaints(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return complaintRepository.findByIsPublic(true, pageRequest);
    }

    public Optional<Complaint> getComplaintById(ObjectId id) {
        return complaintRepository.findById(id);
    }

    public void deleteComplaint(ObjectId id) {
        complaintRepository.deleteById(id);
    }

    public Map<String, Long> getComplaintStats(String departmentId) {
        long total;
        long resolved;
        long inProgress;

        if (departmentId == null) {
            total = complaintRepository.count();
            resolved = complaintRepository.countByStatus(ComplaintStatus.DONE);
            inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        } else {
            total = complaintRepository.countByDepartmentId(departmentId);
            resolved = complaintRepository.countByDepartmentIdAndStatus(departmentId, ComplaintStatus.DONE);
            inProgress = complaintRepository.countByDepartmentIdAndStatus(departmentId, ComplaintStatus.IN_PROGRESS);
        }
        
        return Map.of(
            "total", total,
            "resolved", resolved,
            "inProgress", inProgress
        );
    }

    public Complaint updateComplaintStatus(ObjectId id, ComplaintStatus newStatus, String adminId) {
        return complaintRepository.findById(id).map(complaint -> {
            String oldStatus = complaint.getStatus().name();
            complaint.setStatus(newStatus);
            Complaint saved = complaintRepository.save(complaint);
            
            // Trigger Audit Log
            auditLogService.logStatusChange(saved.getStringId(), oldStatus, newStatus.name(), adminId);
            return saved;
        }).orElse(null);
    }

    public Complaint addInternalNote(ObjectId id, String content, String adminId) {
        return complaintRepository.findById(id).map(complaint -> {
            InternalNote note = new InternalNote(content, adminId);
            complaint.addInternalNote(note);
            Complaint saved = complaintRepository.save(complaint);
            
            // Trigger Audit Log
            String shortContent = content.length() > 30 ? content.substring(0, 30) + "..." : content;
            auditLogService.logNoteAddition(saved.getStringId(), adminId, shortContent);
            return saved;
        }).orElse(null);
    }
}
