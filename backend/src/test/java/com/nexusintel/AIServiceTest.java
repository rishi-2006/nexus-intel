package com.nexusintel;

import com.nexusintel.ai.AIService;
import com.nexusintel.ai.RAGService;
import com.nexusintel.dto.AIChatRequest;
import com.nexusintel.dto.AIChatResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AIServiceTest {

    @Mock
    private RAGService ragService;

    private AIService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AIService(ragService);
    }

    @Test
    void askAssistant_ReturnsGroundedEvidenceResponse() {
        AIChatRequest req = new AIChatRequest("Show connections of P102", 1L, "P102");
        AIChatResponse mockRes = new AIChatResponse(
                "Show connections of P102",
                "P102 has 8 recorded relationships in current scope.",
                List.of("E1024", "E1025"),
                List.of("E1024: Forensic Wiretap Log"),
                0.95
        );

        when(ragService.processQuery(any(AIChatRequest.class))).thenReturn(mockRes);

        AIChatResponse response = aiService.askAssistant(req);

        assertNotNull(response);
        assertTrue(response.getAnswer().contains("8 recorded relationships"));
        assertTrue(response.getEvidenceReferences().contains("E1024"));
        assertTrue(response.getDisclaimer().contains("human verification"));
    }
}
