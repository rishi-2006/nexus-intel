package com.nexusintel.repository;

import com.nexusintel.entity.FinancialRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {
    List<FinancialRecord> findBySuspiciousFlagTrue();
    Page<FinancialRecord> findBySuspiciousFlagTrue(Pageable pageable);
    List<FinancialRecord> findBySourceAccountOrTargetAccount(String sourceAccount, String targetAccount);
}
