package com.nexusintel;

import com.nexusintel.dto.CaseDTO;
import com.nexusintel.entity.CaseFile;
import com.nexusintel.entity.CasePriority;
import com.nexusintel.entity.CaseStatus;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.CaseFileRepository;
import com.nexusintel.repository.IntelligenceEntityRepository;
import com.nexusintel.repository.UserRepository;
import com.nexusintel.service.CaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CaseServiceTest {

    @Mock
    private CaseFileRepository caseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private IntelligenceEntityRepository entityRepository;
    @Mock
    private EntityMapper entityMapper;

    private CaseService caseService;

    @BeforeEach
    void setUp() {
        caseService = new CaseService(caseRepository, userRepository, entityRepository, entityMapper);
    }

    @Test
    void getCases_WithPagination() {
        CaseFile cf = new CaseFile("C-2024-001", "Op Alpha", "Desc", CaseStatus.OPEN, CasePriority.HIGH);
        Pageable pageable = PageRequest.of(0, 10);
        when(caseRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(cf)));
        when(entityMapper.toCaseDTO(cf)).thenReturn(new CaseDTO(1L, "C-2024-001", "Op Alpha", "Desc", CaseStatus.OPEN, CasePriority.HIGH, null, null, Set.of(), 0, 0, null, null));

        Page<CaseDTO> result = caseService.getCases(null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("C-2024-001", result.getContent().get(0).getCaseNumber());
    }

    @Test
    void createCase_Success() {
        CaseDTO dto = new CaseDTO(null, "C-2024-999", "New Case", "Testing", CaseStatus.OPEN, CasePriority.HIGH, null, null, Set.of(), 0, 0, null, null);
        when(caseRepository.existsByCaseNumber("C-2024-999")).thenReturn(false);

        CaseFile saved = new CaseFile("C-2024-999", "New Case", "Testing", CaseStatus.OPEN, CasePriority.HIGH);
        saved.setId(10L);
        when(caseRepository.save(any(CaseFile.class))).thenReturn(saved);
        when(entityMapper.toCaseDTO(saved)).thenReturn(new CaseDTO(10L, "C-2024-999", "New Case", "Testing", CaseStatus.OPEN, CasePriority.HIGH, null, null, Set.of(), 0, 0, null, null));

        CaseDTO created = caseService.createCase(dto, "investigator@nexus.local");

        assertNotNull(created);
        assertEquals(10L, created.getId());
        verify(caseRepository).save(any(CaseFile.class));
    }

    @Test
    void getCaseById_Found() {
        CaseFile cf = new CaseFile("C-2024-001", "Op Alpha", "Desc", CaseStatus.OPEN, CasePriority.HIGH);
        cf.setId(1L);
        when(caseRepository.findById(1L)).thenReturn(Optional.of(cf));
        when(entityMapper.toCaseDTO(cf)).thenReturn(new CaseDTO(1L, "C-2024-001", "Op Alpha", "Desc", CaseStatus.OPEN, CasePriority.HIGH, null, null, Set.of(), 0, 0, null, null));

        CaseDTO found = caseService.getCaseById(1L);
        assertNotNull(found);
        assertEquals("C-2024-001", found.getCaseNumber());
    }
}
