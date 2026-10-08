package com.nexusintel.dto;

import java.util.ArrayList;
import java.util.List;

public class DataImportResponse {

    private String status;
    private int recordsProcessed;
    private List<String> errors = new ArrayList<>();
    private String message;

    public DataImportResponse() {
    }

    public DataImportResponse(String status, int recordsProcessed, List<String> errors, String message) {
        this.status = status;
        this.recordsProcessed = recordsProcessed;
        this.errors = errors != null ? errors : new ArrayList<>();
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getRecordsProcessed() {
        return recordsProcessed;
    }

    public void setRecordsProcessed(int recordsProcessed) {
        this.recordsProcessed = recordsProcessed;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
