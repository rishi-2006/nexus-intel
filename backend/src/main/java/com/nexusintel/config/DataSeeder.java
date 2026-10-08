package com.nexusintel.config;

import com.nexusintel.entity.*;
import com.nexusintel.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Value("${nexus.seed.enabled:true}")
    private boolean seedEnabled;

    private final UserRepository userRepository;
    private final CaseFileRepository caseRepository;
    private final IntelligenceEntityRepository entityRepository;
    private final RelationshipRepository relationshipRepository;
    private final EvidenceRepository evidenceRepository;
    private final TimelineEventRepository eventRepository;
    private final FinancialRecordRepository financialRepository;
    private final AnalyticalAnomalyRepository anomalyRepository;
    private final LocationRecordRepository locationRepository;
    private final VehicleRecordRepository vehicleRepository;
    private final PhoneRecordRepository phoneRepository;
    private final OrganizationRecordRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      CaseFileRepository caseRepository,
                      IntelligenceEntityRepository entityRepository,
                      RelationshipRepository relationshipRepository,
                      EvidenceRepository evidenceRepository,
                      TimelineEventRepository eventRepository,
                      FinancialRecordRepository financialRepository,
                      AnalyticalAnomalyRepository anomalyRepository,
                      LocationRecordRepository locationRepository,
                      VehicleRecordRepository vehicleRepository,
                      PhoneRecordRepository phoneRepository,
                      OrganizationRecordRepository organizationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.entityRepository = entityRepository;
        this.relationshipRepository = relationshipRepository;
        this.evidenceRepository = evidenceRepository;
        this.eventRepository = eventRepository;
        this.financialRepository = financialRepository;
        this.anomalyRepository = anomalyRepository;
        this.locationRepository = locationRepository;
        this.vehicleRepository = vehicleRepository;
        this.phoneRepository = phoneRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            log.info("Database already seeded or seeding disabled.");
            return;
        }

        log.info("Initiating synthetic seed dataset generation for NEXUS INTEL (Unit 1-10)...");

        // 1. Seed 8 Users with BCrypt Password hashes
        String commonPass = passwordEncoder.encode("Password123!");

        List<User> users = new ArrayList<>();
        users.add(createUser("System Administrator", "admin@nexus.local", commonPass, Role.ADMIN, "NX-001", "Executive Command", "TOP_SECRET"));
        users.add(createUser("Lead Investigator Vance", "investigator@nexus.local", commonPass, Role.INVESTIGATOR, "NX-102", "Organized Crime Strike Force", "SECRET"));
        users.add(createUser("Senior Analyst Rostova", "analyst@nexus.local", commonPass, Role.ANALYST, "NX-204", "Financial Intelligence Unit", "CONFIDENTIAL"));
        users.add(createUser("Special Agent Marcus Vance", "marcus.vance@nexus.local", commonPass, Role.INVESTIGATOR, "NX-105", "Cross-Border Interdiction", "SECRET"));
        users.add(createUser("Intelligence Analyst Chen", "david.chen@nexus.local", commonPass, Role.ANALYST, "NX-208", "Cyber Network Reconnaissance", "CONFIDENTIAL"));
        users.add(createUser("Investigator Sarah Jenkins", "sarah.jenkins@nexus.local", commonPass, Role.INVESTIGATOR, "NX-110", "Maritime Intelligence Division", "SECRET"));
        users.add(createUser("Forensic Auditor Elena Vega", "elena.vega@nexus.local", commonPass, Role.ANALYST, "NX-215", "Anti-Money Laundering Group", "CONFIDENTIAL"));
        users.add(createUser("Director Arthur Shaw", "director.shaw@nexus.local", commonPass, Role.ADMIN, "NX-002", "National Security Council Liaison", "TOP_SECRET"));
        userRepository.saveAll(users);

        // 2. Seed 30 People (P101 to P130)
        String[] personNames = {
                "Viktor Krumov", "Julian Vance", "Sophia Sterling", "Dmitri Volkov", "Cassian Drake",
                "Mateo Rossi", "Helena Brandt", "Tariq Mansoor", "Gabriel Mercer", "Anya Petrova",
                "Lucas Thorne", "Nadia Belova", "Rafael Silva", "Corinne Laurent", "Kenji Takahashi",
                "Darius Blackwood", "Isla Vance", "Maximilian Cruz", "Selena Gomez-Reyes", "Boris Antonov",
                "Leila Haddad", "Dominic Reed", "Farah Al-Sayed", "Nikolai Voronov", "Siddharth Verma",
                "Camilla Fernandez", "Zayn Malik-Shah", "Evelyn Cross", "Goran Dragic", "Amara Okafor"
        };

        Map<String, IntelligenceEntity> entityMap = new HashMap<>();
        List<IntelligenceEntity> entities = new ArrayList<>();

        for (int i = 0; i < 30; i++) {
            String code = String.format("P%03d", 101 + i);
            double risk = 0.35 + (i % 7) * 0.09;
            String details = String.format("{\"nationality\":\"Synthetica\",\"alias\":\"Subject-%d\",\"riskIndex\":%.2f}", i + 1, risk);
            IntelligenceEntity p = new IntelligenceEntity(code, personNames[i], EntityType.PERSON, Math.min(0.98, risk), "ACTIVE", details);
            entities.add(p);
            entityMap.put(code, p);
        }

        // 3. Seed 8 Organizations (ORG301 to ORG308)
        String[] orgNames = {
                "Apex Maritime Holdings", "Volkov Logistics Ltd", "Sterling Global Offshore", "Black Sea Trading Corp",
                "Helios Financial Services", "Trans-Eurasia Cargo SpA", "Vanguard Private Security", "Cobalt Horizon Shipping"
        };
        for (int i = 0; i < 8; i++) {
            String code = String.format("ORG%03d", 301 + i);
            double risk = 0.45 + (i % 5) * 0.11;
            String details = String.format("{\"jurisdiction\":\"Panama/Cyprus\",\"type\":\"Holding Group\",\"riskIndex\":%.2f}", risk);
            IntelligenceEntity org = new IntelligenceEntity(code, orgNames[i], EntityType.ORGANIZATION, risk, "ACTIVE", details);
            entities.add(org);
            entityMap.put(code, org);

            organizationRepository.save(new OrganizationRecord(orgNames[i], "REG-" + (8800 + i), "Logistics & Maritime", "Port Logistics Hub", code));
        }

        // 4. Seed 15 Phones (PH901 to PH915)
        for (int i = 0; i < 15; i++) {
            String code = String.format("PH%03d", 901 + i);
            String number = String.format("+1-555-01%02d", 20 + i);
            IntelligenceEntity ph = new IntelligenceEntity(code, "Burner Phone " + number, EntityType.PHONE, 0.50 + (i % 4) * 0.12, "ACTIVE", "{\"encryptedApp\":\"Signal/Telegram\"}");
            entities.add(ph);
            entityMap.put(code, ph);

            phoneRepository.save(new PhoneRecord(number, "SatComm Global", "IMEI-8640" + (1000 + i), String.format("P%03d", 101 + (i % 15))));
        }

        // 5. Seed 10 Vehicles (V701 to V710)
        String[] vehicles = {
                "Black Mercedes S-Class", "Armored Toyota Land Cruiser", "Cargo Vessel Neptune", "Freightliner Semi-Truck",
                "BMW 7-Series Sedan", "Container Tugboat Alpha", "Range Rover Autobiography", "DAF Logistics Van",
                "Yacht Ocean Serenity", "Ford Transit High-Roof"
        };
        for (int i = 0; i < 10; i++) {
            String code = String.format("V%03d", 701 + i);
            IntelligenceEntity v = new IntelligenceEntity(code, vehicles[i], EntityType.VEHICLE, 0.40 + (i % 5) * 0.10, "ACTIVE", "{\"gpsEnabled\":true}");
            entities.add(v);
            entityMap.put(code, v);

            vehicleRepository.save(new VehicleRecord("VIN-8829" + i, "PLT-" + (4000 + i), vehicles[i], "Obsidian Black", String.format("P%03d", 101 + (i % 10))));
        }

        // 6. Seed 10 Locations (LOC501 to LOC510)
        String[] locations = {
                "Rotterdam Pier 14 Terminal", "Limassol Marina Berth B", "Dubai Creek Freezone Warehouse", "Trieste Rail Cargo Depot",
                "Odessa Grain Pier 4", "Geneva Private Vault Center", "Antwerp Freight Hub", "Singapore Anchorage South",
                "Valletta Offshore Anchorage", "Hamburg Speichersdorf Terminal"
        };
        double[][] coords = {
                {51.9244, 4.4777}, {34.6786, 33.0413}, {25.2697, 55.3095}, {45.6495, 13.7768},
                {46.4825, 30.7233}, {46.2044, 6.1432}, {51.2194, 4.4025}, {1.29027, 103.851959},
                {35.8989, 14.5146}, {53.5459, 9.9937}
        };
        for (int i = 0; i < 10; i++) {
            String code = String.format("LOC%03d", 501 + i);
            IntelligenceEntity loc = new IntelligenceEntity(code, locations[i], EntityType.LOCATION, 0.30 + (i % 4) * 0.15, "ACTIVE", "{\"riskLevel\":\"HIGH_SURVEILLANCE\"}");
            entities.add(loc);
            entityMap.put(code, loc);

            locationRepository.save(new LocationRecord(locations[i], "Port Sector Zone " + (i + 1), coords[i][0], coords[i][1], code));
        }

        entityRepository.saveAll(entities);

        // 7. Seed 10 Cases (C-2024-001 to C-2024-010)
        String[] caseTitles = {
                "Operation Apex Syndicate", "Sovereign Cargo Smuggling Network", "Cyber-Launder Cryptographic Pipeline",
                "Phantom Shell Entity Infiltration", "Black Sea Counterfeit Transshipment", "Red Horizon Procurement Fraud",
                "Ghost Fleet Offshore Smuggling", "Northern Corridor Narcotics Transit", "Cobalt Falcon Identity Forgery Ring",
                "Helios Illicit Wildlife Trafficking"
        };
        CaseStatus[] statuses = {
                CaseStatus.OPEN, CaseStatus.UNDER_INVESTIGATION, CaseStatus.UNDER_INVESTIGATION, CaseStatus.OPEN,
                CaseStatus.PENDING_REVIEW, CaseStatus.UNDER_INVESTIGATION, CaseStatus.OPEN, CaseStatus.CLOSED,
                CaseStatus.UNDER_INVESTIGATION, CaseStatus.OPEN
        };
        CasePriority[] priorities = {
                CasePriority.CRITICAL, CasePriority.HIGH, CasePriority.HIGH, CasePriority.MEDIUM,
                CasePriority.MEDIUM, CasePriority.HIGH, CasePriority.CRITICAL, CasePriority.LOW,
                CasePriority.HIGH, CasePriority.MEDIUM
        };

        List<CaseFile> casesList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            String caseNum = String.format("C-2024-%03d", i + 1);
            CaseFile c = new CaseFile(caseNum, caseTitles[i],
                    "Targeted multi-jurisdictional intelligence probe analyzing financial velocity, logistical nodes, and telecommunications clusters.",
                    statuses[i], priorities[i]);
            c.setAssignedUser(users.get((i % 4) + 1)); // Assign investigators/analysts

            // Unit 4: Link entities (@ManyToMany)
            Set<IntelligenceEntity> linkedEntities = new HashSet<>();
            for (int k = 0; k < 6; k++) {
                int entityIdx = (i * 3 + k) % entities.size();
                linkedEntities.add(entities.get(entityIdx));
            }
            c.setEntities(linkedEntities);
            casesList.add(c);
        }
        caseRepository.saveAll(casesList);

        // 8. Seed 80+ Relationships across clusters
        List<Relationship> relationships = new ArrayList<>();
        RelationshipType[] relTypes = RelationshipType.values();

        // Core Hub: Viktor Krumov (P101) and Julian Vance (P102)
        createRel(relationships, entityMap.get("P101"), entityMap.get("P102"), RelationshipType.ASSOCIATED_WITH, 0.95, "Frequent encrypted coordination meetings");
        createRel(relationships, entityMap.get("P102"), entityMap.get("ORG301"), RelationshipType.CONNECTED_TO, 0.90, "Beneficial ownership via nominee directors");
        createRel(relationships, entityMap.get("P101"), entityMap.get("ORG302"), RelationshipType.CONNECTED_TO, 0.88, "Majority shareholder in logistics front");
        createRel(relationships, entityMap.get("P102"), entityMap.get("PH901"), RelationshipType.USED, 0.95, "Registered subscriber on burner hardware");
        createRel(relationships, entityMap.get("P101"), entityMap.get("PH902"), RelationshipType.USED, 0.92, "Burner SIM recovered during raid");
        createRel(relationships, entityMap.get("PH901"), entityMap.get("PH902"), RelationshipType.COMMUNICATED_WITH, 0.98, "240+ encrypted VoIP sessions recorded");
        createRel(relationships, entityMap.get("P102"), entityMap.get("V701"), RelationshipType.USED, 0.85, "Observed arriving at Pier 14 terminal");
        createRel(relationships, entityMap.get("V701"), entityMap.get("LOC501"), RelationshipType.LOCATED_AT, 0.89, "ANPR camera hit at port perimeter");
        createRel(relationships, entityMap.get("ORG301"), entityMap.get("LOC501"), RelationshipType.LOCATED_AT, 0.90, "Leased warehousing dock 14");
        createRel(relationships, entityMap.get("ORG301"), entityMap.get("ORG303"), RelationshipType.TRANSFERRED_TO, 0.87, "Cross-border wire of $1.25M to offshore account");

        // Additional clustered relationships to exceed 80
        for (int i = 1; i <= 25; i++) {
            IntelligenceEntity src = entities.get(i % entities.size());
            IntelligenceEntity tgt = entities.get((i + 3) % entities.size());
            RelationshipType t = relTypes[i % relTypes.length];
            createRel(relationships, src, tgt, t, 0.70 + (i % 3) * 0.1, "Analytical association observed during intelligence monitoring");
        }
        for (int i = 26; i <= 50; i++) {
            IntelligenceEntity src = entities.get((i * 2) % entities.size());
            IntelligenceEntity tgt = entities.get((i * 3 + 1) % entities.size());
            RelationshipType t = relTypes[(i + 2) % relTypes.length];
            createRel(relationships, src, tgt, t, 0.65 + (i % 4) * 0.08, "Cross-source transaction and logistical synchronization");
        }
        for (int i = 51; i <= 82; i++) {
            IntelligenceEntity src = entities.get((i + 7) % entities.size());
            IntelligenceEntity tgt = entities.get((i + 13) % entities.size());
            RelationshipType t = relTypes[(i + 4) % relTypes.length];
            createRel(relationships, src, tgt, t, 0.60 + (i % 5) * 0.07, "Surveillance and intelligence corroboration signal");
        }
        relationshipRepository.saveAll(relationships);

        // 9. Seed 50+ Evidence Records (E1001 to E1050)
        List<Evidence> evidenceList = new ArrayList<>();
        EvidenceType[] evTypes = EvidenceType.values();
        for (int i = 1; i <= 50; i++) {
            String code = String.format("E%04d", 1000 + i);
            CaseFile c = casesList.get((i - 1) % casesList.size());
            EvidenceType et = evTypes[(i - 1) % evTypes.length];
            boolean verified = (i % 3 != 0);
            Evidence ev = new Evidence(code, c,
                    "Intelligence Item " + code + ": Forensic Analysis",
                    "Forensic inspection of seized material, cryptographic records, and surveillance telemetries.",
                    et, "https://nexus.vault/evidence/" + code,
                    "Seized by Unit 4 -> Checked into Secure Evidence Locker #3", verified);
            ev.setCollectedAt(LocalDateTime.now().minusDays(i));
            evidenceList.add(ev);
        }
        evidenceRepository.saveAll(evidenceList);

        // 10. Seed 60+ Timeline Events
        List<TimelineEvent> eventList = new ArrayList<>();
        for (int i = 1; i <= 60; i++) {
            CaseFile c = casesList.get((i - 1) % casesList.size());
            String entityCode = String.format("P%03d", 101 + ((i * 3) % 30));
            String loc = locations[(i - 1) % locations.length];
            TimelineEvent ev = new TimelineEvent(c,
                    "Operational Event #" + i + ": Surveillance Intercept",
                    "Subject observed conducting logistics transfer and tactical handover with external associate.",
                    LocalDateTime.now().minusDays(80 - i).plusHours(i * 3 % 24),
                    entityCode, loc, "Source-HUMINT-" + (100 + i));
            eventList.add(ev);
        }
        eventRepository.saveAll(eventList);

        // 11. Seed 30+ Financial Records
        List<FinancialRecord> financialList = new ArrayList<>();
        for (int i = 1; i <= 32; i++) {
            double amount = 25000.0 + (i * 37500.0);
            boolean suspicious = (i % 2 == 0);
            financialList.add(new FinancialRecord(
                    "TXN-2024-" + (10000 + i),
                    "ACC-SWISS-" + (1000 + (i % 8)),
                    "ACC-PANAMA-" + (2000 + (i % 6)),
                    amount, "USD",
                    LocalDateTime.now().minusDays(i * 2),
                    suspicious,
                    suspicious ? "Unusual layered transaction without apparent commercial rationale" : "Standard commercial wire settlement"
            ));
        }
        financialRepository.saveAll(financialList);

        // 12. Seed 14 Analytical Anomalies
        List<AnalyticalAnomaly> anomalyList = new ArrayList<>();
        anomalyList.add(new AnalyticalAnomaly("SIG-901", "COMMUNICATION_SPIKE", "340% increase in short-burst encrypted VoIP calls in 48h period", AnomalySeverity.CRITICAL, AnomalyStatus.NEW, "P102"));
        anomalyList.add(new AnalyticalAnomaly("SIG-902", "TRANSACTION_SPIKE", "Rapid sequential wire structuring below reporting threshold ($9,800 x 6)", AnomalySeverity.HIGH, AnomalyStatus.UNDER_REVIEW, "ORG301"));
        anomalyList.add(new AnalyticalAnomaly("SIG-903", "UNUSUAL_TIMING", "Midnight cargo vessel offload without port manifest clearance", AnomalySeverity.HIGH, AnomalyStatus.UNDER_REVIEW, "LOC501"));
        anomalyList.add(new AnalyticalAnomaly("SIG-904", "UNUSUAL_RELATIONSHIP", "New indirect financial bridge detected between P101 and sanctioned entity ORG304", AnomalySeverity.CRITICAL, AnomalyStatus.NEW, "P101"));
        anomalyList.add(new AnalyticalAnomaly("SIG-905", "TRANSACTION_SPIKE", "Sudden capital inflow of $4.8M into dormant shell corporate account", AnomalySeverity.MEDIUM, AnomalyStatus.REVIEWED, "ORG303"));
        anomalyList.add(new AnalyticalAnomaly("SIG-906", "COMMUNICATION_SPIKE", "Repeated pinging between cell tower sector 14 and burner hardware PH904", AnomalySeverity.LOW, AnomalyStatus.DISMISSED, "PH904"));
        anomalyList.add(new AnalyticalAnomaly("SIG-907", "UNUSUAL_TIMING", "Simultaneous activation of 5 burner IMEI devices within 10-minute window", AnomalySeverity.CRITICAL, AnomalyStatus.NEW, "PH901"));
        anomalyList.add(new AnalyticalAnomaly("SIG-908", "UNUSUAL_RELATIONSHIP", "High-frequency shared vehicle usage detected between P103 and P112", AnomalySeverity.MEDIUM, AnomalyStatus.UNDER_REVIEW, "P103"));
        anomalyList.add(new AnalyticalAnomaly("SIG-909", "TRANSACTION_SPIKE", "Over-the-counter crypto voucher liquidation routed through intermediary P105", AnomalySeverity.HIGH, AnomalyStatus.NEW, "P105"));
        anomalyList.add(new AnalyticalAnomaly("SIG-910", "COMMUNICATION_SPIKE", "Emergency signal broadcast detected across secondary logistics frequency", AnomalySeverity.HIGH, AnomalyStatus.NEW, "ORG302"));
        anomalyList.add(new AnalyticalAnomaly("SIG-911", "UNUSUAL_TIMING", "Off-hours biometric access attempt at secure port facility warehouse", AnomalySeverity.MEDIUM, AnomalyStatus.REVIEWED, "LOC503"));
        anomalyList.add(new AnalyticalAnomaly("SIG-912", "TRANSACTION_SPIKE", "Cross-border currency transfer spike coinciding with scheduled port docking", AnomalySeverity.CRITICAL, AnomalyStatus.NEW, "V701"));
        anomalyRepository.saveAll(anomalyList);

        log.info("Synthetic seed dataset generation completed successfully! 8 Users, 10 Cases, 73 Entities, 82+ Relationships, 50 Evidence records, 60 Timeline events, 32 Financial records, 12 Anomalies initialized.");
    }

    private User createUser(String name, String email, String password, Role role, String badge, String dept, String clearance) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(password);
        u.setRole(role);
        UserProfile p = new UserProfile(badge, dept, clearance, "+1-555-010" + badge.replaceAll("[^0-9]", ""), u);
        u.setUserProfile(p);
        return u;
    }

    private void createRel(List<Relationship> list, IntelligenceEntity src, IntelligenceEntity tgt, RelationshipType type, double weight, String desc) {
        if (src != null && tgt != null && !src.getId().equals(tgt.getId())) {
            Relationship r = new Relationship(src, tgt, type, weight, desc);
            list.add(r);
        }
    }
}
