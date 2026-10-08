package com.nexusintel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "cases")
public class CaseFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_number", nullable = false, unique = true, length = 50)
    private String caseNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CaseStatus status = CaseStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CasePriority priority = CasePriority.MEDIUM;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Unit 4: @ManyToOne relationship: CaseFile -> User (Assignee)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    // Unit 4: @OneToMany relationship: CaseFile -> Evidence
    @OneToMany(mappedBy = "caseFile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Evidence> evidences = new ArrayList<>();

    // Unit 4: @OneToMany relationship: CaseFile -> Events
    @OneToMany(mappedBy = "caseFile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TimelineEvent> events = new ArrayList<>();

    // Unit 4: @ManyToMany relationship: CaseFile <-> IntelligenceEntity
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "case_entities",
        joinColumns = @JoinColumn(name = "case_id"),
        inverseJoinColumns = @JoinColumn(name = "entity_id")
    )
    private Set<IntelligenceEntity> entities = new HashSet<>();

    public CaseFile() {
    }

    public CaseFile(String caseNumber, String title, String description, CaseStatus status, CasePriority priority) {
        this.caseNumber = caseNumber;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = CaseStatus.OPEN;
        if (this.priority == null) this.priority = CasePriority.MEDIUM;
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addEvidence(Evidence evidence) {
        evidences.add(evidence);
        evidence.setCaseFile(this);
    }

    public void removeEvidence(Evidence evidence) {
        evidences.remove(evidence);
        evidence.setCaseFile(null);
    }

    public void addEvent(TimelineEvent event) {
        events.add(event);
        event.setCaseFile(this);
    }

    public void removeEvent(TimelineEvent event) {
        events.remove(event);
        event.setCaseFile(null);
    }

    public void addEntity(IntelligenceEntity entity) {
        entities.add(entity);
        entity.getCases().add(this);
    }

    public void removeEntity(IntelligenceEntity entity) {
        entities.remove(entity);
        entity.getCases().remove(this);
    }

    // Getters and Setters
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

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }

    public List<Evidence> getEvidences() {
        return evidences;
    }

    public void setEvidences(List<Evidence> evidences) {
        this.evidences = evidences;
    }

    public List<TimelineEvent> getEvents() {
        return events;
    }

    public void setEvents(List<TimelineEvent> events) {
        this.events = events;
    }

    public Set<IntelligenceEntity> getEntities() {
        return entities;
    }

    public void setEntities(Set<IntelligenceEntity> entities) {
        this.entities = entities;
    }
}
