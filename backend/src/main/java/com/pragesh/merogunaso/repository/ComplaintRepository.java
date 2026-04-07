package com.pragesh.merogunaso.repository;

import com.pragesh.merogunaso.entity.Complaint;
import com.pragesh.merogunaso.entity.ComplaintStatus;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, ObjectId> {
    Page<Complaint> findByDepartmentId(String departmentId, Pageable pageable);
    List<Complaint> findByDepartmentId(String departmentId);
    Page<Complaint> findByIsPublic(boolean isPublic, Pageable pageable);
    
    long countByStatus(ComplaintStatus status);
    long countByDepartmentId(String departmentId);
    long countByDepartmentIdAndStatus(String departmentId, ComplaintStatus status);
}
