# Niger Digital Vehicle Sticker System - PRD

## Project Overview
A government platform to replace physical vehicle stickers with a fully digital, secure, and scalable system for Niger. Aligns with the national digital transformation strategy "Niger 2.0".

## Original Problem Statement
Build the Niger Digital Vehicle Sticker System as described in the SOW document - a comprehensive platform with:
- Citizen Web Portal for vehicle registration and sticker purchase
- DGI Administration Portal for tax configuration and monitoring
- Law Enforcement Mobile App for real-time verification

## User Personas

### 1. Citizens/Taxpayers
- Vehicle owners in Niger
- Need to register vehicles and purchase digital stickers
- Pay via mobile money, bank transfer, or card
- Download QR codes for verification

### 2. DGI Administrators
- Tax authority personnel
- Configure tax rates by vehicle category
- Monitor revenue and KPIs
- Manage users and generate reports

### 3. Law Enforcement (Police/Gendarmerie)
- Field agents verifying vehicle compliance
- Use QR scanner or manual plate lookup
- Record inspections with geolocation

## Core Requirements (Static)

### Citizen Portal
- [x] User registration with phone/OTP
- [x] User login/authentication (JWT)
- [x] Vehicle registration & management
- [x] Digital sticker purchase (1-3 years)
- [x] QR code generation & download
- [x] Payment history & receipts
- [x] Loyalty points system
- [x] Bilingual support (FR/EN)

### Admin Portal
- [x] Secure admin authentication
- [x] Dashboard with KPIs (vehicles, revenue, recovery rate)
- [x] Tax configuration management (create/edit)
- [x] User management (create admin/agent users)
- [x] Financial reports with CSV export
- [x] Audit logging
- [x] Vehicle list with status
- [x] Sticker management

### Law Enforcement
- [x] Dedicated Agent login page
- [x] Agent authentication
- [x] QR code scanner interface
- [x] Manual plate verification
- [x] Inspection logging with geolocation
- [x] Inspection history display
- [ ] Offline mode with sync
- [ ] USSD/SMS verification

### Technical Requirements
- [x] MongoDB database
- [x] FastAPI backend with JWT auth
- [x] React frontend with Tailwind CSS
- [x] QR code generation (qrcode library)
- [x] Niger national colors theme (Orange, White, Green)
- [x] Responsive design

## What's Been Implemented (Jan 28, 2026)

### Backend (server.py)
- Complete auth system (register, login, admin login)
- Vehicle CRUD operations
- Sticker purchase with automatic tax calculation
- QR code generation with digital signature data
- Vehicle verification endpoint
- Inspection recording with geolocation
- Admin dashboard statistics
- Tax config CRUD
- User management
- Payment reports with filtering
- Audit logging

### Frontend - All 3 Portals Complete

#### Citizen Portal
- Landing page with Niger theme
- Registration/Login
- Dashboard with stats
- Vehicle management (add/delete)
- 3-step sticker purchase wizard
- Digital sticker component with QR
- Payment history
- Language toggle (FR/EN)

#### DGI Admin Portal
- Admin login page
- Admin dashboard with KPIs
- Vehicle management (/admin/vehicles)
- Sticker management (/admin/stickers)
- Tax configuration (/admin/tax-config)
- User management (/admin/users)
- Financial reports (/admin/reports) with CSV export
- Audit logs (/admin/audit-logs)

#### Law Enforcement Portal
- Dedicated Agent login page (blue theme)
- Agent scanner interface
- Quick plate verification
- Inspection history with timestamps
- GPS coordinate tracking

### Status
- ✅ Backend: 100% functional (all APIs tested)
- ✅ Frontend: 100% functional (all 3 portals)
- ✅ Tests: Passed comprehensive testing
- ✅ RBAC: Role-Based Access Control fully implemented (Jan 28, 2026)
- ✅ Email Notifications: Implemented with Resend (simulation mode) (Jan 28, 2026)

## Test Credentials

| Portal | Username | Password | Role | Region |
|--------|----------|----------|------|--------|
| Super Admin | superadmin | superadmin123 | Full access | All |
| Admin DGI | admin | admin123 | Admin (no Audit) | All |
| Supervisor Niamey | sup_niamey | supervisor123 | Supervisor | Niamey |
| Supervisor Maradi | sup_maradi | supervisor123 | Supervisor | Maradi |
| Agent Niamey | agent_niamey | agent123 | Scanner only | Niamey |
| Agent Maradi | agent_maradi | agent123 | Scanner only | Maradi |
| Citizen | Register new | - | Citizen | - |

## Role-Based Access Control (RBAC) - Implemented Jan 28, 2026

### Role Hierarchy
1. **Super Admin**: Full platform access (all regions, all features, audit logs)
2. **Admin**: Can create supervisors/agents, view all regions, no audit logs
3. **Supervisor**: Region-specific data only, view-only (dashboard, vehicles, stickers, reports)
4. **Agent**: Scanner access only for their region

### Menu Access by Role
| Menu Item | Super Admin | Admin | Supervisor | Agent |
|-----------|-------------|-------|------------|-------|
| Dashboard | ✅ | ✅ | ✅ (region filtered) | ❌ |
| Véhicules | ✅ | ✅ | ✅ (region filtered) | ❌ |
| Vignettes | ✅ | ✅ | ✅ (region filtered) | ❌ |
| Config Taxes | ✅ | ✅ | ❌ | ❌ |
| Gestion Users | ✅ | ✅ | ❌ | ❌ |
| Rapports | ✅ | ✅ | ✅ (region filtered) | ❌ |
| Journal d'Audit | ✅ | ❌ | ❌ | ❌ |
| Scanner Agent | ✅ | ✅ | ✅ | ✅ |

## Prioritized Backlog

### P0 (Critical) - COMPLETED
- All core features implemented

### P1 (High Priority) - Next Phase
- Agent: Offline mode with deferred sync
- USSD/SMS verification simulation
- WhatsApp notifications for renewal reminders
- SMS notifications (Twilio integration)

### P2 (Medium Priority)
- Admin: Regional performance breakdown
- Citizen: Vehicle document upload
- PDF receipt generation
- ~~Email notifications~~ ✅ DONE (Jan 28, 2026)

### P3 (Low Priority/Nice-to-Have)
- Native mobile app (Android/iOS)
- Payment gateway integration (Zamani Cash, Airtel Money, Moov Money)
- Vehicle database validation against DGI records

## API Endpoints Summary

### Auth
- POST /api/auth/register - Citizen registration
- POST /api/auth/login - Citizen login
- POST /api/auth/admin/login - Admin/Agent login
- GET /api/auth/me - Get current user

### Vehicles
- GET/POST /api/vehicles - List/Create vehicles
- GET/PUT/DELETE /api/vehicles/{id} - Vehicle operations

### Stickers
- GET /api/stickers - List user stickers
- POST /api/stickers/purchase - Purchase sticker

### Verification
- GET /api/verify/{plate} - Verify vehicle status

### Admin
- GET /api/admin/dashboard - KPIs
- GET /api/admin/vehicles - All vehicles
- GET /api/admin/stickers - All stickers
- GET/POST/PUT /api/admin/tax-configs - Tax config
- GET/POST /api/admin/users - User management
- GET /api/admin/reports/payments - Financial report
- GET /api/admin/audit-logs - Audit trail

### Notifications (NEW - Jan 28, 2026)
- GET /api/notifications/config - Get email config status
- GET /api/notifications/logs - Get notification history
- POST /api/notifications/test-email - Send test email
- POST /api/notifications/send-expiry-reminders - Send 7-day expiry reminders

### Agent
- POST /api/inspections - Record inspection
- GET /api/inspections - Get inspection history
