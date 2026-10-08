package com.nexusintel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexusintel.dto.DataImportResponse;
import com.nexusintel.entity.EntityType;
import com.nexusintel.entity.IntelligenceEntity;
import com.nexusintel.repository.IntelligenceEntityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataImportService {

    private static final Logger log = LoggerFactory.getLogger(DataImportService.class);
    private final IntelligenceEntityRepository entityRepository;
    private final ObjectMapper objectMapper;

    public DataImportService(IntelligenceEntityRepository entityRepository, ObjectMapper objectMapper) {
        this.entityRepository = entityRepository;
        this.objectMapper = objectMapper;
    }

    @CacheEvict(value = {"entities", "networkGraph", "dashboardStats"}, allEntries = true)
    @Transactional
    public DataImportResponse importFile(MultipartFile file) {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        List<String> errors = new ArrayList<>();
        int count = 0;

        try {
            if (filename.endsWith(".json")) {
                JsonNode root = objectMapper.readTree(file.getInputStream());
                if (root.isArray()) {
                    for (JsonNode node : root) {
                        try {
                            String code = node.has("entityCode") ? node.get("entityCode").asText() : "IMP-" + (1000 + (int)(Math.random()*9000));
                            String name = node.has("name") ? node.get("name").asText() : "Imported Entity";
                            String typeStr = node.has("entityType") ? node.get("entityType").asText().toUpperCase() : "PERSON";
                            EntityType type = EntityType.valueOf(typeStr);
                            double risk = node.has("riskScore") ? node.get("riskScore").asDouble() : 0.0;

                            if (!entityRepository.existsByEntityCode(code)) {
                                IntelligenceEntity entity = new IntelligenceEntity(code, name, type, risk, "ACTIVE", "Imported via JSON");
                                entityRepository.save(entity);
                                count++;
                            }
                        } catch (Exception e) {
                            errors.add("Row error: " + e.getMessage());
                        }
                    }
                }
            } else if (filename.endsWith(".csv") || filename.endsWith(".txt")) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    boolean first = true;
                    while ((line = reader.readLine()) != null) {
                        if (first) {
                            first = false;
                            if (line.toLowerCase().contains("code") || line.toLowerCase().contains("name")) continue;
                        }
                        if (line.trim().isEmpty()) continue;
                        String[] parts = line.split("[,;\t]");
                        if (parts.length >= 2) {
                            String code = parts[0].trim();
                            String name = parts[1].trim();
                            EntityType type = EntityType.PERSON;
                            if (parts.length >= 3) {
                                try {
                                    type = EntityType.valueOf(parts[2].trim().toUpperCase());
                                } catch (Exception ignored) {}
                            }
                            double risk = 0.5;
                            if (parts.length >= 4) {
                                try {
                                    risk = Double.parseDouble(parts[3].trim());
                                } catch (Exception ignored) {}
                            }

                            if (!entityRepository.existsByEntityCode(code)) {
                                IntelligenceEntity entity = new IntelligenceEntity(code, name, type, risk, "ACTIVE", "Imported via CSV/TXT");
                                entityRepository.save(entity);
                                count++;
                            }
                        }
                    }
                }
            } else {
                return new DataImportResponse("FAILED", 0, List.of("Unsupported file format. Please upload CSV, JSON, or TXT."), "File format error");
            }

            return new DataImportResponse("SUCCESS", count, errors, "Successfully imported " + count + " records into repository.");
        } catch (Exception e) {
            log.error("Data ingestion failure: ", e);
            return new DataImportResponse("FAILED", 0, List.of(e.getMessage()), "Failed to parse and store file content.");
        }
    }
}
