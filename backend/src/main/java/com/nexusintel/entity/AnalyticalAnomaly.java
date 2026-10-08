package com.nexusintel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytical_anomalies")
public class AnalyticalAnomaly {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "signal_code", nullable = false, unique = true, length = 50)
    private String signalCode;

    @Column(name = "anomaly_type", nullable = false, length = 50)
    private String anomalyType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnomalySeverity severity = AnomalySeverity.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnomalyStatus status = AnomalyStatus.NEW;

    @Column(name = "detected_at", nullable = false)
    private LocalDateTime detectedAt;

    @Column(name = "target_entity_ref", length = 50)
    private String targetEntityRef;

    public AnalyticalAnomaly() {
    }

    public AnalyticalAnomaly(String signalCode, String anomalyType, String description, AnomalySeverity severity, AnomalyStatus status, String targetEntityRef) {
        this.signalCode = signalCode;
        this.anomalyType = anomalyType;
        this.description = description;
        this.severity = severity != null ? severity : AnomalySeverity.MEDIUM;
        this.status = status != null ? status : AnomalyStatus.NEW;
        this.detectedAt = LocalDateTime.now();
        this.targetEntityRef = targetEntityRef;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.detectedAt == null) this.detectedAt = LocalDateTime.now();
        if (this.severity == null) this.severity = AnomalySeverity.MEDIUM;
        if (this.status == null) this.status = AnomalyStatus.NEW;
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
