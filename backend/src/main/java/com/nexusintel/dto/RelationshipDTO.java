package com.nexusintel.dto;

import com.nexusintel.entity.RelationshipType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class RelationshipDTO {

    private Long id;

    @NotNull(message = "Source entity ID is required")
    private Long sourceEntityId;
    private String sourceEntityCode;
    private String sourceEntityName;

    @NotNull(message = "Target entity ID is required")
    private Long targetEntityId;
    private String targetEntityCode;
    private String targetEntityName;

    @NotNull(message = "Relationship type is required")
    private RelationshipType relationshipType;

    private Double weight = 1.0;
    private String description;
    private LocalDateTime firstObserved;
    private LocalDateTime lastObserved;

    public RelationshipDTO() {
    }

    public RelationshipDTO(Long id, Long sourceEntityId, String sourceEntityCode, String sourceEntityName, Long targetEntityId, String targetEntityCode, String targetEntityName, RelationshipType relationshipType, Double weight, String description, LocalDateTime firstObserved, LocalDateTime lastObserved) {
        this.id = id;
        this.sourceEntityId = sourceEntityId;
        this.sourceEntityCode = sourceEntityCode;
        this.sourceEntityName = sourceEntityName;
        this.targetEntityId = targetEntityId;
        this.targetEntityCode = targetEntityCode;
        this.targetEntityName = targetEntityName;
        this.relationshipType = relationshipType;
        this.weight = weight != null ? weight : 1.0;
        this.description = description;
        this.firstObserved = firstObserved;
        this.lastObserved = lastObserved;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSourceEntityId() {
        return sourceEntityId;
    }

    public void setSourceEntityId(Long sourceEntityId) {
        this.sourceEntityId = sourceEntityId;
    }

    public String getSourceEntityCode() {
        return sourceEntityCode;
    }

    public void setSourceEntityCode(String sourceEntityCode) {
        this.sourceEntityCode = sourceEntityCode;
    }

    public String getSourceEntityName() {
        return sourceEntityName;
    }

    public void setSourceEntityName(String sourceEntityName) {
        this.sourceEntityName = sourceEntityName;
    }

    public Long getTargetEntityId() {
        return targetEntityId;
    }

    public void setTargetEntityId(Long targetEntityId) {
        this.targetEntityId = targetEntityId;
    }

    public String getTargetEntityCode() {
        return targetEntityCode;
    }

    public void setTargetEntityCode(String targetEntityCode) {
        this.targetEntityCode = targetEntityCode;
    }

    public String getTargetEntityName() {
        return targetEntityName;
    }

    public void setTargetEntityName(String targetEntityName) {
        this.targetEntityName = targetEntityName;
    }

    public RelationshipType getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(RelationshipType relationshipType) {
        this.relationshipType = relationshipType;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getFirstObserved() {
        return firstObserved;
    }

    public void setFirstObserved(LocalDateTime firstObserved) {
        this.firstObserved = firstObserved;
    }

    public LocalDateTime getLastObserved() {
        return lastObserved;
    }

    public void setLastObserved(LocalDateTime lastObserved) {
        this.lastObserved = lastObserved;
    }
}
