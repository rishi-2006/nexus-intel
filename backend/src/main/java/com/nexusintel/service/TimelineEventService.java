package com.nexusintel.service;

import com.nexusintel.dto.EventDTO;
import com.nexusintel.entity.CaseFile;
import com.nexusintel.entity.TimelineEvent;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.CaseFileRepository;
import com.nexusintel.repository.TimelineEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TimelineEventService {

    private final TimelineEventRepository eventRepository;
    private final CaseFileRepository caseRepository;
    private final EntityMapper entityMapper;

    public TimelineEventService(TimelineEventRepository eventRepository,
                                CaseFileRepository caseRepository,
                                EntityMapper entityMapper) {
        this.eventRepository = eventRepository;
        this.caseRepository = caseRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc().stream()
                .map(entityMapper::toEventDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<EventDTO> getEventsByCase(Long caseId, Pageable pageable) {
        return eventRepository.findByCaseFileId(caseId, pageable)
                .map(entityMapper::toEventDTO);
    }

    @Transactional(readOnly = true)
    public List<EventDTO> getEventsByEntity(String entityCode) {
        return eventRepository.findByEntityCodeOrderByEventDateAsc(entityCode).stream()
                .map(entityMapper::toEventDTO)
                .toList();
    }

    @Transactional
    public EventDTO createEvent(EventDTO dto) {
        CaseFile caseFile = caseRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + dto.getCaseId()));

        TimelineEvent event = new TimelineEvent();
        event.setCaseFile(caseFile);
        event.setEventTitle(dto.getEventTitle().trim());
        event.setEventDescription(dto.getEventDescription());
        event.setEventDate(dto.getEventDate());
        event.setEntityCode(dto.getEntityCode());
        event.setLocationName(dto.getLocationName());
        event.setSourceRef(dto.getSourceRef());

        TimelineEvent saved = eventRepository.save(event);
        return entityMapper.toEventDTO(saved);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }
}
