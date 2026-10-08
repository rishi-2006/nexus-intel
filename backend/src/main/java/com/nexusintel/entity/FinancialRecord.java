package com.nexusintel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_records")
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false, unique = true, length = 100)
    private String transactionId;

    @Column(name = "source_account", length = 100)
    private String sourceAccount;

    @Column(name = "target_account", length = 100)
    private String targetAccount;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 10)
    private String currency = "USD";

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "suspicious_flag")
    private Boolean suspiciousFlag = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public FinancialRecord() {
    }

    public FinancialRecord(String transactionId, String sourceAccount, String targetAccount, Double amount, String currency, LocalDateTime timestamp, Boolean suspiciousFlag, String notes) {
        this.transactionId = transactionId;
        this.sourceAccount = sourceAccount;
        this.targetAccount = targetAccount;
        this.amount = amount;
        this.currency = currency != null ? currency : "USD";
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.suspiciousFlag = suspiciousFlag != null ? suspiciousFlag : false;
        this.notes = notes;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.timestamp == null) this.timestamp = LocalDateTime.now();
        if (this.currency == null) this.currency = "USD";
        if (this.suspiciousFlag == null) this.suspiciousFlag = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getSourceAccount() {
        return sourceAccount;
    }

    public void setSourceAccount(String sourceAccount) {
        this.sourceAccount = sourceAccount;
    }

    public String getTargetAccount() {
        return targetAccount;
    }

    public void setTargetAccount(String targetAccount) {
        this.targetAccount = targetAccount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getSuspiciousFlag() {
        return suspiciousFlag;
    }

    public void setSuspiciousFlag(Boolean suspiciousFlag) {
        this.suspiciousFlag = suspiciousFlag;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
