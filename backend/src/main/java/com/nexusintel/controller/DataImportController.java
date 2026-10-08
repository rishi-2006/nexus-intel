package com.nexusintel.controller;

import com.nexusintel.dto.DataImportResponse;
import com.nexusintel.service.DataImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class DataImportController {

    private final DataImportService dataImportService;

    public DataImportController(DataImportService dataImportService) {
        this.dataImportService = dataImportService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR','ANALYST')")
    public ResponseEntity<DataImportResponse> importData(@RequestParam("file") MultipartFile file) {
        DataImportResponse response = dataImportService.importFile(file);
        return ResponseEntity.ok(response);
    }
}
