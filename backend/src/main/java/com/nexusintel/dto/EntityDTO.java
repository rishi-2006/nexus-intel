package com.nexusintel.dto;

import com.nexusintel.entity.EntityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EntityDTO {

    private Long id;

    @NotBlank(message = "Entity code is required")
    private String entityCode;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Entity type is required")
    private EntityType entityType;

    private Double riskScore = 0.0;
    private String status = "ACTIVE";
    private String detailsJson;
    private Integer connectionCount = 0;
    private Integer caseCount = 0;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EntityDTO() {
    }

    public EntityDTO(Long id, String entityCode, String name, EntityType entityType, Double riskScore, String status, String detailsJson, Integer connectionCount, Integer caseCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.entityCode = entityCode;
        this.name = name;
        this.entityType = entityType;
        this.riskScore = riskScore != null ? riskScore : 0.0;
        this.status = status != null ? status : "ACTIVE";
        this.detailsJson = detailsJson;
        this.connectionCount = connectionCount != null ? connectionCount : 0;
        this.caseCount = caseCount != null ? caseCount : 0;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntityCode() {
        return entityCode;
    }

    public void setEntityCode(String entityCode) {
        this.entityCode = entityCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDetailsJson() {
        return detailsJson;
    }

    public void setDetailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
    }

    public Integer getConnectionCount() {
        return connectionCount;
    }

    public void setConnectionCount(Integer connectionCount) {
        this.connectionCount = connectionCount;
    }

    public Integer getCaseCount() {
        return caseCount;
    }

    public void setCaseCount(Integer caseCount) {
        this.caseCount = caseCount;
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
