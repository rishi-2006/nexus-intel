package com.nexusintel.repository;

import com.nexusintel.entity.PhoneRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhoneRecordRepository extends JpaRepository<PhoneRecord, Long> {
    Optional<PhoneRecord> findByPhoneNumber(String phoneNumber);
    List<PhoneRecord> findBySubscriberEntityRef(String subscriberEntityRef);
}
