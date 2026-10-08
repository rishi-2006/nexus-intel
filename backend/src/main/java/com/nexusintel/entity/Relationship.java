package com.nexusintel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "relationships")
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_entity_id", nullable = false)
    private IntelligenceEntity sourceEntity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_entity_id", nullable = false)
    private IntelligenceEntity targetEntity;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type", nullable = false, length = 40)
    private RelationshipType relationshipType;

    @Column(name = "weight")
    private Double weight = 1.0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "first_observed")
    private LocalDateTime firstObserved;

    @Column(name = "last_observed")
    private LocalDateTime lastObserved;

    public Relationship() {
    }

    public Relationship(IntelligenceEntity sourceEntity, IntelligenceEntity targetEntity, RelationshipType relationshipType, Double weight, String description) {
        this.sourceEntity = sourceEntity;
        this.targetEntity = targetEntity;
        this.relationshipType = relationshipType;
        this.weight = weight;
        this.description = description;
        this.firstObserved = LocalDateTime.now();
        this.lastObserved = LocalDateTime.now();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.weight == null) this.weight = 1.0;
        if (this.firstObserved == null) this.firstObserved = LocalDateTime.now();
        if (this.lastObserved == null) this.lastObserved = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public IntelligenceEntity getSourceEntity() {
        return sourceEntity;
    }

    public void setSourceEntity(IntelligenceEntity sourceEntity) {
        this.sourceEntity = sourceEntity;
    }

    public IntelligenceEntity getTargetEntity() {
        return targetEntity;
    }

    public void setTargetEntity(IntelligenceEntity targetEntity) {
        this.targetEntity = targetEntity;
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
