package com.nexusintel.dto;

import com.nexusintel.entity.CasePriority;
import com.nexusintel.entity.CaseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class CaseDTO {

    private Long id;

    @NotBlank(message = "Case number is required")
    private String caseNumber;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private CaseStatus status;

    @NotNull(message = "Priority is required")
    private CasePriority priority;

    private Long assignedUserId;
    private String assignedUserName;
    private Set<String> entityCodes = new HashSet<>();
    private Integer evidenceCount = 0;
    private Integer eventCount = 0;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CaseDTO() {
    }

    public CaseDTO(Long id, String caseNumber, String title, String description, CaseStatus status, CasePriority priority, Long assignedUserId, String assignedUserName, Set<String> entityCodes, Integer evidenceCount, Integer eventCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.caseNumber = caseNumber;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assignedUserId = assignedUserId;
        this.assignedUserName = assignedUserName;
        this.entityCodes = entityCodes != null ? entityCodes : new HashSet<>();
        this.evidenceCount = evidenceCount != null ? evidenceCount : 0;
        this.eventCount = eventCount != null ? eventCount : 0;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
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

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public CasePriority getPriority() {
        return priority;
    }

    public void setPriority(CasePriority priority) {
        this.priority = priority;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public String getAssignedUserName() {
        return assignedUserName;
    }

    public void setAssignedUserName(String assignedUserName) {
        this.assignedUserName = assignedUserName;
    }

    public Set<String> getEntityCodes() {
        return entityCodes;
    }

    public void setEntityCodes(Set<String> entityCodes) {
        this.entityCodes = entityCodes;
    }

    public Integer getEvidenceCount() {
        return evidenceCount;
    }

    public void setEvidenceCount(Integer evidenceCount) {
        this.evidenceCount = evidenceCount;
    }

    public Integer getEventCount() {
        return eventCount;
    }

    public void setEventCount(Integer eventCount) {
        this.eventCount = eventCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
