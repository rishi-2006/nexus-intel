package com.nexusintel.service;

import com.nexusintel.dto.RelationshipDTO;
import com.nexusintel.entity.IntelligenceEntity;
import com.nexusintel.entity.Relationship;
import com.nexusintel.entity.RelationshipType;
import com.nexusintel.exception.BadRequestException;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.IntelligenceEntityRepository;
import com.nexusintel.repository.RelationshipRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final IntelligenceEntityRepository entityRepository;
    private final EntityMapper entityMapper;

    public RelationshipService(RelationshipRepository relationshipRepository,
                               IntelligenceEntityRepository entityRepository,
                               EntityMapper entityMapper) {
        this.relationshipRepository = relationshipRepository;
        this.entityRepository = entityRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public Page<RelationshipDTO> getRelationships(RelationshipType type, Pageable pageable) {
        Page<Relationship> page;
        if (type != null) {
            page = relationshipRepository.findByRelationshipType(type, pageable);
        } else {
            page = relationshipRepository.findAll(pageable);
        }
        return page.map(entityMapper::toRelationshipDTO);
    }

    @Transactional(readOnly = true)
    public List<RelationshipDTO> getRelationshipsForEntity(Long entityId) {
        return relationshipRepository.findByEntityId(entityId).stream()
                .map(entityMapper::toRelationshipDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public RelationshipDTO getRelationshipById(Long id) {
        Relationship relationship = relationshipRepository.findByIdWithEntities(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found with ID: " + id));
        return entityMapper.toRelationshipDTO(relationship);
    }

    @CacheEvict(value = {"networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public RelationshipDTO createRelationship(RelationshipDTO dto) {
        if (dto.getSourceEntityId().equals(dto.getTargetEntityId())) {
            throw new BadRequestException("Source and target entity cannot be identical");
        }

        IntelligenceEntity source = entityRepository.findById(dto.getSourceEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Source entity not found with ID: " + dto.getSourceEntityId()));

        IntelligenceEntity target = entityRepository.findById(dto.getTargetEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Target entity not found with ID: " + dto.getTargetEntityId()));

        Relationship relationship = new Relationship();
        relationship.setSourceEntity(source);
        relationship.setTargetEntity(target);
        relationship.setRelationshipType(dto.getRelationshipType());
        relationship.setWeight(dto.getWeight() != null ? dto.getWeight() : 1.0);
        relationship.setDescription(dto.getDescription());

        Relationship saved = relationshipRepository.save(relationship);
        return entityMapper.toRelationshipDTO(saved);
    }

    @CacheEvict(value = {"networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public RelationshipDTO updateRelationship(Long id, RelationshipDTO dto) {
        Relationship existing = relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found with ID: " + id));

        if (dto.getRelationshipType() != null) existing.setRelationshipType(dto.getRelationshipType());
        if (dto.getWeight() != null) existing.setWeight(dto.getWeight());
        existing.setDescription(dto.getDescription());

        Relationship updated = relationshipRepository.save(existing);
        return entityMapper.toRelationshipDTO(updated);
    }

    @CacheEvict(value = {"networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public void deleteRelationship(Long id) {
        if (!relationshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Relationship not found with ID: " + id);
        }
        relationshipRepository.deleteById(id);
    }
}
