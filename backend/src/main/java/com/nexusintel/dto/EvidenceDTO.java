package com.nexusintel.dto;

import com.nexusintel.entity.EvidenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EvidenceDTO {

    private Long id;

    @NotBlank(message = "Evidence code is required")
    private String evidenceCode;

    @NotNull(message = "Case ID is required")
    private Long caseId;
    private String caseNumber;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Evidence type is required")
    private EvidenceType evidenceType;

    private String fileUrl;
    private String chainOfCustody;
    private LocalDateTime collectedAt;
    private Boolean verified = false;

    public EvidenceDTO() {
    }

    public EvidenceDTO(Long id, String evidenceCode, Long caseId, String caseNumber, String title, String description, EvidenceType evidenceType, String fileUrl, String chainOfCustody, LocalDateTime collectedAt, Boolean verified) {
        this.id = id;
        this.evidenceCode = evidenceCode;
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.title = title;
        this.description = description;
        this.evidenceType = evidenceType;
        this.fileUrl = fileUrl;
        this.chainOfCustody = chainOfCustody;
        this.collectedAt = collectedAt;
        this.verified = verified != null ? verified : false;
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

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
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
