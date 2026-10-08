package com.nexusintel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexusintel.dto.LoginRequest;
import com.nexusintel.dto.RegisterRequest;
import com.nexusintel.entity.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class NexusIntelIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testEndToEndAuthAndProtectedAccess() throws Exception {
        // 1. Health check is public
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.problemStatementId").value(26189));

        // 2. Register user
        RegisterRequest registerReq = new RegisterRequest("Special Agent Carter", "carter@nexus.local", "Password123!", "Password123!", Role.INVESTIGATOR);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("carter@nexus.local"));

        // 3. Login
        LoginRequest loginReq = new LoginRequest("carter@nexus.local", "Password123!");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();

        // 4. Access protected cases endpoint
        mockMvc.perform(get("/api/cases")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 5. Unauthenticated request to protected endpoint returns 401/403
        mockMvc.perform(get("/api/cases"))
                .andExpect(status().isForbidden());
    }
}
