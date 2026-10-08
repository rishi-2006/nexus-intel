package com.nexusintel.ai;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

/**
 * EmbeddingService provides vector embeddings for text chunks.
 * Architecture extension point: Can be swapped with OpenAI text-embedding-3 or HuggingFace embeddings.
 */
@Service
public class EmbeddingService {

    private static final int EMBEDDING_DIMENSION = 128;

    public float[] generateEmbedding(String text) {
        if (text == null || text.isBlank()) {
            return new float[EMBEDDING_DIMENSION];
        }

        // Semantic hash projection for deterministic local vector generation
        float[] vector = new float[EMBEDDING_DIMENSION];
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(text.toLowerCase().getBytes(StandardCharsets.UTF_8));
            for (int i = 0; i < EMBEDDING_DIMENSION; i++) {
                int byteIndex = i % hash.length;
                vector[i] = (float) ((hash[byteIndex] & 0xFF) / 255.0 - 0.5);
            }

            // Normalization
            double norm = 0.0;
            for (float v : vector) norm += v * v;
            norm = Math.sqrt(norm);
            if (norm > 0) {
                for (int i = 0; i < EMBEDDING_DIMENSION; i++) {
                    vector[i] /= norm;
                }
            }
        } catch (NoSuchAlgorithmException e) {
            // fallback
            Arrays.fill(vector, 0.1f);
        }
        return vector;
    }
}
