package com.nexusintel;

import com.nexusintel.dto.EntityDTO;
import com.nexusintel.entity.EntityType;
import com.nexusintel.entity.IntelligenceEntity;
import com.nexusintel.exception.DuplicateResourceException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.IntelligenceEntityRepository;
import com.nexusintel.service.EntityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EntityServiceTest {

    @Mock
    private IntelligenceEntityRepository entityRepository;
    @Mock
    private EntityMapper entityMapper;

    private EntityService entityService;

    @BeforeEach
    void setUp() {
        entityService = new EntityService(entityRepository, entityMapper);
    }

    @Test
    void createEntity_Success() {
        EntityDTO dto = new EntityDTO(null, "P999", "Subject Test", EntityType.PERSON, 0.85, "ACTIVE", "{}", 0, 0, null, null);
        when(entityRepository.existsByEntityCode("P999")).thenReturn(false);

        IntelligenceEntity entity = new IntelligenceEntity("P999", "Subject Test", EntityType.PERSON, 0.85, "ACTIVE", "{}");
        entity.setId(50L);
        when(entityRepository.save(any(IntelligenceEntity.class))).thenReturn(entity);
        when(entityMapper.toEntityDTO(entity)).thenReturn(new EntityDTO(50L, "P999", "Subject Test", EntityType.PERSON, 0.85, "ACTIVE", "{}", 0, 0, null, null));

        EntityDTO created = entityService.createEntity(dto);

        assertNotNull(created);
        assertEquals("P999", created.getEntityCode());
        verify(entityRepository).save(any(IntelligenceEntity.class));
    }

    @Test
    void createEntity_DuplicateCode_ThrowsException() {
        EntityDTO dto = new EntityDTO(null, "P101", "Existing Subject", EntityType.PERSON, 0.5, "ACTIVE", "{}", 0, 0, null, null);
        when(entityRepository.existsByEntityCode("P101")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> entityService.createEntity(dto));
        verify(entityRepository, never()).save(any());
    }

    @Test
    void getEntityByCode_Success() {
        IntelligenceEntity entity = new IntelligenceEntity("P102", "Julian Vance", EntityType.PERSON, 0.90, "ACTIVE", "{}");
        when(entityRepository.findByEntityCode("P102")).thenReturn(Optional.of(entity));
        when(entityMapper.toEntityDTO(entity)).thenReturn(new EntityDTO(2L, "P102", "Julian Vance", EntityType.PERSON, 0.90, "ACTIVE", "{}", 5, 2, null, null));

        EntityDTO found = entityService.getEntityByCode("P102");
        assertNotNull(found);
        assertEquals("Julian Vance", found.getName());
    }
}
