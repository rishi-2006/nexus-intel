package com.nexusintel.ai;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class VectorSearchService {

    public static class DocumentChunk {
        private final String id;
        private final String content;
        private final float[] vector;
        private final Map<String, Object> metadata;

        public DocumentChunk(String id, String content, float[] vector, Map<String, Object> metadata) {
            this.id = id;
            this.content = content;
            this.vector = vector;
            this.metadata = metadata;
        }

        public String getId() {
            return id;
        }

        public String getContent() {
            return content;
        }

        public float[] getVector() {
            return vector;
        }

        public Map<String, Object> getMetadata() {
            return metadata;
        }
    }

    public static class ScoredResult {
        private final DocumentChunk chunk;
        private final double score;

        public ScoredResult(DocumentChunk chunk, double score) {
            this.chunk = chunk;
            this.score = score;
        }

        public DocumentChunk getChunk() {
            return chunk;
        }

        public double getScore() {
            return score;
        }
    }

    public List<ScoredResult> search(float[] queryVector, List<DocumentChunk> chunks, int topK) {
        if (queryVector == null || chunks == null || chunks.isEmpty()) {
            return new ArrayList<>();
        }

        List<ScoredResult> scored = new ArrayList<>();
        for (DocumentChunk chunk : chunks) {
            double sim = cosineSimilarity(queryVector, chunk.getVector());
            scored.add(new ScoredResult(chunk, sim));
        }

        scored.sort(Comparator.comparingDouble(ScoredResult::getScore).reversed());
        return scored.subList(0, Math.min(topK, scored.size()));
    }

    public double cosineSimilarity(float[] vecA, float[] vecB) {
        if (vecA == null || vecB == null || vecA.length != vecB.length) return 0.0;
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA <= 0.0 || normB <= 0.0) return 0.0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
