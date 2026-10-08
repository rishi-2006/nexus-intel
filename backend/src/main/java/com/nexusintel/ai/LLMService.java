package com.nexusintel.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class LLMService {

    private static final Logger log = LoggerFactory.getLogger(LLMService.class);

    @Value("${nexus.ai.api-key:}")
    private String apiKey;

    @Value("${nexus.ai.api-url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${nexus.ai.model:gpt-4o-mini}")
    private String model;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public static final String SYSTEM_PROMPT = """
            You are NEXUS AI, an elite decision-support and criminal network investigation analysis assistant.
            GUIDELINES:
            1. You provide objective, analytical intelligence summaries based EXCLUSIVELY on the provided retrieved context.
            2. Never declare guilt or fabricate evidence. Always use neutral analytical terminology: "High Connectivity", "Potential Association", "Analytical Signal", "Requires Verification".
            3. Explicitly cite supporting evidence codes (e.g. E1024, E1025) and entity codes (e.g. P102, ORG301).
            4. If no records match or context is missing, explicitly state: "No supporting record was found in the available dataset."
            5. Always append the mandatory compliance disclaimer:
               "AI-generated analytical findings require human verification and should not be treated as proof of wrongdoing."
            """;

    public LLMService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder().build();
    }

    public String generateResponse(String query, String contextDossier, ContextService.RetrievalContext ctx) {
        // If an external API key is provided, invoke LLM API via WebClient
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callExternalLLM(query, contextDossier);
            } catch (Exception e) {
                log.warn("External LLM API call failed, falling back to built-in RAG engine: {}", e.getMessage());
            }
        }

        // Built-in RAG analytical reasoning engine
        return generateBuiltInAnalyticalResponse(query, ctx);
    }

    private String callExternalLLM(String query, String contextDossier) throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
        messages.add(Map.of("role", "user", "content", "Context Dossier:\n" + contextDossier + "\n\nUser Question: " + query));
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.2);

        String jsonPayload = objectMapper.writeValueAsString(requestBody);

        String rawResponse = webClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(jsonPayload)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode root = objectMapper.readTree(rawResponse);
        if (root.has("choices") && root.get("choices").isArray() && root.get("choices").size() > 0) {
            return root.get("choices").get(0).get("message").get("content").asText();
        }

        throw new RuntimeException("Malformed response from LLM API");
    }

    private String generateBuiltInAnalyticalResponse(String query, ContextService.RetrievalContext ctx) {
        String lower = query.toLowerCase();

        // 1. Check for completely missing data
        if (ctx.matchedEntities.isEmpty() && ctx.matchedCases.isEmpty() && ctx.matchedEvidence.isEmpty() && ctx.matchedRelationships.isEmpty()) {
            return "No supporting record was found in the available dataset.\n\n" +
                    "> **Compliance Notice:** AI-generated analytical findings require human verification and should not be treated as proof of wrongdoing.";
        }

        StringBuilder response = new StringBuilder();

        // Check if query is about connections of an entity (e.g. P102)
        if (lower.contains("connection") || lower.contains("relationship") || lower.contains("connect")) {
            if (!ctx.matchedEntities.isEmpty()) {
                var target = ctx.matchedEntities.get(0);
                response.append(String.format("### Analytical Dossier: Connectivity for **%s (%s)**\n\n", target.getEntityCode(), target.getName()));
                response.append(String.format("- **Entity Type:** %s\n", target.getEntityType()));
                response.append(String.format("- **Analytical Risk Score:** %.2f / 1.0\n", target.getRiskScore()));
                response.append(String.format("- **Recorded Relationships in Scope:** %d\n\n", ctx.matchedRelationships.size()));

                if (ctx.matchedRelationships.isEmpty()) {
                    response.append("No active relationship links are currently recorded for this entity in the selected dataset.\n\n");
                } else {
                    response.append("#### Identified Relational Links:\n");
                    for (var rel : ctx.matchedRelationships) {
                        String otherCode = rel.getSourceEntity().getEntityCode().equals(target.getEntityCode())
                                ? rel.getTargetEntity().getEntityCode() : rel.getSourceEntity().getEntityCode();
                        String otherName = rel.getSourceEntity().getEntityCode().equals(target.getEntityCode())
                                ? rel.getTargetEntity().getName() : rel.getSourceEntity().getName();
                        response.append(String.format("- **%s** (`%s`): %s [%s] (Weight: %.1f) - *%s*\n",
                                otherName, otherCode, rel.getRelationshipType(), rel.getDescription(), rel.getWeight(),
                                rel.getFirstObserved() != null ? rel.getFirstObserved().toLocalDate() : "Recorded"));
                    }
                    response.append("\n");
                }
            } else {
                response.append("### Network Connection Summary\n\nIdentified multiple relational clusters across recorded subjects.\n\n");
            }
        }
        // Check if query is about organizations
        else if (lower.contains("organization") || lower.contains("company") || lower.contains("corporate")) {
            response.append("### Organizational Affiliation Analysis\n\n");
            long orgCount = ctx.matchedRelationships.stream()
                    .filter(r -> r.getSourceEntity().getEntityType().name().equals("ORGANIZATION") || r.getTargetEntity().getEntityType().name().equals("ORGANIZATION"))
                    .count();

            if (orgCount > 0) {
                response.append(String.format("Found **%d** direct organizational connections in current intelligence context:\n\n", orgCount));
                for (var r : ctx.matchedRelationships) {
                    if (r.getSourceEntity().getEntityType().name().equals("ORGANIZATION") || r.getTargetEntity().getEntityType().name().equals("ORGANIZATION")) {
                        response.append(String.format("- **%s** (`%s`) <-> **%s** (`%s`) via `%s`: %s\n",
                                r.getSourceEntity().getName(), r.getSourceEntity().getEntityCode(),
                                r.getTargetEntity().getName(), r.getTargetEntity().getEntityCode(),
                                r.getRelationshipType(), r.getDescription()));
                    }
                }
                response.append("\n");
            } else {
                response.append("No direct organizational entities were identified linked to the specified subject in available records.\n\n");
            }
        }
        // Check if query is about evidence
        else if (lower.contains("evidence") || lower.contains("proof") || lower.contains("forensic")) {
            response.append("### Evidentiary Audit Report\n\n");
            if (!ctx.matchedEvidence.isEmpty()) {
                response.append(String.format("Retrieved **%d** evidence items linked to the query:\n\n", ctx.matchedEvidence.size()));
                for (var ev : ctx.matchedEvidence) {
                    response.append(String.format("- **Evidence %s**: *%s* (`%s`)\n  - Status: %s\n  - Chain of Custody: %s\n  - Notes: %s\n",
                            ev.getEvidenceCode(), ev.getTitle(), ev.getEvidenceType(),
                            ev.getVerified() ? "Verified Chain of Custody" : "Unverified / Preliminary",
                            ev.getChainOfCustody(), ev.getDescription()));
                }
                response.append("\n");
            } else {
                response.append("No direct physical or digital evidence records are explicitly cross-referenced with this query in the primary repository.\n\n");
            }
        }
        // Check if query is about unusual activity / anomalies
        else if (lower.contains("unusual") || lower.contains("anomaly") || lower.contains("spike") || lower.contains("signal")) {
            response.append("### Analytical Anomaly & Behavioral Signals\n\n");
            if (!ctx.matchedAnomalies.isEmpty()) {
                response.append(String.format("Detected **%d** behavioral anomalies requiring analyst review:\n\n", ctx.matchedAnomalies.size()));
                for (var a : ctx.matchedAnomalies) {
                    response.append(String.format("- **Signal [%s]** (`%s` | Severity: **%s**):\n  - Target Ref: `%s` | Status: `%s`\n  - Narrative: %s\n",
                            a.getSignalCode(), a.getAnomalyType(), a.getSeverity(), a.getTargetEntityRef(), a.getStatus(), a.getDescription()));
                }
                response.append("\n");
            } else {
                response.append("No active anomalous patterns or communication spikes have been triggered for this scope in current telemetry.\n\n");
            }
        }
        // General / Investigation Summary
        else {
            response.append("### Executive Investigation Intelligence Summary\n\n");
            if (!ctx.matchedCases.isEmpty()) {
                var c = ctx.matchedCases.get(0);
                response.append(String.format("#### Investigation Focus: **Case %s - %s**\n", c.getCaseNumber(), c.getTitle()));
                response.append(String.format("- **Status:** %s | **Priority:** %s\n", c.getStatus(), c.getPriority()));
                response.append(String.format("- **Narrative:** %s\n\n", c.getDescription()));
            }

            if (!ctx.matchedEntities.isEmpty()) {
                response.append("#### Key Observed Entities:\n");
                for (var e : ctx.matchedEntities.stream().limit(5).toList()) {
                    response.append(String.format("- **%s** (`%s`, %s) - Risk Index: %.2f\n",
                            e.getName(), e.getEntityCode(), e.getEntityType(), e.getRiskScore()));
                }
                response.append("\n");
            }

            if (!ctx.matchedRelationships.isEmpty()) {
                response.append(String.format("#### Relational Network Structure:\nTotal of **%d** active edges connecting primary actors across telecommunications, financial transfers, and physical co-locations.\n\n",
                        ctx.matchedRelationships.size()));
            }
        }

        // Add Evidence Sources
        if (!ctx.matchedEvidence.isEmpty()) {
            response.append("#### Sources & Evidentiary Citations:\n");
            for (var ev : ctx.matchedEvidence.stream().limit(4).toList()) {
                response.append(String.format("- Ref `[%s]`: %s\n", ev.getEvidenceCode(), ev.getTitle()));
            }
            response.append("\n");
        }

        response.append("> **Compliance Notice:** AI-generated analytical findings require human verification and should not be treated as proof of wrongdoing.");
        return response.toString();
    }
}
