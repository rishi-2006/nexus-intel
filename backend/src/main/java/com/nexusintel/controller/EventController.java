package com.nexusintel.controller;

import com.nexusintel.dto.EventDTO;
import com.nexusintel.service.TimelineEventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final TimelineEventService eventService;

    public EventController(TimelineEventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<Page<EventDTO>> getEventsByCase(
            @PathVariable Long caseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("eventDate").ascending());
        return ResponseEntity.ok(eventService.getEventsByCase(caseId, pageable));
    }

    @GetMapping("/entity/{entityCode}")
    public ResponseEntity<List<EventDTO>> getEventsByEntity(@PathVariable String entityCode) {
        return ResponseEntity.ok(eventService.getEventsByEntity(entityCode));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventDTO dto) {
        EventDTO created = eventService.createEvent(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
