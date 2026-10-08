package com.nexusintel.repository;

import com.nexusintel.entity.LocationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRecordRepository extends JpaRepository<LocationRecord, Long> {
    List<LocationRecord> findByEntityRef(String entityRef);
}
