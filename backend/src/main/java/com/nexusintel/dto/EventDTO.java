package com.nexusintel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EventDTO {

    private Long id;

    @NotNull(message = "Case ID is required")
    private Long caseId;
    private String caseNumber;

    @NotBlank(message = "Event title is required")
    private String eventTitle;

    private String eventDescription;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private String entityCode;
    private String locationName;
    private String sourceRef;
    private LocalDateTime createdAt;

    public EventDTO() {
    }

    public EventDTO(Long id, Long caseId, String caseNumber, String eventTitle, String eventDescription, LocalDateTime eventDate, String entityCode, String locationName, String sourceRef, LocalDateTime createdAt) {
        this.id = id;
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.eventDate = eventDate;
        this.entityCode = entityCode;
        this.locationName = locationName;
        this.sourceRef = sourceRef;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public String getEntityCode() {
        return entityCode;
    }

    public void setEntityCode(String entityCode) {
        this.entityCode = entityCode;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getSourceRef() {
        return sourceRef;
    }

    public void setSourceRef(String sourceRef) {
        this.sourceRef = sourceRef;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
