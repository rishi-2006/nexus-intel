package com.nexusintel.repository;

import com.nexusintel.entity.TimelineEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelineEventRepository extends JpaRepository<TimelineEvent, Long> {
    List<TimelineEvent> findByCaseFileIdOrderByEventDateAsc(Long caseId);
    Page<TimelineEvent> findByCaseFileId(Long caseId, Pageable pageable);
    List<TimelineEvent> findByEntityCodeOrderByEventDateAsc(String entityCode);
    List<TimelineEvent> findAllByOrderByEventDateDesc();
}
