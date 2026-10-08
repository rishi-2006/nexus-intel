package com.nexusintel.ai;

import com.nexusintel.dto.AIChatRequest;
import com.nexusintel.dto.AIChatResponse;
import com.nexusintel.entity.Evidence;
import com.nexusintel.entity.IntelligenceEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RAGService {

    private final ContextService contextService;
    private final EmbeddingService embeddingService;
    private final VectorSearchService vectorSearchService;
    private final LLMService llmService;

    public RAGService(ContextService contextService,
                      EmbeddingService embeddingService,
                      VectorSearchService vectorSearchService,
                      LLMService llmService) {
        this.contextService = contextService;
        this.embeddingService = embeddingService;
        this.vectorSearchService = vectorSearchService;
        this.llmService = llmService;
    }

    public AIChatResponse processQuery(AIChatRequest request) {
        String query = request.getQuery().trim();

        // 1. Retrieve relevant application records from MySQL
        ContextService.RetrievalContext ctx = contextService.retrieveContext(
                query,
                request.getCaseId(),
                request.getEntityCode()
        );

        // 2. Generate vector representation for semantic indexing
        float[] queryEmbedding = embeddingService.generateEmbedding(query);

        // 3. Unit 7: Construct document chunks and perform vector similarity search
        List<VectorSearchService.DocumentChunk> chunks = new ArrayList<>();
        for (Evidence ev : ctx.matchedEvidence) {
            String content = ev.getEvidenceCode() + " " + ev.getTitle() + " " + ev.getDescription();
            float[] vec = embeddingService.generateEmbedding(content);
            chunks.add(new VectorSearchService.DocumentChunk(ev.getEvidenceCode(), content, vec, Map.of("type", "EVIDENCE")));
        }
        for (IntelligenceEntity ent : ctx.matchedEntities) {
            String content = ent.getEntityCode() + " " + ent.getName() + " " + ent.getDetailsJson();
            float[] vec = embeddingService.generateEmbedding(content);
            chunks.add(new VectorSearchService.DocumentChunk(ent.getEntityCode(), content, vec, Map.of("type", "ENTITY")));
        }

        List<VectorSearchService.ScoredResult> rankedChunks = vectorSearchService.search(queryEmbedding, chunks, 5);

        // 4. Delegate to LLM with Grounded Context Injection
        String answer = llmService.generateResponse(query, ctx.structuredSummary, ctx);

        // 5. Assemble Evidence references and source citations
        List<String> evidenceRefs = new ArrayList<>();
        List<String> sources = new ArrayList<>();

        for (Evidence ev : ctx.matchedEvidence) {
            evidenceRefs.add(ev.getEvidenceCode());
            sources.add(ev.getEvidenceCode() + ": " + ev.getTitle());
        }

        double confidence = 0.75;
        if (!rankedChunks.isEmpty()) {
            confidence = Math.min(0.98, Math.max(0.60, rankedChunks.get(0).getScore() + 0.30));
        } else if (!ctx.matchedEvidence.isEmpty()) {
            confidence = 0.92;
        }

        return new AIChatResponse(
                query,
                answer,
                evidenceRefs,
                sources,
                confidence
        );
    }
}
