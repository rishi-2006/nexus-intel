-- ====================================================================
-- NEXUS INTEL: AI-Powered Criminal Network Analysis System
-- Problem Statement ID: 26189
-- Full Database Schema & Synthetic Seed Data for MySQL 8.0
-- ====================================================================

CREATE DATABASE IF NOT EXISTS nexus_intel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexus_intel;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. USER PROFILES TABLE (One-to-One with Users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    badge_number VARCHAR(50),
    department VARCHAR(100),
    clearance_level VARCHAR(50),
    phone_number VARCHAR(30),
    CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. CASES TABLE
CREATE TABLE IF NOT EXISTS cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    assigned_user_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_case_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. INTELLIGENCE ENTITIES TABLE
CREATE TABLE IF NOT EXISTS entities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    entity_type VARCHAR(30) NOT NULL,
    risk_score DOUBLE DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    details_json TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. CASE-ENTITY JUNCTION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS case_entities (
    case_id BIGINT NOT NULL,
    entity_id BIGINT NOT NULL,
    PRIMARY KEY (case_id, entity_id),
    CONSTRAINT fk_ce_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_ce_entity FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. RELATIONSHIPS TABLE (Network Graph Edges)
CREATE TABLE IF NOT EXISTS relationships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_entity_id BIGINT NOT NULL,
    target_entity_id BIGINT NOT NULL,
    relationship_type VARCHAR(40) NOT NULL,
    weight DOUBLE DEFAULT 1.0,
    description TEXT,
    first_observed DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_observed DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rel_source FOREIGN KEY (source_entity_id) REFERENCES entities(id) ON DELETE CASCADE,
    CONSTRAINT fk_rel_target FOREIGN KEY (target_entity_id) REFERENCES entities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    evidence_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    evidence_type VARCHAR(30) NOT NULL,
    file_url VARCHAR(255),
    chain_of_custody TEXT,
    collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_evidence_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS timeline_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_date DATETIME NOT NULL,
    entity_code VARCHAR(50),
    location_name VARCHAR(150),
    source_ref VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. FINANCIAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS financial_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    source_account VARCHAR(100),
    target_account VARCHAR(100),
    amount DOUBLE NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    suspicious_flag BOOLEAN DEFAULT FALSE,
    notes TEXT
) ENGINE=InnoDB;

-- 10. ANALYTICAL ANOMALIES TABLE
CREATE TABLE IF NOT EXISTS analytical_anomalies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    signal_code VARCHAR(50) NOT NULL UNIQUE,
    anomaly_type VARCHAR(50) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    detected_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_entity_ref VARCHAR(50)
) ENGINE=InnoDB;

-- 11. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    entity_ref VARCHAR(50)
) ENGINE=InnoDB;

-- 12. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vin VARCHAR(50),
    license_plate VARCHAR(30),
    make_model VARCHAR(100),
    color VARCHAR(50),
    owner_entity_ref VARCHAR(50)
) ENGINE=InnoDB;

-- 13. PHONES TABLE
CREATE TABLE IF NOT EXISTS phones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(30) NOT NULL,
    carrier VARCHAR(50),
    imei VARCHAR(50),
    subscriber_entity_ref VARCHAR(50)
) ENGINE=InnoDB;

-- 14. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    org_name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(50),
    industry VARCHAR(100),
    headquarters VARCHAR(150),
    principal_entity_ref VARCHAR(50)
) ENGINE=InnoDB;

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(150) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(50),
    ip_address VARCHAR(50),
    details TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ====================================================================
-- SYNTHETIC SEED DATA INSERTION
-- Password for all users is BCrypt hash of: Password123!
-- ($2a$10$wU0u6h4VfQk28Q/8Z020yei1GzTkhKj8yT90aL6.fR40v1s7K.5sO)
-- ====================================================================

-- Seed Users
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'System Administrator', 'admin@nexus.local', '$2a$10$7Z2P.k6qf71o18G8BwS4o.zO6aO8zG9w5pX8kQeK5bK4K6k7a8b9c', 'ADMIN'),
(2, 'Lead Investigator Vance', 'investigator@nexus.local', '$2a$10$7Z2P.k6qf71o18G8BwS4o.zO6aO8zG9w5pX8kQeK5bK4K6k7a8b9c', 'INVESTIGATOR'),
(3, 'Senior Analyst Rostova', 'analyst@nexus.local', '$2a$10$7Z2P.k6qf71o18G8BwS4o.zO6aO8zG9w5pX8kQeK5bK4K6k7a8b9c', 'ANALYST')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed User Profiles
INSERT INTO user_profiles (user_id, badge_number, department, clearance_level, phone_number) VALUES
(1, 'NX-001', 'Executive Command', 'TOP_SECRET', '+1-555-0101'),
(2, 'NX-102', 'Organized Crime Strike Force', 'SECRET', '+1-555-0102'),
(3, 'NX-204', 'Financial Intelligence Unit', 'CONFIDENTIAL', '+1-555-0103')
ON DUPLICATE KEY UPDATE badge_number=VALUES(badge_number);

-- Seed Initial Cases
INSERT INTO cases (id, case_number, title, description, status, priority, assigned_user_id) VALUES
(1, 'CASE-2024-001', 'Operation Black Horizon', 'Transnational synthetic syndicate investigation tracking illicit shell companies.', 'OPEN', 'CRITICAL', 2),
(2, 'CASE-2024-002', 'Cyber Threat Infiltration Nexus', 'Investigation into coordinated cyber ransom campaign targeting municipal utilities.', 'IN_PROGRESS', 'HIGH', 2),
(3, 'CASE-2024-003', 'Apex Maritime Contraband Pipeline', 'Smuggling corridor through container ports linked to offshore logistics conglomerates.', 'OPEN', 'HIGH', 2)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Key Intelligence Entities
INSERT INTO entities (id, entity_code, name, entity_type, risk_score, status, details_json) VALUES
(1, 'P101', 'Viktor Krumov', 'PERSON', 0.88, 'ACTIVE', '{"alias":"The Architect","nationality":"Synthetica","riskIndex":0.88}'),
(2, 'P102', 'Julian Vance', 'PERSON', 0.72, 'ACTIVE', '{"alias":"Corridor-2","nationality":"Synthetica","riskIndex":0.72}'),
(3, 'P103', 'Sophia Sterling', 'PERSON', 0.65, 'ACTIVE', '{"alias":"Couturier","nationality":"Synthetica","riskIndex":0.65}'),
(4, 'ORG301', 'Apex Maritime Holdings', 'ORGANIZATION', 0.82, 'ACTIVE', '{"jurisdiction":"Panama/Cyprus","type":"Holding Group","riskIndex":0.82}'),
(5, 'ORG302', 'Volkov Logistics Ltd', 'ORGANIZATION', 0.76, 'ACTIVE', '{"jurisdiction":"Black Sea Corridor","type":"Freight Forwarder","riskIndex":0.76}')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Relationships
INSERT INTO relationships (source_entity_id, target_entity_id, relationship_type, weight, description) VALUES
(1, 4, 'ASSOCIATE', 0.92, 'Executive controlling interest in maritime holding entity'),
(2, 1, 'COMMUNICATION', 0.85, 'Encrypted satellite transmission channel observed'),
(1, 5, 'FINANCIAL_TRANSACTION', 0.78, 'Wire transfer flow detected across correspondent accounts'),
(3, 4, 'FAMILY_TIE', 0.60, 'Corporate co-director on beneficial registry');

-- Seed Evidence
INSERT INTO evidence (case_id, evidence_code, title, description, evidence_type, file_url, verified) VALUES
(1, 'EV-1001', 'Encrypted Hard Drive Recovery', 'Seized Western Digital NVMe drive during raid on safehouse.', 'DIGITAL', '/storage/evidence/EV-1001.bin', TRUE),
(1, 'EV-1002', 'Corrupt Cargo Manifest PDF', 'Altered bill of lading concealing illicit container numbers.', 'DOCUMENT', '/storage/evidence/EV-1002.pdf', TRUE),
(2, 'EV-1003', 'C2 Server Packet Capture', 'WireGuard tunnel telemetry matching adversary IP infrastructure.', 'TELECOMMUNICATION', '/storage/evidence/EV-1003.pcap', TRUE);

-- Seed Timeline Events
INSERT INTO timeline_events (case_id, event_title, event_description, event_date, entity_code, location_name) VALUES
(1, 'Shell Company Registered', 'Apex Maritime Holdings established in offshore jurisdiction.', '2024-01-15 08:30:00', 'ORG301', 'Panama City'),
(1, 'Suspicious Wire Transfer', '$2,450,000 wired to escrow intermediary account.', '2024-03-22 14:15:00', 'P101', 'Geneva Private Bank'),
(1, 'Border Crossing Interception', 'Subject vehicle observed crossing northern checkpoint.', '2024-05-10 19:40:00', 'P102', 'Checkpoint Delta');
