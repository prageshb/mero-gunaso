package com.pragesh.merogunaso.entity;

import java.time.LocalDateTime;
import java.util.UUID;

public class InternalNote {
    private String id;
    private String content;
    private String createdBy; // ID of the Admin
    private LocalDateTime createdAt = LocalDateTime.now();

    public InternalNote() {
        this.id = UUID.randomUUID().toString();
    }

    public InternalNote(String content, String createdBy) {
        this.id = UUID.randomUUID().toString();
        this.content = content;
        this.createdBy = createdBy;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
