package com.nexusintel.service;

import com.nexusintel.dto.EvidenceDTO;
import com.nexusintel.entity.CaseFile;
import com.nexusintel.entity.Evidence;
import com.nexusintel.entity.EvidenceType;
import com.nexusintel.exception.DuplicateResourceException;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.CaseFileRepository;
import com.nexusintel.repository.EvidenceRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final CaseFileRepository caseRepository;
    private final EntityMapper entityMapper;

    public EvidenceService(EvidenceRepository evidenceRepository,
                           CaseFileRepository caseRepository,
                           EntityMapper entityMapper) {
        this.evidenceRepository = evidenceRepository;
        this.caseRepository = caseRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional(readOnly = true)
    public Page<EvidenceDTO> getEvidence(String search, EvidenceType type, Long caseId, Pageable pageable) {
        Page<Evidence> page;
        if (search != null && !search.trim().isEmpty()) {
            page = evidenceRepository.searchEvidence(search.trim(), pageable);
        } else if (caseId != null) {
            page = evidenceRepository.findByCaseFileId(caseId, pageable);
        } else if (type != null) {
            page = evidenceRepository.findByEvidenceType(type, pageable);
        } else {
            page = evidenceRepository.findAll(pageable);
        }
        return page.map(entityMapper::toEvidenceDTO);
    }

    @Transactional(readOnly = true)
    public List<EvidenceDTO> getEvidenceByCase(Long caseId) {
        return evidenceRepository.findByCaseFileId(caseId).stream()
                .map(entityMapper::toEvidenceDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public EvidenceDTO getEvidenceById(Long id) {
        Evidence evidence = evidenceRepository.findByIdWithCase(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with ID: " + id));
        return entityMapper.toEvidenceDTO(evidence);
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    @Transactional
    public EvidenceDTO createEvidence(EvidenceDTO dto) {
        String code = dto.getEvidenceCode().trim().toUpperCase();
        if (evidenceRepository.existsByEvidenceCode(code)) {
            throw new DuplicateResourceException("Evidence code " + code + " already exists");
        }

        CaseFile caseFile = caseRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + dto.getCaseId()));

        Evidence evidence = new Evidence();
        evidence.setEvidenceCode(code);
        evidence.setCaseFile(caseFile);
        evidence.setTitle(dto.getTitle().trim());
        evidence.setDescription(dto.getDescription());
        evidence.setEvidenceType(dto.getEvidenceType());
        evidence.setFileUrl(dto.getFileUrl());
        evidence.setChainOfCustody(dto.getChainOfCustody());
        evidence.setVerified(dto.getVerified() != null ? dto.getVerified() : false);

        Evidence saved = evidenceRepository.save(evidence);
        return entityMapper.toEvidenceDTO(saved);
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    @Transactional
    public EvidenceDTO updateEvidence(Long id, EvidenceDTO dto) {
        Evidence existing = evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with ID: " + id));

        existing.setTitle(dto.getTitle().trim());
        existing.setDescription(dto.getDescription());
        if (dto.getEvidenceType() != null) existing.setEvidenceType(dto.getEvidenceType());
        existing.setFileUrl(dto.getFileUrl());
        existing.setChainOfCustody(dto.getChainOfCustody());
        if (dto.getVerified() != null) existing.setVerified(dto.getVerified());

        if (dto.getCaseId() != null && !dto.getCaseId().equals(existing.getCaseFile().getId())) {
            CaseFile newCase = caseRepository.findById(dto.getCaseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + dto.getCaseId()));
            existing.setCaseFile(newCase);
        }

        Evidence updated = evidenceRepository.save(existing);
        return entityMapper.toEvidenceDTO(updated);
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    @Transactional
    public void deleteEvidence(Long id) {
        if (!evidenceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evidence not found with ID: " + id);
        }
        evidenceRepository.deleteById(id);
    }
}
