package com.nexusintel.repository;

import com.nexusintel.entity.VehicleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRecordRepository extends JpaRepository<VehicleRecord, Long> {
    List<VehicleRecord> findByOwnerEntityRef(String ownerEntityRef);
}
