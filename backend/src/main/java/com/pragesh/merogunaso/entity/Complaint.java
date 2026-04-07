package com.pragesh.merogunaso.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "complaints")
public class Complaint {
    @Id
    private ObjectId id;
    private String ticketId;

    private String title;
    private String description;
    private String name;
    private String email;
    private String phone;
    private String departmentId; // Keeping as string or ObjectId based on preference, string is easier to map from frontend
    
    private ComplaintStatus status = ComplaintStatus.NOT_OPENED;
    private List<String> attachments = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
    private List<InternalNote> internalNotes = new ArrayList<>();
    private boolean isPublic = true;

    public Complaint() {
    }

    public Complaint(String title, String description, String name, String email, String phone, String departmentId) {
        this.title = title;
        this.description = description;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
    }

    public ObjectId getId() {
        return id;
    }
    
    public String getStringId() {
        return id != null ? id.toHexString() : null;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<InternalNote> getInternalNotes() {
        return internalNotes;
    }

    public void setInternalNotes(List<InternalNote> internalNotes) {
        this.internalNotes = internalNotes;
    }

    public void addInternalNote(InternalNote note) {
        if (this.internalNotes == null) {
            this.internalNotes = new ArrayList<>();
        }
        this.internalNotes.add(note);
    }

    public boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }
}
