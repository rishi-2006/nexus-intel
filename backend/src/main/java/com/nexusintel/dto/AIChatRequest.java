package com.nexusintel.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public class AIChatRequest {

    @NotBlank(message = "Query cannot be blank")
    private String query;

    private Long caseId;
    private String entityCode;
    private Map<String, Object> filters;

    public AIChatRequest() {
    }

    public AIChatRequest(String query, Long caseId, String entityCode) {
        this.query = query;
        this.caseId = caseId;
        this.entityCode = entityCode;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public String getEntityCode() {
        return entityCode;
    }

    public void setEntityCode(String entityCode) {
        this.entityCode = entityCode;
    }

    public Map<String, Object> getFilters() {
        return filters;
    }

    public void setFilters(Map<String, Object> filters) {
        this.filters = filters;
    }
}
