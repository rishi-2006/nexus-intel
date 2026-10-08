package com.nexusintel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evidence_code", nullable = false, unique = true, length = 50)
    private String evidenceCode;

    // Unit 4: @ManyToOne relationship: Evidence -> CaseFile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CaseFile caseFile;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "evidence_type", nullable = false, length = 30)
    private EvidenceType evidenceType;

    @Column(name = "file_url", length = 255)
    private String fileUrl;

    @Column(name = "chain_of_custody", columnDefinition = "TEXT")
    private String chainOfCustody;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(nullable = false)
    private Boolean verified = false;

    public Evidence() {
    }

    public Evidence(String evidenceCode, CaseFile caseFile, String title, String description, EvidenceType evidenceType, String fileUrl, String chainOfCustody, Boolean verified) {
        this.evidenceCode = evidenceCode;
        this.caseFile = caseFile;
        this.title = title;
        this.description = description;
        this.evidenceType = evidenceType;
        this.fileUrl = fileUrl;
        this.chainOfCustody = chainOfCustody;
        this.verified = verified != null ? verified : false;
        this.collectedAt = LocalDateTime.now();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.collectedAt == null) this.collectedAt = LocalDateTime.now();
        if (this.verified == null) this.verified = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEvidenceCode() {
        return evidenceCode;
    }

    public void setEvidenceCode(String evidenceCode) {
        this.evidenceCode = evidenceCode;
    }

    public CaseFile getCaseFile() {
        return caseFile;
    }

    public void setCaseFile(CaseFile caseFile) {
        this.caseFile = caseFile;
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

    public EvidenceType getEvidenceType() {
        return evidenceType;
    }

    public void setEvidenceType(EvidenceType evidenceType) {
        this.evidenceType = evidenceType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getChainOfCustody() {
        return chainOfCustody;
    }

    public void setChainOfCustody(String chainOfCustody) {
        this.chainOfCustody = chainOfCustody;
    }

    public LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
