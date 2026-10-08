package com.nexusintel.dto;

import com.nexusintel.entity.EntityType;

public class NetworkNodeDTO {

    private String id;
    private Long entityId;
    private String label;
    private EntityType type;
    private Double riskScore;
    private String status;
    private Integer degree;
    private String details;

    public NetworkNodeDTO() {
    }

    public NetworkNodeDTO(String id, Long entityId, String label, EntityType type, Double riskScore, String status, Integer degree, String details) {
        this.id = id;
        this.entityId = entityId;
        this.label = label;
        this.type = type;
        this.riskScore = riskScore != null ? riskScore : 0.0;
        this.status = status;
        this.degree = degree != null ? degree : 0;
        this.details = details;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public EntityType getType() {
        return type;
    }

    public void setType(EntityType type) {
        this.type = type;
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

    public Integer getDegree() {
        return degree;
    }

    public void setDegree(Integer degree) {
        this.degree = degree;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
