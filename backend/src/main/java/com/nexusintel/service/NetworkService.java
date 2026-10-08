package com.nexusintel.service;

import com.nexusintel.dto.NetworkGraphDTO;
import com.nexusintel.dto.NetworkLinkDTO;
import com.nexusintel.dto.NetworkNodeDTO;
import com.nexusintel.entity.IntelligenceEntity;
import com.nexusintel.entity.Relationship;
import com.nexusintel.repository.CaseFileRepository;
import com.nexusintel.repository.IntelligenceEntityRepository;
import com.nexusintel.repository.RelationshipRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class NetworkService {

    private final IntelligenceEntityRepository entityRepository;
    private final RelationshipRepository relationshipRepository;
    private final CaseFileRepository caseRepository;

    public NetworkService(IntelligenceEntityRepository entityRepository,
                          RelationshipRepository relationshipRepository,
                          CaseFileRepository caseRepository) {
        this.entityRepository = entityRepository;
        this.relationshipRepository = relationshipRepository;
        this.caseRepository = caseRepository;
    }

    @Cacheable(value = "networkGraph", key = "#caseId != null ? #caseId : 'ALL'")
    @Transactional(readOnly = true)
    public NetworkGraphDTO getNetworkGraph(Long caseId) {
        List<IntelligenceEntity> entities;
        if (caseId != null) {
            entities = caseRepository.findById(caseId)
                    .map(c -> (List<IntelligenceEntity>) new ArrayList<IntelligenceEntity>(c.getEntities()))
                    .orElseGet(ArrayList::new);
        } else {
            entities = entityRepository.findAll();
        }

        Set<Long> entityIdSet = new HashSet<>();
        for (IntelligenceEntity e : entities) {
            entityIdSet.add(e.getId());
        }

        List<Relationship> allRelationships = relationshipRepository.findAllWithEntities();
        List<Relationship> relevantRelationships = new ArrayList<>();
        Map<Long, Integer> degreeMap = new HashMap<>();

        for (Relationship r : allRelationships) {
            boolean srcIn = entityIdSet.contains(r.getSourceEntity().getId());
            boolean tgtIn = entityIdSet.contains(r.getTargetEntity().getId());

            if (caseId == null || (srcIn && tgtIn)) {
                relevantRelationships.add(r);
                degreeMap.put(r.getSourceEntity().getId(), degreeMap.getOrDefault(r.getSourceEntity().getId(), 0) + 1);
                degreeMap.put(r.getTargetEntity().getId(), degreeMap.getOrDefault(r.getTargetEntity().getId(), 0) + 1);
            }
        }

        List<NetworkNodeDTO> nodes = new ArrayList<>();
        for (IntelligenceEntity e : entities) {
            nodes.add(new NetworkNodeDTO(
                    e.getEntityCode(),
                    e.getId(),
                    e.getName(),
                    e.getEntityType(),
                    e.getRiskScore(),
                    e.getStatus(),
                    degreeMap.getOrDefault(e.getId(), 0),
                    e.getDetailsJson()
            ));
        }

        List<NetworkLinkDTO> links = new ArrayList<>();
        for (Relationship r : relevantRelationships) {
            links.add(new NetworkLinkDTO(
                    String.valueOf(r.getId()),
                    r.getSourceEntity().getEntityCode(),
                    r.getTargetEntity().getEntityCode(),
                    r.getRelationshipType(),
                    r.getWeight(),
                    r.getRelationshipType().name()
            ));
        }

        return new NetworkGraphDTO(nodes, links);
    }

    @Transactional(readOnly = true)
    public List<String> findShortestPath(String sourceCode, String targetCode) {
        if (sourceCode.equalsIgnoreCase(targetCode)) {
            return Collections.singletonList(sourceCode);
        }

        List<Relationship> relationships = relationshipRepository.findAllWithEntities();
        Map<String, List<String>> adj = new HashMap<>();

        for (Relationship r : relationships) {
            String u = r.getSourceEntity().getEntityCode().toUpperCase();
            String v = r.getTargetEntity().getEntityCode().toUpperCase();
            adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
        }

        String start = sourceCode.toUpperCase();
        String end = targetCode.toUpperCase();

        if (!adj.containsKey(start) || !adj.containsKey(end)) {
            return Collections.emptyList();
        }

        // BFS for shortest unweighted hop path
        Queue<String> queue = new LinkedList<>();
        Map<String, String> parent = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(start);
        visited.add(start);

        boolean found = false;
        while (!queue.isEmpty()) {
            String curr = queue.poll();
            if (curr.equals(end)) {
                found = true;
                break;
            }

            for (String neighbor : adj.getOrDefault(curr, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parent.put(neighbor, curr);
                    queue.add(neighbor);
                }
            }
        }

        if (!found) return Collections.emptyList();

        List<String> path = new ArrayList<>();
        String step = end;
        while (step != null) {
            path.add(0, step);
            step = parent.get(step);
        }
        return path;
    }
}
