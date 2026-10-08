package com.nexusintel.repository;

import com.nexusintel.entity.EntityType;
import com.nexusintel.entity.IntelligenceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IntelligenceEntityRepository extends JpaRepository<IntelligenceEntity, Long> {
    Optional<IntelligenceEntity> findByEntityCode(String entityCode);
    boolean existsByEntityCode(String entityCode);
    Page<IntelligenceEntity> findByEntityType(EntityType entityType, Pageable pageable);
    long countByEntityType(EntityType entityType);
    List<IntelligenceEntity> findTop10ByOrderByRiskScoreDesc();

    @Query("SELECT e FROM IntelligenceEntity e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.entityCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<IntelligenceEntity> searchEntities(@Param("query") String query, Pageable pageable);

    @Query("SELECT e FROM IntelligenceEntity e LEFT JOIN FETCH e.cases WHERE e.id = :id")
    Optional<IntelligenceEntity> findByIdWithCases(@Param("id") Long id);
}
