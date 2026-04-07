package com.pragesh.merogunaso.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;

@Document(collection = "departments")
public class Department {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Department() {
    }

    public Department(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
    
    // Virtual getter to return hex string of id directly since Frontend expects string id
    public String getStringId() {
        return id != null ? id.toHexString() : null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
