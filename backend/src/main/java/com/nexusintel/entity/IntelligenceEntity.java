package com.nexusintel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "entities")
public class IntelligenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_code", nullable = false, unique = true, length = 50)
    private String entityCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 30)
    private EntityType entityType;

    @Column(name = "risk_score")
    private Double riskScore = 0.0;

    @Column(length = 50)
    private String status = "ACTIVE";

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Unit 4: @ManyToMany mappedBy on CaseFile
    @ManyToMany(mappedBy = "entities", fetch = FetchType.LAZY)
    private Set<CaseFile> cases = new HashSet<>();

    // Outbound relationships: this entity is source
    @OneToMany(mappedBy = "sourceEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Relationship> outboundRelationships = new ArrayList<>();

    // Inbound relationships: this entity is target
    @OneToMany(mappedBy = "targetEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Relationship> inboundRelationships = new ArrayList<>();

    public IntelligenceEntity() {
    }

    public IntelligenceEntity(String entityCode, String name, EntityType entityType, Double riskScore, String status, String detailsJson) {
        this.entityCode = entityCode;
        this.name = name;
        this.entityType = entityType;
        this.riskScore = riskScore;
        this.status = status;
        this.detailsJson = detailsJson;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.riskScore == null) this.riskScore = 0.0;
        if (this.status == null) this.status = "ACTIVE";
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public Set<CaseFile> getCases() {
        return cases;
    }

    public void setCases(Set<CaseFile> cases) {
        this.cases = cases;
    }

    public List<Relationship> getOutboundRelationships() {
        return outboundRelationships;
    }

    public void setOutboundRelationships(List<Relationship> outboundRelationships) {
        this.outboundRelationships = outboundRelationships;
    }

    public List<Relationship> getInboundRelationships() {
        return inboundRelationships;
    }

    public void setInboundRelationships(List<Relationship> inboundRelationships) {
        this.inboundRelationships = inboundRelationships;
    }
}
