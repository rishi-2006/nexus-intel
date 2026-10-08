package com.nexusintel.dto;

import com.nexusintel.entity.AnomalySeverity;
import com.nexusintel.entity.AnomalyStatus;
import java.time.LocalDateTime;

public class AnomalyDTO {

    private Long id;
    private String signalCode;
    private String anomalyType;
    private String description;
    private AnomalySeverity severity;
    private AnomalyStatus status;
    private LocalDateTime detectedAt;
    private String targetEntityRef;

    public AnomalyDTO() {
    }

    public AnomalyDTO(Long id, String signalCode, String anomalyType, String description, AnomalySeverity severity, AnomalyStatus status, LocalDateTime detectedAt, String targetEntityRef) {
        this.id = id;
        this.signalCode = signalCode;
        this.anomalyType = anomalyType;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.detectedAt = detectedAt;
        this.targetEntityRef = targetEntityRef;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSignalCode() {
        return signalCode;
    }

    public void setSignalCode(String signalCode) {
        this.signalCode = signalCode;
    }

    public String getAnomalyType() {
        return anomalyType;
    }

    public void setAnomalyType(String anomalyType) {
        this.anomalyType = anomalyType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AnomalySeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AnomalySeverity severity) {
        this.severity = severity;
    }

    public AnomalyStatus getStatus() {
        return status;
    }

    public void setStatus(AnomalyStatus status) {
        this.status = status;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public String getTargetEntityRef() {
        return targetEntityRef;
    }

    public void setTargetEntityRef(String targetEntityRef) {
        this.targetEntityRef = targetEntityRef;
    }
}
