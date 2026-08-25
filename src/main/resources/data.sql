-- ==============================================================================
-- InfraVision AI - SIH 2026 Seed Data for Database Initialization
-- ==============================================================================

-- 1. SEED USERS (Demo Credentials: password is 'demo123')
INSERT INTO users (id, name, email, password_hash, role, organization, avatar_url, created_at)
VALUES 
('usr-1', 'Rajesh Kumar', 'manager@infravision.ai', '$2a$10$eW...demo123', 'PROJECT_MANAGER', 'National Highways Authority of India (NHAI)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, password_hash, role, organization, avatar_url, created_at)
VALUES 
('usr-2', 'Amit Sharma', 'engineer@infravision.ai', '$2a$10$eW...demo123', 'SITE_ENGINEER', 'L&T Infrastructure', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, password_hash, role, organization, avatar_url, created_at)
VALUES 
('usr-3', 'Admin User', 'admin@infravision.ai', '$2a$10$eW...demo123', 'ADMINISTRATOR', 'Ministry of Road Transport & Highways (MoRTH)', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. SEED 6 CORE INFRASTRUCTURE PROJECTS
INSERT INTO projects (id, code, name, sector, location, client, contractor, planned_progress, actual_progress, variance, risk_level, predicted_delay_days, budget_crores, budget_spent_crores, start_date, target_completion_date, last_updated)
VALUES
('proj-1', 'NHAI-HYD-PKG4', 'NH Road Package 04', 'Highways & Expressways', 'Hyderabad, Telangana', 'NHAI', 'L&T Infrastructure', 70.0, 52.0, -18.0, 'HIGH', 9, 245.00, 142.00, '2023-01-15', '2026-12-31', '2026-08-21 14:00:00')
ON CONFLICT (code) DO NOTHING;

INSERT INTO projects (id, code, name, sector, location, client, contractor, planned_progress, actual_progress, variance, risk_level, predicted_delay_days, budget_crores, budget_spent_crores, start_date, target_completion_date, last_updated)
VALUES
('proj-2', 'BMRCL-PH2-REACH6', 'Metro Rail Phase 2 (Pink Line)', 'Metro Rail & Transit', 'Bengaluru, Karnataka', 'BMRCL', 'BMRCL Consortium', 75.0, 78.0, 3.0, 'LOW', 0, 890.00, 680.00, '2022-09-01', '2027-03-31', '2026-08-24 16:30:00')
ON CONFLICT (code) DO NOTHING;

INSERT INTO projects (id, code, name, sector, location, client, contractor, planned_progress, actual_progress, variance, risk_level, predicted_delay_days, budget_crores, budget_spent_crores, start_date, target_completion_date, last_updated)
VALUES
('proj-3', 'MSRDC-NH44-BRG', 'Bridge Construction NH-44', 'Bridges & Flyovers', 'Mumbai, Maharashtra', 'MSRDC', 'IRB Infrastructure', 68.0, 64.0, -4.0, 'MEDIUM', 3, 178.00, 115.00, '2024-01-10', '2027-05-31', '2026-08-23 10:15:00')
ON CONFLICT (code) DO NOTHING;

INSERT INTO projects (id, code, name, sector, location, client, contractor, planned_progress, actual_progress, variance, risk_level, predicted_delay_days, budget_crores, budget_spent_crores, start_date, target_completion_date, last_updated)
VALUES
('proj-4', 'NHAI-DME-PKG7', 'Delhi-Mumbai Expressway Package 7', 'Highways & Expressways', 'Ratlam, Madhya Pradesh', 'NHAI', 'NHAI EPC Div', 80.0, 85.0, 5.0, 'LOW', 0, 1250.00, 980.00, '2022-04-01', '2026-10-31', '2026-08-24 18:00:00')
ON CONFLICT (code) DO NOTHING;

INSERT INTO projects (id, code, name, sector, location, client, contractor, planned_progress, actual_progress, variance, risk_level, predicted_delay_days, budget_crores, budget_spent_crores, start_date, target_completion_date, last_updated)
VALUES
('proj-5', 'KRCL-USBRL-CHNB', 'Chenab Rail Bridge & Approaches', 'Railway Mega Structures', 'Reasi, Jammu & Kashmir', 'KRCL', 'KRCL Construction', 90.0, 91.0, 1.0, 'LOW', 0, 1850.00, 1690.00, '2021-03-15', '2026-11-30', '2026-08-25 09:00:00')
ON CONFLICT (code) DO NOTHING;

INSERT INTO projects (id, code, name, sector, location, client, contractor, planned_progress, actual_progress, variance, risk_level, predicted_delay_days, budget_crores, budget_spent_crores, start_date, target_completion_date, last_updated)
VALUES
('proj-6', 'MOHUA-VNS-MMT', 'Varanasi Multi-Modal Transit Terminal', 'Urban Logistics', 'Varanasi, Uttar Pradesh', 'MOHUA', 'MOHUA State Cell', 50.0, 42.0, -8.0, 'MEDIUM', 7, 620.00, 260.00, '2024-06-01', '2027-12-31', '2026-08-22 11:45:00')
ON CONFLICT (code) DO NOTHING;

-- 3. SEED 3 CORE ALERTS
INSERT INTO alerts (id, project_id, title, description, severity, category, status, ai_suggested_action, created_at)
VALUES
('alt-1', 'proj-1', 'Schedule Variance Alert (18% Delay)', 'NH Road Package 04 is 18% behind schedule - predicted 9-day completion delay based on current paving rate.', 'HIGH', 'TIMELINE', 'OPEN', 'Deploy secondary mobile bitumen heating plant and approve alternate BPCL supply terminal within 48 hours to recover 4 days.', '2026-08-21 14:00:00');

INSERT INTO alerts (id, project_id, title, description, severity, category, status, ai_suggested_action, created_at)
VALUES
('alt-2', 'proj-3', 'Material Supply Bottleneck (3 Days)', 'Material delivery delayed by 3 days for Bridge Construction NH-44 (Stay Cable Anchorage Spools at Port).', 'MEDIUM', 'MATERIAL', 'OPEN', 'Expedite customs clearance at JNPT Port and arrange dedicated flatbed transport convoy.', '2026-08-23 10:15:00');

INSERT INTO alerts (id, project_id, title, description, severity, category, status, ai_suggested_action, created_at)
VALUES
('alt-3', 'proj-2', 'Equipment Maintenance Window', 'Equipment shortage detected at Metro Rail Phase 2 site (Gantry Launcher Crane #2 scheduled for service).', 'LOW', 'EQUIPMENT', 'OPEN', 'Reschedule pier cap erection to night shift 22:00-05:00 to avoid mainline corridor bottleneck.', '2026-08-24 08:30:00');
