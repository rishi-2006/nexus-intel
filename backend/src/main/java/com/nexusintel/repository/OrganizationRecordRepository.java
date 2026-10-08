package com.nexusintel.repository;

import com.nexusintel.entity.OrganizationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationRecordRepository extends JpaRepository<OrganizationRecord, Long> {
    List<OrganizationRecord> findByPrincipalEntityRef(String principalEntityRef);
}
