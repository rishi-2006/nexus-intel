package com.nexusintel.controller;

import com.nexusintel.dto.RelationshipDTO;
import com.nexusintel.entity.RelationshipType;
import com.nexusintel.service.RelationshipService;
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
@RequestMapping("/api/relationships")
public class RelationshipController {

    private final RelationshipService relationshipService;

    public RelationshipController(RelationshipService relationshipService) {
        this.relationshipService = relationshipService;
    }

    @GetMapping
    public ResponseEntity<Page<RelationshipDTO>> getRelationships(
            @RequestParam(required = false) RelationshipType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(relationshipService.getRelationships(type, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RelationshipDTO> getRelationshipById(@PathVariable Long id) {
        return ResponseEntity.ok(relationshipService.getRelationshipById(id));
    }

    @GetMapping("/entity/{entityId}")
    public ResponseEntity<List<RelationshipDTO>> getRelationshipsForEntity(@PathVariable Long entityId) {
        return ResponseEntity.ok(relationshipService.getRelationshipsForEntity(entityId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<RelationshipDTO> createRelationship(@Valid @RequestBody RelationshipDTO dto) {
        RelationshipDTO created = relationshipService.createRelationship(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<RelationshipDTO> updateRelationship(@PathVariable Long id, @Valid @RequestBody RelationshipDTO dto) {
        return ResponseEntity.ok(relationshipService.updateRelationship(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")
    public ResponseEntity<Void> deleteRelationship(@PathVariable Long id) {
        relationshipService.deleteRelationship(id);
        return ResponseEntity.noContent().build();
    }
}
