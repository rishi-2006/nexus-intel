package com.nexusintel.controller;

import com.nexusintel.dto.EntityDTO;
import com.nexusintel.entity.EntityType;
import com.nexusintel.service.EntityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entities")
public class EntityController {

    private final EntityService entityService;

    public EntityController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping
    public ResponseEntity<Page<EntityDTO>> getEntities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EntityType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Sort sortObj = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "asc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return ResponseEntity.ok(entityService.getEntities(search, type, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityDTO> getEntityById(@PathVariable Long id) {
        return ResponseEntity.ok(entityService.getEntityById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<EntityDTO> getEntityByCode(@PathVariable String code) {
        return ResponseEntity.ok(entityService.getEntityByCode(code));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<EntityDTO> createEntity(@Valid @RequestBody EntityDTO dto) {
        EntityDTO created = entityService.createEntity(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<EntityDTO> updateEntity(@PathVariable Long id, @Valid @RequestBody EntityDTO dto) {
        return ResponseEntity.ok(entityService.updateEntity(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEntity(@PathVariable Long id) {
        entityService.deleteEntity(id);
        return ResponseEntity.noContent().build();
    }
}
