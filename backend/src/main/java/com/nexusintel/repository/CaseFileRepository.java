package com.nexusintel.repository;

import com.nexusintel.entity.CaseFile;
import com.nexusintel.entity.CaseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseFileRepository extends JpaRepository<CaseFile, Long> {
    Optional<CaseFile> findByCaseNumber(String caseNumber);
    boolean existsByCaseNumber(String caseNumber);
    Page<CaseFile> findByStatus(CaseStatus status, Pageable pageable);
    List<CaseFile> findByStatus(CaseStatus status);
    Page<CaseFile> findByAssignedUserId(Long userId, Pageable pageable);
    long countByStatus(CaseStatus status);

    @Query("SELECT c FROM CaseFile c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<CaseFile> searchCases(@Param("query") String query, Pageable pageable);
}
