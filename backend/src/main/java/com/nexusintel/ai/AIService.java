package com.nexusintel.ai;

import com.nexusintel.dto.AIChatRequest;
import com.nexusintel.dto.AIChatResponse;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final RAGService ragService;

    public AIService(RAGService ragService) {
        this.ragService = ragService;
    }

    public AIChatResponse askAssistant(AIChatRequest request) {
        return ragService.processQuery(request);
    }
}
