package com.nexusintel.service;

import com.nexusintel.dto.AnalyticsSummaryDTO;
import com.nexusintel.dto.EntityDTO;
import com.nexusintel.entity.CaseStatus;
import com.nexusintel.entity.EntityType;
import com.nexusintel.entity.RelationshipType;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final CaseFileRepository caseRepository;
    private final IntelligenceEntityRepository entityRepository;
    private final RelationshipRepository relationshipRepository;
    private final EvidenceRepository evidenceRepository;
    private final AnalyticalAnomalyRepository anomalyRepository;
    private final EntityMapper entityMapper;

    public AnalyticsService(CaseFileRepository caseRepository,
                            IntelligenceEntityRepository entityRepository,
                            RelationshipRepository relationshipRepository,
                            EvidenceRepository evidenceRepository,
                            AnalyticalAnomalyRepository anomalyRepository,
                            EntityMapper entityMapper) {
        this.caseRepository = caseRepository;
        this.entityRepository = entityRepository;
        this.relationshipRepository = relationshipRepository;
        this.evidenceRepository = evidenceRepository;
        this.anomalyRepository = anomalyRepository;
        this.entityMapper = entityMapper;
    }

    @Cacheable(value = "dashboardStats")
    @Transactional(readOnly = true)
    public AnalyticsSummaryDTO getSummary() {
        long activeCases = caseRepository.countByStatus(CaseStatus.OPEN) + caseRepository.countByStatus(CaseStatus.UNDER_INVESTIGATION);
        long totalEntities = entityRepository.count();
        long totalRelationships = relationshipRepository.count();
        long totalEvidence = evidenceRepository.count();
        long totalAnomalies = anomalyRepository.count();

        Map<String, Long> entityCounts = new HashMap<>();
        for (EntityType type : EntityType.values()) {
            entityCounts.put(type.name(), entityRepository.countByEntityType(type));
        }

        Map<String, Long> relationshipCounts = new HashMap<>();
        for (RelationshipType type : RelationshipType.values()) {
            relationshipCounts.put(type.name(), relationshipRepository.countByRelationshipType(type));
        }

        List<EntityDTO> highConnectivityEntities = entityRepository.findTop10ByOrderByRiskScoreDesc().stream()
                .map(entityMapper::toEntityDTO)
                .toList();

        return new AnalyticsSummaryDTO(
                activeCases,
                totalEntities,
                totalRelationships,
                totalEvidence,
                totalAnomalies,
                entityCounts,
                relationshipCounts,
                highConnectivityEntities
        );
    }
}
