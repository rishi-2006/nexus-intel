package com.nexusintel.service;

import com.nexusintel.dto.EntityDTO;
import com.nexusintel.entity.EntityType;
import com.nexusintel.entity.IntelligenceEntity;
import com.nexusintel.exception.DuplicateResourceException;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.IntelligenceEntityRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EntityService {

    private final IntelligenceEntityRepository entityRepository;
    private final EntityMapper entityMapper;

    // Unit 2: Constructor dependency injection
    public EntityService(IntelligenceEntityRepository entityRepository, EntityMapper entityMapper) {
        this.entityRepository = entityRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public Page<EntityDTO> getEntities(String search, EntityType type, Pageable pageable) {
        Page<IntelligenceEntity> page;
        if (search != null && !search.trim().isEmpty()) {
            page = entityRepository.searchEntities(search.trim(), pageable);
        } else if (type != null) {
            page = entityRepository.findByEntityType(type, pageable);
        } else {
            page = entityRepository.findAll(pageable);
        }
        return page.map(entityMapper::toEntityDTO);
    }

    @Cacheable(value = "entities", key = "#id")
    @Transactional(readOnly = true)
    public EntityDTO getEntityById(Long id) {
        IntelligenceEntity entity = entityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found with ID: " + id));
        return entityMapper.toEntityDTO(entity);
    }

    @Transactional(readOnly = true)
    public EntityDTO getEntityByCode(String code) {
        IntelligenceEntity entity = entityRepository.findByEntityCode(code.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found with code: " + code));
        return entityMapper.toEntityDTO(entity);
    }

    @CacheEvict(value = {"entities", "networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public EntityDTO createEntity(EntityDTO dto) {
        String code = dto.getEntityCode().trim().toUpperCase();
        if (entityRepository.existsByEntityCode(code)) {
            throw new DuplicateResourceException("Entity code " + code + " already exists");
        }

        IntelligenceEntity entity = new IntelligenceEntity();
        entity.setEntityCode(code);
        entity.setName(dto.getName().trim());
        entity.setEntityType(dto.getEntityType());
        entity.setRiskScore(dto.getRiskScore() != null ? dto.getRiskScore() : 0.0);
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        entity.setDetailsJson(dto.getDetailsJson());

        IntelligenceEntity saved = entityRepository.save(entity);
        return entityMapper.toEntityDTO(saved);
    }

    @CacheEvict(value = {"entities", "networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public EntityDTO updateEntity(Long id, EntityDTO dto) {
        IntelligenceEntity existing = entityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found with ID: " + id));

        existing.setName(dto.getName().trim());
        if (dto.getEntityType() != null) existing.setEntityType(dto.getEntityType());
        if (dto.getRiskScore() != null) existing.setRiskScore(dto.getRiskScore());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());
        existing.setDetailsJson(dto.getDetailsJson());

        IntelligenceEntity updated = entityRepository.save(existing);
        return entityMapper.toEntityDTO(updated);
    }

    @CacheEvict(value = {"entities", "networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public void deleteEntity(Long id) {
        if (!entityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Entity not found with ID: " + id);
        }
        entityRepository.deleteById(id);
    }
}
