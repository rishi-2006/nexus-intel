package com.nexusintel.repository;

import com.nexusintel.entity.Evidence;
import com.nexusintel.entity.EvidenceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    Optional<Evidence> findByEvidenceCode(String evidenceCode);
    boolean existsByEvidenceCode(String evidenceCode);
    List<Evidence> findByCaseFileId(Long caseId);
    Page<Evidence> findByCaseFileId(Long caseId, Pageable pageable);
    Page<Evidence> findByEvidenceType(EvidenceType evidenceType, Pageable pageable);

    @Query("SELECT e FROM Evidence e JOIN FETCH e.caseFile WHERE e.id = :id")
    Optional<Evidence> findByIdWithCase(@Param("id") Long id);

    @Query("SELECT e FROM Evidence e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.evidenceCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Evidence> searchEvidence(@Param("query") String query, Pageable pageable);
}
