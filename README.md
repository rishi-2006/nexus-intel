# NEXUS INTEL
## AI-Powered Criminal Network Analysis System
### Problem Statement ID: 26189

> **Compliance & Ethical Policy Notice:**  
> NEXUS INTEL is an investigative decision-support and intelligence analysis platform. The system does **not** automatically determine guilt, declare individuals criminals, or make autonomous enforcement decisions. All analytical signals and AI inferences require verification by authorized human investigators. All pre-seeded and imported data consists strictly of synthetic and anonymized records.

---

## 1. Executive Project Overview
**NEXUS INTEL** is an enterprise-grade full-stack intelligence and law-enforcement analysis suite designed for cross-border criminal network investigation, complex entity resolution, relational topology analysis, and AI-assisted conversational dossier generation.

Built to fulfill the comprehensive **Unit 1–10 Technical Training Syllabus**, NEXUS INTEL demonstrates clean client-server architecture, relational modeling, stateless JWT security, and Grounded Retrieval-Augmented Generation (RAG).

---

## 2. Technical Stack Matrix

| Layer | Primary Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript, JSX, React Router v6, Axios, Context API, Tailwind CSS, Lucide Icons, React Markdown |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring MVC, Spring Data JPA, Hibernate, Spring Security 6, JJWT (0.12.6), Bean Validation (Jakarta), Spring Boot Actuator, WebClient, Logback |
| **Databases** | MySQL 8.0 (Primary production store), H2 Database (in-memory dev/test fallback) |
| **Documentation & API** | Springdoc OpenAPI 3.0 / Swagger UI (`/swagger-ui.html`), OpenAPI JSON (`/v3/api-docs`) |
| **Testing** | JUnit 5, Mockito, Spring Boot MockMvc Integration Testing |
| **DevOps & Containers** | Multi-stage Dockerfiles, Docker Compose, Nginx Alpine, Healthchecks |

---

## 3. Core Architecture

```text
React (Vite SPA)
      ↓
Axios Interceptor (Bearer JWT)
      ↓
Spring Security (SecurityFilterChain + JwtAuthenticationFilter)
      ↓
Spring Boot REST Controllers (@RestController)
      ↓
DTO Layer (Validation & Decoupling)
      ↓
Service Layer (@Service + @Transactional + @Cacheable)
      ↓
Repository Layer (Spring Data JPA interfaces)
      ↓
Hibernate ORM
      ↓
MySQL Database (Relational Schema)
```

### Authentication Architecture:
```text
React Login UI
      ↓
POST /api/auth/login
      ↓
Spring Security AuthenticationManager
      ↓
BCrypt Password Validation
      ↓
JwtService Token Issuance
      ↓
Client LocalStorage
      ↓
Axios Request Interceptor (Header: Authorization: Bearer <JWT>)
      ↓
JwtAuthenticationFilter (SecurityContext validation + MDC logging)
      ↓
Protected Controller Endpoints (@PreAuthorize)
```

### Grounded AI / RAG Architecture:
```text
React Nexus AI Chat UI
      ↓
POST /api/ai/chat
      ↓
AIController
      ↓
RAGService
      ↓
ContextService (Database SQL/JPQL Retrieval of Cases, Entities, Relationships, Evidence)
      ↓
EmbeddingService & VectorSearchService (Local Semantic Vector Scoring)
      ↓
Context Dossier Construction (Grounded Evidence Citations)
      ↓
LLMService (External LLM API via WebClient OR Deterministic Local Inference Engine)
      ↓
Structured Markdown Answer with Evidence Citations & Compliance Disclaimer
```

---

## 4. Technical Training Syllabus Mapping (Units 1 – 10)

| Unit | Syllabus Focus | Core Files & Implementation Demonstration |
| :--- | :--- | :--- |
| **Unit 1** | **Development Foundations** | • Frontend: `frontend/vite.config.js`, `frontend/src/components/` (`Navbar.jsx`, `Sidebar.jsx`, `Button.jsx`, `Input.jsx`, `Card.jsx`, `Table.jsx`, `Modal.jsx`, `Badge.jsx`, `Pagination.jsx`, `LoadingSpinner.jsx`, `ErrorMessage.jsx`, `SearchBar.jsx`).<br>• Backend: `backend/src/main/java/com/nexusintel/NexusIntelApplication.java`, `HealthController.java` (`GET /api/health`), MVC Controllers. |
| **Unit 2** | **Dynamic UI + CRUD** | • Backend CRUD: `CaseService.java`, `EntityService.java`, `RelationshipService.java`, `EvidenceService.java`, Constructor dependency injection throughout.<br>• Centralized API: `frontend/src/api/axiosClient.js`, `services/*.js`.<br>• UI CRUD: Dynamic tables with `useEffect`, loading spinners, error states, and filters. |
| **Unit 3** | **Forms, Validation & Registration** | • Frontend: `frontend/src/pages/RegisterPage.jsx` with controlled inputs, client-side validation, error banners.<br>• Backend: `RegisterRequest.java` (`@NotBlank`, `@Email`, `@Size`, `@NotNull`).<br>• Exceptions: `@ControllerAdvice` in `GlobalExceptionHandler.java` returning uniform JSON errors with timestamps and field errors. |
| **Unit 4** | **JPA Relations + Advanced CRUD** | • **@OneToMany**: `User.cases` -> `CaseFile.java`, `CaseFile.evidences` -> `Evidence.java`, `CaseFile.events` -> `TimelineEvent.java`.<br>• **@ManyToOne**: `Evidence.caseFile`, `TimelineEvent.caseFile`, `CaseFile.assignedUser`.<br>• **@OneToOne**: `User.userProfile` <-> `UserProfile.user`.<br>• **@ManyToMany**: `CaseFile` <-> `IntelligenceEntity` with join table `case_entities`.<br>• **DTO Mapping**: `EntityMapper.java` mapping entities to `UserDTO`, `CaseDTO`, `EntityDTO`, `RelationshipDTO`, `EvidenceDTO`, `EventDTO`.<br>• **Pagination & Sorting**: Spring Data `Pageable` & `Page<T>` on `/api/cases`, `/api/entities`, with frontend Next/Prev buttons. |
| **Unit 5** | **Authentication Foundations** | • Frontend: `LoginPage.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx`, `RoleGuard.jsx`.<br>• Role UI: Role-based navigation for `ADMIN`, `INVESTIGATOR`, and `ANALYST`.<br>• Environment vars: `frontend/.env.development` and `frontend/.env.production`. |
| **Unit 6** | **JWT + Spring Security** | • Security Config: `SecurityConfig.java`, `JwtAuthenticationFilter.java`, `JwtService.java`, `CustomUserDetailsService.java`.<br>• BCrypt password hashing for all user accounts.<br>• Method security: `@PreAuthorize("hasRole('ADMIN')")`, `@PreAuthorize("hasAnyRole('ADMIN','INVESTIGATOR')")`.<br>• Client: Centralized Axios interceptor attaching `Bearer <token>` and handling 401/403. |
| **Unit 7** | **AI Integration + Chatbot + RAG** | • Frontend: `NexusAIPage.jsx` with markdown rendering (`react-markdown`), prompt suggestions, source citations.<br>• Backend AI: `AIController.java`, `AIService.java`, `RAGService.java`, `ContextService.java`, `LLMService.java`, `EmbeddingService.java`, `VectorSearchService.java`.<br>• Grounded context injection, zero evidence fabrication, refusal when no record exists, and decision-support compliance disclaimers. |
| **Unit 8** | **Performance Optimization** | • Backend Cache: Spring Cache `@Cacheable(value = "dashboardStats")`, `@CacheEvict`.<br>• Async: `@Async` for background anomaly detection and audit logging.<br>• Structured Logging: `logback-spring.xml` with MDC `requestId`, `user`, endpoint, and secrets redaction.<br>• Actuator: Enabled `/actuator/health`, `/actuator/info`, `/actuator/metrics`.<br>• Frontend: `ErrorBoundary.jsx`, debounced searches, responsive Canvas rendering. |
| **Unit 9** | **Testing + Docker** | • Unit Tests: `AuthServiceTest.java`, `CaseServiceTest.java`, `EntityServiceTest.java`, `AIServiceTest.java` (JUnit 5 + Mockito).<br>• Integration Tests: `NexusIntelIntegrationTest.java` with `@SpringBootTest` and MockMvc.<br>• Frontend build: Verified production bundle with `npm run build`.<br>• Docker: `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`, and `docker-compose.yml`. |
| **Unit 10** | **Deployment & Documentation** | • OpenAPI / Swagger 3 UI: `/swagger-ui.html` documenting all 10 modules.<br>• Cloud deployment configurations for Render/Railway (Backend) and Vercel/Netlify (Frontend).<br>• Comprehensive documentation and synthetic dataset seeder. |

---

## 5. Repository Structure

```text
nexus-intel/
├── docker-compose.yml              # Multi-container orchestration (Frontend + Backend + MySQL)
├── README.md                       # Comprehensive system documentation
├── backend/
│   ├── pom.xml                     # Maven project specification (Spring Boot 3.3.4, Java 21)
│   ├── Dockerfile                  # Multi-stage Java 21 build & runtime container
│   └── src/
│       ├── main/
│       │   ├── java/com/nexusintel/
│       │   │   ├── NexusIntelApplication.java
│       │   │   ├── ai/             # Unit 7 RAG & Vector Search services
│       │   │   │   ├── AIService.java
│       │   │   │   ├── ContextService.java
│       │   │   │   ├── EmbeddingService.java
│       │   │   │   ├── LLMService.java
│       │   │   │   ├── RAGService.java
│       │   │   │   └── VectorSearchService.java
│       │   │   ├── config/         # Security, OpenAPI, and Seed configurations
│       │   │   │   ├── DataSeeder.java
│       │   │   │   └── OpenApiConfig.java
│       │   │   ├── controller/     # Unit 1-7 RESTful MVC Controllers
│       │   │   ├── dto/            # Data Transfer Objects with Bean Validation
│       │   │   ├── entity/         # JPA Domain Entities & Enums
│       │   │   ├── exception/      # Unit 3 @ControllerAdvice Global Error Handling
│       │   │   ├── mapper/         # Entity-to-DTO conversion component
│       │   │   ├── repository/     # Spring Data JPA repositories
│       │   │   ├── security/       # Unit 6 Spring Security & JJWT filter
│       │   │   └── service/        # Core business logic services
│       │   └── resources/
│       │       ├── application.yml # MySQL, JPA, JWT, and Actuator config
│       │       └── logback-spring.xml # Unit 8 structured logging format
│       └── test/java/com/nexusintel/
│           ├── AuthServiceTest.java
│           ├── CaseServiceTest.java
│           ├── EntityServiceTest.java
│           ├── AIServiceTest.java
│           └── NexusIntelIntegrationTest.java
└── frontend/
    ├── package.json                # React, Vite, Tailwind, Lucide dependencies
    ├── vite.config.js              # Vite server & backend reverse proxy
    ├── tailwind.config.js          # Intelligence dark-mode theme tokens
    ├── nginx.conf                  # Production reverse-proxy & SPA router
    ├── Dockerfile                  # Multi-stage Node build & Nginx runtime
    ├── .env.development            # Local development API config
    ├── .env.production             # Production environment config
    └── src/
        ├── api/axiosClient.js      # Centralized Axios with JWT interceptor
        ├── components/             # Reusable UI components & Canvas graph
        ├── context/                # AuthContext & ToastContext
        ├── layouts/MainLayout.jsx  # Primary shell with Navbar & Sidebar
        ├── pages/                  # 14 complete analytical views
        ├── routes/AppRoutes.jsx    # Protected routes & RoleGuard wrappers
        ├── services/               # Modular API services
        ├── App.jsx
        ├── index.css
        └── main.jsx
```

---

## 6. Pre-Seeded Demonstration Dataset

Upon first boot, `DataSeeder.java` initializes synthetic intelligence records:
- **8 Operative Accounts**: Including Admin, Lead Investigator, Senior Analyst, and Field Agents.
- **10 Formal Cases**: E.g., *Operation Apex Syndicate*, *Sovereign Cargo Smuggling*, *Cyber-Launder Cryptographic Pipeline*.
- **30 People** (`P101` to `P130`): Subject profiles, aliases, and risk scores.
- **8 Organizations** (`ORG301` to `ORG308`): Front companies and logistics conglomerates.
- **15 Burner Phones** (`PH901` to `PH915`): IMSI/IMEI identifiers.
- **10 Target Vehicles** (`V701` to `V710`): Plates, VINs, and tracker coordinates.
- **10 Geographic Hubs** (`LOC501` to `LOC510`): Seaports, freezones, and private vaults.
- **82+ Relational Edges**: Observed associations, transactions, VoIP calls, and co-locations.
- **50 Evidentiary Items** (`E1001` to `E1050`): Forensics, digital logs, and chain-of-custody tracking.
- **60 Timeline Events**: Chronological incident records.
- **32 Financial Transactions**: Wire transfers and structured crypto receipts.
- **12 Analytical Signals (Anomalies)**: Burst calls, midnight port transfers, and shell account inflows.

### Quick Demonstration Credentials:
| Role | Email | Password | Allowed Access Modules |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@nexus.local` | `Password123!` | Complete unrestricted access: Users, Audit Logs, Settings, Operations |
| **INVESTIGATOR** | `investigator@nexus.local` | `Password123!` | Cases, Entities, Evidence, Network, Timeline, AI, Anomalies, Reports |
| **ANALYST** | `analyst@nexus.local` | `Password123!` | Entities, Evidence, Analytics, Network Explorer, NEXUS AI, Data Sources |

---

## 7. How to Run the Application

### Option A: Running with Docker Compose (Recommended)
Make sure Docker Desktop is running, then execute from the project root:
```bash
docker compose up --build
```
- Frontend will be accessible at: **http://localhost** (or http://localhost:3000)
- Backend REST API will be accessible at: **http://localhost:8080**
- Swagger UI Documentation: **http://localhost:8080/swagger-ui.html**
- MySQL runs on port **3306** with persistent storage volume `nexus_mysql_data`.

---

### Option B: Running Locally on Host System

#### 1. Backend (Spring Boot):
Requirements: Java 21, Maven 3.9+, MySQL running locally on port 3306.
```bash
cd backend
mvn spring-boot:run
```
*(If local MySQL credentials differ, configure via environment variables `DB_USER` and `DB_PASS` or set in `application.yml`)*.

#### 2. Frontend (React + Vite):
Requirements: Node.js 18+, npm.
```bash
cd frontend
npm install
npm run dev
```
- Open browser at **http://localhost:5173**

---

## 8. Verifying Unit Tests & Compilation

To execute the backend JUnit 5 and Mockito test suite:
```bash
cd backend
mvn test
```
*Results: 13 tests passing, 0 failures, 0 errors.*

To build the frontend production distribution:
```bash
cd frontend
npm run build
```
*Builds production assets into `frontend/dist/` in < 8 seconds.*

---

## 9. OpenAPI & Swagger Documentation
Once the backend is running, navigate to:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI v3 JSON**: `http://localhost:8080/v3/api-docs`

Documented API Tags:
- `/api/auth` — Authentication, Registration & Token Issuance
- `/api/users` — Administrative Operative Directory
- `/api/cases` — Investigation Case Management
- `/api/entities` — Intelligence Entity Records & Metadata
- `/api/relationships` — Relational Graph Edges
- `/api/evidence` — Evidentiary Artifacts & Chain of Custody
- `/api/events` — Chronological Timeline Events
- `/api/network` — Network Graph Topology & Shortest Path Routing
- `/api/analytics` — Centrality Statistics & Entity Distributions
- `/api/anomalies` — Behavioral Signals & Detection Status
- `/api/import` — Bulk CSV/JSON/TXT Data Ingestion
- `/api/ai` — NEXUS AI Grounded RAG Assistant
- `/api/audit-logs` — Security Audit Trails

---

## 10. Educational Capstone Evaluation Walkthrough
During your technical evaluation, follow this complete end-to-end verification flow:
1. **User Registration & Validation (Unit 3):** Navigate to `/register`, attempt registration with mismatched passwords (notice validation error), then register a new Investigator account.
2. **JWT Authentication & Interceptor (Units 5 & 6):** Log in with `admin@nexus.local`, inspect the Network tab to confirm `Authorization: Bearer <token>` attached automatically to all API requests.
3. **Role-Based Authorization (Units 5 & 6):** Log in as `analyst@nexus.local`. Notice that administrative items (`/users`, `/audit-logs`) are hidden and protected by `@PreAuthorize`.
4. **Relational CRUD & Server Pagination (Units 2 & 4):** Go to **Investigations** (`/cases`), browse paginated cases, filter by status, and click **Create Investigation Case**. Add linked entity codes (e.g., `P101`, `P102`).
5. **Interactive Network Graph Explorer (Unit 2 & Application Model):** Open **Network Explorer** (`/network`). Drag nodes, zoom in/out, filter by entity type, click a node to inspect its connected links, and use the **Shortest Path** calculator between `P101` and `ORG301`.
6. **Analytical Signals & Review Workflow:** Visit **Anomalies** (`/anomalies`), review active behavioral spikes, and transition status from `NEW` to `UNDER_REVIEW` to `REVIEWED`.
7. **NEXUS AI Grounded RAG Inquiries (Unit 7):** Open **NEXUS AI** (`/nexus-ai`). Click the suggestion **"Show connections of P102"** or **"Show evidence related to P102"**. Verify that the AI cites database records (`E1024`, `E1025`) and displays the decision-support compliance notice.
8. **Actuator & Structured Logging (Unit 8):** Query `http://localhost:8080/actuator/health` to confirm actuator liveness metrics and check application logs for MDC `requestId` and `user` formatting.
