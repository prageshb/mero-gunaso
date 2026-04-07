package com.pragesh.merogunaso.repository;

import com.pragesh.merogunaso.entity.AdminUser;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends MongoRepository<AdminUser, ObjectId> {
    Optional<AdminUser> findByEmail(String email);
}
