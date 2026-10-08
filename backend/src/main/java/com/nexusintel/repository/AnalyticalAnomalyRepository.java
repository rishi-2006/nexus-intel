package com.nexusintel.repository;

import com.nexusintel.entity.AnalyticalAnomaly;
import com.nexusintel.entity.AnomalySeverity;
import com.nexusintel.entity.AnomalyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalyticalAnomalyRepository extends JpaRepository<AnalyticalAnomaly, Long> {
    Optional<AnalyticalAnomaly> findBySignalCode(String signalCode);
    List<AnalyticalAnomaly> findByStatus(AnomalyStatus status);
    Page<AnalyticalAnomaly> findByStatus(AnomalyStatus status, Pageable pageable);
    List<AnalyticalAnomaly> findBySeverity(AnomalySeverity severity);
    List<AnalyticalAnomaly> findByTargetEntityRef(String targetEntityRef);
    long countByStatus(AnomalyStatus status);
}
