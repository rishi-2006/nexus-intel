package com.nexusintel.controller;

import com.nexusintel.dto.EvidenceDTO;
import com.nexusintel.entity.EvidenceType;
import com.nexusintel.service.EvidenceService;
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
@RequestMapping("/api/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @GetMapping
    public ResponseEntity<Page<EvidenceDTO>> getEvidence(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EvidenceType type,
            @RequestParam(required = false) Long caseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("collectedAt").descending());
        return ResponseEntity.ok(evidenceService.getEvidence(search, type, caseId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvidenceDTO> getEvidenceById(@PathVariable Long id) {
        return ResponseEntity.ok(evidenceService.getEvidenceById(id));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<EvidenceDTO>> getEvidenceByCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(evidenceService.getEvidenceByCase(caseId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")
    public ResponseEntity<EvidenceDTO> createEvidence(@Valid @RequestBody EvidenceDTO dto) {
        EvidenceDTO created = evidenceService.createEvidence(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")
    public ResponseEntity<EvidenceDTO> updateEvidence(@PathVariable Long id, @Valid @RequestBody EvidenceDTO dto) {
        return ResponseEntity.ok(evidenceService.updateEvidence(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")
    public ResponseEntity<Void> deleteEvidence(@PathVariable Long id) {
        evidenceService.deleteEvidence(id);
        return ResponseEntity.noContent().build();
    }
}
