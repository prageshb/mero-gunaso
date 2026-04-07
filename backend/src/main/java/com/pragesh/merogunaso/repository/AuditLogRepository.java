package com.pragesh.merogunaso.repository;

import com.pragesh.merogunaso.entity.AuditLog;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, ObjectId> {
    List<AuditLog> findAllByOrderByTimestampDesc();
}
