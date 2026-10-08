package com.nexusintel.service;

import com.nexusintel.dto.AnomalyDTO;
import com.nexusintel.entity.AnalyticalAnomaly;
import com.nexusintel.entity.AnomalyStatus;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.AnalyticalAnomalyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class AnomalyService {

    private final AnalyticalAnomalyRepository anomalyRepository;
    private final EntityMapper entityMapper;

    public AnomalyService(AnalyticalAnomalyRepository anomalyRepository, EntityMapper entityMapper) {
        this.anomalyRepository = anomalyRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public Page<AnomalyDTO> getAnomalies(AnomalyStatus status, Pageable pageable) {
        Page<AnalyticalAnomaly> page;
        if (status != null) {
            page = anomalyRepository.findByStatus(status, pageable);
        } else {
            page = anomalyRepository.findAll(pageable);
        }
        return page.map(entityMapper::toAnomalyDTO);
    }

    @Transactional(readOnly = true)
    public List<AnomalyDTO> getAnomaliesByEntity(String entityRef) {
        return anomalyRepository.findByTargetEntityRef(entityRef).stream()
                .map(entityMapper::toAnomalyDTO)
                .toList();
    }

    @Transactional
    public AnomalyDTO updateStatus(Long id, AnomalyStatus status) {
        AnalyticalAnomaly anomaly = anomalyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Anomaly not found with ID: " + id));

        anomaly.setStatus(status);
        AnalyticalAnomaly updated = anomalyRepository.save(anomaly);
        return entityMapper.toAnomalyDTO(updated);
    }

    // Unit 8: @Async asynchronous batch execution
    @Async
    @Transactional
    public CompletableFuture<String> runDetectionScan() {
        // Asynchronous synthetic detection cycle
        try {
            Thread.sleep(500); // Simulate background pipeline compute
        } catch (InterruptedException ignored) {}

        return CompletableFuture.completedFuture("Scan completed successfully.");
    }
}
