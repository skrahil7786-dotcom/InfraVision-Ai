-- ==============================================================================
-- InfraVision AI - Smart India Hackathon (SIH 2026) Database Schema
-- Problem Statement: AI-Powered Highway & Infrastructure Telemetry System
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    organization VARCHAR(255),
    avatar_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(128) NOT NULL,
    location VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    contractor VARCHAR(255) NOT NULL,
    planned_progress DOUBLE PRECISION DEFAULT 0.0,
    actual_progress DOUBLE PRECISION DEFAULT 0.0,
    variance DOUBLE PRECISION DEFAULT 0.0,
    risk_level VARCHAR(32) DEFAULT 'LOW',
    predicted_delay_days INT DEFAULT 0,
    budget_crores DOUBLE PRECISION DEFAULT 0.0,
    budget_spent_crores DOUBLE PRECISION DEFAULT 0.0,
    start_date DATE,
    target_completion_date DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'OPEN',
    ai_suggested_action TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_captures (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    captured_by VARCHAR(255),
    stage_detected VARCHAR(255),
    detected_progress DOUBLE PRECISION,
    confidence_score DOUBLE PRECISION,
    deviation DOUBLE PRECISION,
    risk_level VARCHAR(32),
    predicted_delay_days INT,
    image_url VARCHAR(512),
    ai_analysis_summary TEXT,
    recommended_action TEXT,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
