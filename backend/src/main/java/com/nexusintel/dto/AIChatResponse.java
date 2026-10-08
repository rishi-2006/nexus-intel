package com.nexusintel.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AIChatResponse {

    private String query;
    private String answer;
    private List<String> evidenceReferences = new ArrayList<>();
    private List<String> sources = new ArrayList<>();
    private Double confidenceScore;
    private String disclaimer = "AI-generated analytical findings require human verification and should not be treated as proof of wrongdoing.";
    private LocalDateTime timestamp;

    public AIChatResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public AIChatResponse(String query, String answer, List<String> evidenceReferences, List<String> sources, Double confidenceScore) {
        this.query = query;
        this.answer = answer;
        this.evidenceReferences = evidenceReferences != null ? evidenceReferences : new ArrayList<>();
        this.sources = sources != null ? sources : new ArrayList<>();
        this.confidenceScore = confidenceScore != null ? confidenceScore : 0.85;
        this.disclaimer = "AI-generated analytical findings require human verification and should not be treated as proof of wrongdoing.";
        this.timestamp = LocalDateTime.now();
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<String> getEvidenceReferences() {
        return evidenceReferences;
    }

    public void setEvidenceReferences(List<String> evidenceReferences) {
        this.evidenceReferences = evidenceReferences;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
