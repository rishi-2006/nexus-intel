package com.nexusintel.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalyticsSummaryDTO {

    private long activeCases;
    private long totalEntities;
    private long totalRelationships;
    private long totalEvidence;
    private long totalAnomalies;
    private Map<String, Long> entityTypeCounts = new HashMap<>();
    private Map<String, Long> relationshipTypeCounts = new HashMap<>();
    private List<EntityDTO> highConnectivityEntities;

    public AnalyticsSummaryDTO() {
    }

    public AnalyticsSummaryDTO(long activeCases, long totalEntities, long totalRelationships, long totalEvidence, long totalAnomalies, Map<String, Long> entityTypeCounts, Map<String, Long> relationshipTypeCounts, List<EntityDTO> highConnectivityEntities) {
        this.activeCases = activeCases;
        this.totalEntities = totalEntities;
        this.totalRelationships = totalRelationships;
        this.totalEvidence = totalEvidence;
        this.totalAnomalies = totalAnomalies;
        this.entityTypeCounts = entityTypeCounts;
        this.relationshipTypeCounts = relationshipTypeCounts;
        this.highConnectivityEntities = highConnectivityEntities;
    }

    public long getActiveCases() {
        return activeCases;
    }

    public void setActiveCases(long activeCases) {
        this.activeCases = activeCases;
    }

    public long getTotalEntities() {
        return totalEntities;
    }

    public void setTotalEntities(long totalEntities) {
        this.totalEntities = totalEntities;
    }

    public long getTotalRelationships() {
        return totalRelationships;
    }

    public void setTotalRelationships(long totalRelationships) {
        this.totalRelationships = totalRelationships;
    }

    public long getTotalEvidence() {
        return totalEvidence;
    }

    public void setTotalEvidence(long totalEvidence) {
        this.totalEvidence = totalEvidence;
    }

    public long getTotalAnomalies() {
        return totalAnomalies;
    }

    public void setTotalAnomalies(long totalAnomalies) {
        this.totalAnomalies = totalAnomalies;
    }

    public Map<String, Long> getEntityTypeCounts() {
        return entityTypeCounts;
    }

    public void setEntityTypeCounts(Map<String, Long> entityTypeCounts) {
        this.entityTypeCounts = entityTypeCounts;
    }

    public Map<String, Long> getRelationshipTypeCounts() {
        return relationshipTypeCounts;
    }

    public void setRelationshipTypeCounts(Map<String, Long> relationshipTypeCounts) {
        this.relationshipTypeCounts = relationshipTypeCounts;
    }

    public List<EntityDTO> getHighConnectivityEntities() {
        return highConnectivityEntities;
    }

    public void setHighConnectivityEntities(List<EntityDTO> highConnectivityEntities) {
        this.highConnectivityEntities = highConnectivityEntities;
    }
}
