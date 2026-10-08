package com.nexusintel.controller;

import com.nexusintel.dto.NetworkGraphDTO;
import com.nexusintel.service.NetworkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/network")
public class NetworkController {

    private final NetworkService networkService;

    public NetworkController(NetworkService networkService) {
        this.networkService = networkService;
    }

    @GetMapping
    public ResponseEntity<NetworkGraphDTO> getNetworkGraph(@RequestParam(required = false) Long caseId) {
        return ResponseEntity.ok(networkService.getNetworkGraph(caseId));
    }

    @GetMapping("/shortest-path")
    public ResponseEntity<List<String>> getShortestPath(
            @RequestParam String source,
            @RequestParam String target) {
        return ResponseEntity.ok(networkService.findShortestPath(source, target));
    }
}
