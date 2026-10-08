package com.nexusintel.ai;

import com.nexusintel.entity.*;
import com.nexusintel.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ContextService {

    private final IntelligenceEntityRepository entityRepository;
    private final RelationshipRepository relationshipRepository;
    private final EvidenceRepository evidenceRepository;
    private final TimelineEventRepository eventRepository;
    private final CaseFileRepository caseRepository;
    private final AnalyticalAnomalyRepository anomalyRepository;

    private static final Pattern CODE_PATTERN = Pattern.compile("(?i)\\b([PE]\\d{3,4}|C-\\d{4}-\\d{3}|ORG\\d{3}|PH\\d{3}|V\\d{3}|LOC\\d{3})\\b");

    public ContextService(IntelligenceEntityRepository entityRepository,
                          RelationshipRepository relationshipRepository,
                          EvidenceRepository evidenceRepository,
                          TimelineEventRepository eventRepository,
                          CaseFileRepository caseRepository,
                          AnalyticalAnomalyRepository anomalyRepository) {
        this.entityRepository = entityRepository;
        this.relationshipRepository = relationshipRepository;
        this.evidenceRepository = evidenceRepository;
        this.eventRepository = eventRepository;
        this.caseRepository = caseRepository;
        this.anomalyRepository = anomalyRepository;
    }

    public static class RetrievalContext {
        public List<IntelligenceEntity> matchedEntities = new ArrayList<>();
        public List<Relationship> matchedRelationships = new ArrayList<>();
        public List<Evidence> matchedEvidence = new ArrayList<>();
        public List<TimelineEvent> matchedEvents = new ArrayList<>();
        public List<CaseFile> matchedCases = new ArrayList<>();
        public List<AnalyticalAnomaly> matchedAnomalies = new ArrayList<>();
        public String structuredSummary;
    }

    @Transactional(readOnly = true)
    public RetrievalContext retrieveContext(String query, Long caseId, String entityCode) {
        RetrievalContext ctx = new RetrievalContext();
        Set<String> explicitCodes = new HashSet<>();

        if (entityCode != null && !entityCode.isBlank()) {
            explicitCodes.add(entityCode.toUpperCase().trim());
        }

        Matcher matcher = CODE_PATTERN.matcher(query);
        while (matcher.find()) {
            explicitCodes.add(matcher.group().toUpperCase());
        }

        // 1. Fetch entities matching codes or name substrings
        if (!explicitCodes.isEmpty()) {
            for (String code : explicitCodes) {
                entityRepository.findByEntityCode(code).ifPresent(ctx.matchedEntities::add);
                evidenceRepository.findByEvidenceCode(code).ifPresent(ctx.matchedEvidence::add);
                caseRepository.findByCaseNumber(code).ifPresent(ctx.matchedCases::add);
            }
        }

        // Case-scoped lookup
        if (caseId != null) {
            caseRepository.findById(caseId).ifPresent(c -> {
                if (!ctx.matchedCases.contains(c)) ctx.matchedCases.add(c);
                ctx.matchedEntities.addAll(c.getEntities());
                ctx.matchedEvidence.addAll(c.getEvidences());
                ctx.matchedEvents.addAll(c.getEvents());
            });
        }

        // Fallback: If no explicit code, search entities by keyword or top high-connectivity entities
        if (ctx.matchedEntities.isEmpty() && ctx.matchedCases.isEmpty() && ctx.matchedEvidence.isEmpty()) {
            String lower = query.toLowerCase();
            List<IntelligenceEntity> all = entityRepository.findAll();
            for (IntelligenceEntity e : all) {
                if (lower.contains(e.getName().toLowerCase()) || lower.contains(e.getEntityCode().toLowerCase())) {
                    ctx.matchedEntities.add(e);
                }
            }
            if (ctx.matchedEntities.isEmpty()) {
                ctx.matchedEntities = entityRepository.findTop10ByOrderByRiskScoreDesc();
            }
        }

        // 2. Fetch relationships for all matched entities
        Set<Long> entityIds = new HashSet<>();
        for (IntelligenceEntity e : ctx.matchedEntities) {
            entityIds.add(e.getId());
            ctx.matchedRelationships.addAll(relationshipRepository.findByEntityId(e.getId()));
            ctx.matchedEvents.addAll(eventRepository.findByEntityCodeOrderByEventDateAsc(e.getEntityCode()));
            ctx.matchedAnomalies.addAll(anomalyRepository.findByTargetEntityRef(e.getEntityCode()));
        }

        // Remove duplicates
        ctx.matchedRelationships = new ArrayList<>(new LinkedHashSet<>(ctx.matchedRelationships));
        ctx.matchedEvents = new ArrayList<>(new LinkedHashSet<>(ctx.matchedEvents));
        ctx.matchedAnomalies = new ArrayList<>(new LinkedHashSet<>(ctx.matchedAnomalies));

        // 3. Construct structured Markdown intelligence dossier
        StringBuilder sb = new StringBuilder();
        sb.append("=== RETRIEVED INTELLIGENCE DOSSIER ===\n");

        if (!ctx.matchedCases.isEmpty()) {
            sb.append("\n[CASES]:\n");
            for (CaseFile c : ctx.matchedCases) {
                sb.append(String.format("- Case %s: '%s' | Status: %s | Priority: %s\n  Description: %s\n",
                        c.getCaseNumber(), c.getTitle(), c.getStatus(), c.getPriority(), c.getDescription()));
            }
        }

        if (!ctx.matchedEntities.isEmpty()) {
            sb.append("\n[ENTITIES]:\n");
            for (IntelligenceEntity e : ctx.matchedEntities) {
                sb.append(String.format("- Code: %s | Name: %s | Type: %s | Risk Score: %.2f | Status: %s\n  Details: %s\n",
                        e.getEntityCode(), e.getName(), e.getEntityType(), e.getRiskScore(), e.getStatus(), e.getDetailsJson()));
            }
        }

        if (!ctx.matchedRelationships.isEmpty()) {
            sb.append("\n[RELATIONSHIPS]:\n");
            for (Relationship r : ctx.matchedRelationships) {
                sb.append(String.format("- %s [%s] -> %s [%s] | Type: %s | Weight: %.2f | Description: %s\n",
                        r.getSourceEntity().getEntityCode(), r.getSourceEntity().getName(),
                        r.getTargetEntity().getEntityCode(), r.getTargetEntity().getName(),
                        r.getRelationshipType(), r.getWeight(), r.getDescription()));
            }
        }

        if (!ctx.matchedEvidence.isEmpty()) {
            sb.append("\n[EVIDENCE RECORDS]:\n");
            for (Evidence ev : ctx.matchedEvidence) {
                sb.append(String.format("- Code: %s | Title: %s | Type: %s | Verified: %s | Case: %s\n  Custody & Notes: %s | %s\n",
                        ev.getEvidenceCode(), ev.getTitle(), ev.getEvidenceType(), ev.getVerified(),
                        ev.getCaseFile() != null ? ev.getCaseFile().getCaseNumber() : "N/A",
                        ev.getChainOfCustody(), ev.getDescription()));
            }
        }

        if (!ctx.matchedEvents.isEmpty()) {
            sb.append("\n[TIMELINE EVENTS]:\n");
            for (TimelineEvent ev : ctx.matchedEvents) {
                sb.append(String.format("- Date: %s | Event: '%s' | Entity: %s | Location: %s | Details: %s\n",
                        ev.getEventDate(), ev.getEventTitle(), ev.getEntityCode(), ev.getLocationName(), ev.getEventDescription()));
            }
        }

        if (!ctx.matchedAnomalies.isEmpty()) {
            sb.append("\n[ANALYTICAL SIGNALS / ANOMALIES]:\n");
            for (AnalyticalAnomaly a : ctx.matchedAnomalies) {
                sb.append(String.format("- Signal: %s | Type: %s | Severity: %s | Target: %s | Status: %s\n  Description: %s\n",
                        a.getSignalCode(), a.getAnomalyType(), a.getSeverity(), a.getTargetEntityRef(), a.getStatus(), a.getDescription()));
            }
        }

        ctx.structuredSummary = sb.toString();
        return ctx;
    }
}
