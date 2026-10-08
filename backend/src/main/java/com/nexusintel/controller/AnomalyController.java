package com.nexusintel.controller;

import com.nexusintel.dto.AnomalyDTO;
import com.nexusintel.entity.AnomalyStatus;
import com.nexusintel.service.AnomalyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/anomalies")
public class AnomalyController {

    private final AnomalyService anomalyService;

    public AnomalyController(AnomalyService anomalyService) {
        this.anomalyService = anomalyService;
    }

    @GetMapping
    public ResponseEntity<Page<AnomalyDTO>> getAnomalies(
            @RequestParam(required = false) AnomalyStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("detectedAt").descending());
        return ResponseEntity.ok(anomalyService.getAnomalies(status, pageable));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<AnomalyDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        AnomalyStatus status = AnomalyStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(anomalyService.updateStatus(id, status));
    }

    @PostMapping("/scan")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<Map<String, String>> triggerScan() {
        anomalyService.runDetectionScan();
        return ResponseEntity.ok(Map.of("message", "Asynchronous anomaly detection pipeline initiated successfully."));
    }
}
