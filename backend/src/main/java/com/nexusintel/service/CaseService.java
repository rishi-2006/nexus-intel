package com.nexusintel.service;

import com.nexusintel.dto.CaseDTO;
import com.nexusintel.entity.CaseFile;
import com.nexusintel.entity.CaseStatus;
import com.nexusintel.entity.IntelligenceEntity;
import com.nexusintel.entity.User;
import com.nexusintel.exception.DuplicateResourceException;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.CaseFileRepository;
import com.nexusintel.repository.IntelligenceEntityRepository;
import com.nexusintel.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CaseService {

    private final CaseFileRepository caseRepository;
    private final UserRepository userRepository;
    private final IntelligenceEntityRepository entityRepository;
    private final EntityMapper entityMapper;

    // Unit 2: Constructor dependency injection
    public CaseService(CaseFileRepository caseRepository,
                       UserRepository userRepository,
                       IntelligenceEntityRepository entityRepository,
                       EntityMapper entityMapper) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.entityRepository = entityRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public Page<CaseDTO> getCases(String search, CaseStatus status, Pageable pageable) {
        Page<CaseFile> cases;
        if (search != null && !search.trim().isEmpty()) {
            cases = caseRepository.searchCases(search.trim(), pageable);
        } else if (status != null) {
            cases = caseRepository.findByStatus(status, pageable);
        } else {
            cases = caseRepository.findAll(pageable);
        }
        return cases.map(entityMapper::toCaseDTO);
    }

    @Cacheable(value = "cases", key = "#id")
    @Transactional(readOnly = true)
    public CaseDTO getCaseById(Long id) {
        CaseFile caseFile = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + id));
        return entityMapper.toCaseDTO(caseFile);
    }

    @CacheEvict(value = {"cases", "dashboardStats"}, allEntries = true)
    @Transactional
    public CaseDTO createCase(CaseDTO dto, String userEmail) {
        if (caseRepository.existsByCaseNumber(dto.getCaseNumber().trim())) {
            throw new DuplicateResourceException("Case number " + dto.getCaseNumber() + " already exists");
        }

        CaseFile caseFile = new CaseFile();
        caseFile.setCaseNumber(dto.getCaseNumber().trim());
        caseFile.setTitle(dto.getTitle().trim());
        caseFile.setDescription(dto.getDescription());
        caseFile.setStatus(dto.getStatus());
        caseFile.setPriority(dto.getPriority());

        if (dto.getAssignedUserId() != null) {
            User user = userRepository.findById(dto.getAssignedUserId())
                    .orElse(null);
            caseFile.setAssignedUser(user);
        } else if (userEmail != null) {
            userRepository.findByEmail(userEmail).ifPresent(caseFile::setAssignedUser);
        }

        // Link entities if provided
        if (dto.getEntityCodes() != null && !dto.getEntityCodes().isEmpty()) {
            Set<IntelligenceEntity> entities = new HashSet<>();
            for (String code : dto.getEntityCodes()) {
                entityRepository.findByEntityCode(code.trim()).ifPresent(entities::add);
            }
            caseFile.setEntities(entities);
        }

        CaseFile saved = caseRepository.save(caseFile);
        return entityMapper.toCaseDTO(saved);
    }

    @CacheEvict(value = {"cases", "dashboardStats"}, allEntries = true)
    @Transactional
    public CaseDTO updateCase(Long id, CaseDTO dto) {
        CaseFile existing = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + id));

        existing.setTitle(dto.getTitle().trim());
        existing.setDescription(dto.getDescription());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());
        if (dto.getPriority() != null) existing.setPriority(dto.getPriority());

        if (dto.getAssignedUserId() != null) {
            userRepository.findById(dto.getAssignedUserId()).ifPresent(existing::setAssignedUser);
        }

        if (dto.getEntityCodes() != null) {
            Set<IntelligenceEntity> entities = new HashSet<>();
            for (String code : dto.getEntityCodes()) {
                entityRepository.findByEntityCode(code.trim()).ifPresent(entities::add);
            }
            existing.setEntities(entities);
        }

        CaseFile updated = caseRepository.save(existing);
        return entityMapper.toCaseDTO(updated);
    }

    @CacheEvict(value = {"cases", "dashboardStats"}, allEntries = true)
    @Transactional
    public void deleteCase(Long id) {
        if (!caseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Case not found with ID: " + id);
        }
        caseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CaseDTO> getRecentCases() {
        return caseRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(6)
                .map(entityMapper::toCaseDTO)
                .toList();
    }
}
