package com.nexusintel.mapper;

import com.nexusintel.dto.*;
import com.nexusintel.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserProfile profile = user.getUserProfile();
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                profile != null ? profile.getBadgeNumber() : null,
                profile != null ? profile.getDepartment() : null,
                profile != null ? profile.getClearanceLevel() : null,
                profile != null ? profile.getPhoneNumber() : null,
                user.getCreatedAt()
        );
    }

    public CaseDTO toCaseDTO(CaseFile caseFile) {
        if (caseFile == null) return null;
        return new CaseDTO(
                caseFile.getId(),
                caseFile.getCaseNumber(),
                caseFile.getTitle(),
                caseFile.getDescription(),
                caseFile.getStatus(),
                caseFile.getPriority(),
                caseFile.getAssignedUser() != null ? caseFile.getAssignedUser().getId() : null,
                caseFile.getAssignedUser() != null ? caseFile.getAssignedUser().getName() : null,
                caseFile.getEntities() != null ? caseFile.getEntities().stream().map(IntelligenceEntity::getEntityCode).collect(Collectors.toSet()) : null,
                caseFile.getEvidences() != null ? caseFile.getEvidences().size() : 0,
                caseFile.getEvents() != null ? caseFile.getEvents().size() : 0,
                caseFile.getCreatedAt(),
                caseFile.getUpdatedAt()
        );
    }

    public EntityDTO toEntityDTO(IntelligenceEntity entity) {
        if (entity == null) return null;
        int connections = 0;
        if (entity.getOutboundRelationships() != null) connections += entity.getOutboundRelationships().size();
        if (entity.getInboundRelationships() != null) connections += entity.getInboundRelationships().size();
        int caseCount = entity.getCases() != null ? entity.getCases().size() : 0;

        return new EntityDTO(
                entity.getId(),
                entity.getEntityCode(),
                entity.getName(),
                entity.getEntityType(),
                entity.getRiskScore(),
                entity.getStatus(),
                entity.getDetailsJson(),
                connections,
                caseCount,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public RelationshipDTO toRelationshipDTO(Relationship rel) {
        if (rel == null) return null;
        return new RelationshipDTO(
                rel.getId(),
                rel.getSourceEntity() != null ? rel.getSourceEntity().getId() : null,
                rel.getSourceEntity() != null ? rel.getSourceEntity().getEntityCode() : null,
                rel.getSourceEntity() != null ? rel.getSourceEntity().getName() : null,
                rel.getTargetEntity() != null ? rel.getTargetEntity().getId() : null,
                rel.getTargetEntity() != null ? rel.getTargetEntity().getEntityCode() : null,
                rel.getTargetEntity() != null ? rel.getTargetEntity().getName() : null,
                rel.getRelationshipType(),
                rel.getWeight(),
                rel.getDescription(),
                rel.getFirstObserved(),
                rel.getLastObserved()
        );
    }

    public EvidenceDTO toEvidenceDTO(Evidence evidence) {
        if (evidence == null) return null;
        return new EvidenceDTO(
                evidence.getId(),
                evidence.getEvidenceCode(),
                evidence.getCaseFile() != null ? evidence.getCaseFile().getId() : null,
                evidence.getCaseFile() != null ? evidence.getCaseFile().getCaseNumber() : null,
                evidence.getTitle(),
                evidence.getDescription(),
                evidence.getEvidenceType(),
                evidence.getFileUrl(),
                evidence.getChainOfCustody(),
                evidence.getCollectedAt(),
                evidence.getVerified()
        );
    }

    public EventDTO toEventDTO(TimelineEvent event) {
        if (event == null) return null;
        return new EventDTO(
                event.getId(),
                event.getCaseFile() != null ? event.getCaseFile().getId() : null,
                event.getCaseFile() != null ? event.getCaseFile().getCaseNumber() : null,
                event.getEventTitle(),
                event.getEventDescription(),
                event.getEventDate(),
                event.getEntityCode(),
                event.getLocationName(),
                event.getSourceRef(),
                event.getCreatedAt()
        );
    }

    public AnomalyDTO toAnomalyDTO(AnalyticalAnomaly anomaly) {
        if (anomaly == null) return null;
        return new AnomalyDTO(
                anomaly.getId(),
                anomaly.getSignalCode(),
                anomaly.getAnomalyType(),
                anomaly.getDescription(),
                anomaly.getSeverity(),
                anomaly.getStatus(),
                anomaly.getDetectedAt(),
                anomaly.getTargetEntityRef()
        );
    }
}
