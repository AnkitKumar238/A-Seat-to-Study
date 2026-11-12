# A Seat to Study | Library Seat Reservation Platform

> **Full-Stack Academic Sanctuary Library Management System**  
> Designed from Google Stitch Project: *Library Seat Reservation Platform* (`projects/9107439051235603232`).  
> Built with **React.js (Vite)**, **Tailwind CSS**, **Node.js (Express.js)**, and **MongoDB (Mongoose)** using pure JavaScript ES modules.

---

## 🏛️ Executive Summary

**A Seat to Study** is an intelligent, full-stack library seat reservation and occupancy management web platform developed for modern university campuses. Addressing peak study hall congestion, desk hogging, and poor seat utilization during midterm and finals weeks, the platform integrates real-time environmental telemetry, visual 2D floor plans, an automated **15-minute fair-use grace period auto-release engine**, and granular role-based administrative auditing.

Every visual token—from the deep academic primary green (`#1b3b2b`) and warm parchment backgrounds (`#fbf9f5`) to typography (Newsreader serif headers + Plus Jakarta Sans UI) and tactile micro-states—has been meticulously aligned with the **Google Stitch Academic Sanctuary** design specification.

---

## 🌟 Key Features by Phase

### 1. 🔐 Authentication & Role-Based Authorization
- **Dual-Role Architecture**: Distinct capabilities for **Students** (`STUDENT`) and Library Operations Staff (`ADMIN`).
- **Secure Sessions**: JSON Web Token (JWT) stateless auth with role claims and persistent local caching.
- **Academic Credentials**: Multi-attribute authentication via University Email (`ankit@lpu.in`, `student@campus.edu`) or Student ID Card (`12513583`).
- **RFID & Digital ID Integration**: Simulated smart campus badge UID pairing for turnstile and desk tap check-ins.

### 2. 🗺️ Interactive Library Seat Map & Telemetry
- **Visual 2D Floor Plan (Level 02)**: Complete architectural canvas mirroring Google Stitch Screen `e5470d0cf6324e93bb222cf61a5b889e`.
- **4 Dedicated Study Zones**:
  - 🌿 *Atrium (Silent Focus)*: Deep study, individual carrels with acoustic felt screens.
  - 🌅 *North Terraces (Collaborative)*: Dual 4K display workstations with natural daylight.
  - 🏛️ *West Wing (Quiet Carrels)*: Natural light window desks with ergonomic seating.
  - 📚 *Archive Mezzanine (Research Pods)*: Enclosed pods with whiteboard walls and sound isolation.
- **Environmental Telemetry**: Live IoT monitoring displaying Ambient Sound (dB), Temperature (°C), Air Quality Index (AQI), and Natural Sunlight percentage.
- **Dynamic Desk Filtering**: Instant filtering by Zone, Amenity (Dual Monitors, Height Adjustable, Power Outlets, Natural Light, Ergonomic Chair), and Seat Status (*Available*, *Occupied*, *Reserved*, *Maintenance*).

### 3. ⏱️ Seat Reservation & 15-Minute Fair Use Grace Flow
- **3-Step Reservation Wizard**:
  1. *Desk & Zone Selection* (Desk photo, acoustic rating, equipment badges, current holding status).
  2. *Schedule & Time Window* (Interactive slot selector with 15-min increments, weekly 25 hr student quota validation).
  3. *Academic Purpose Declaration* (Individual Study, Capstone Research, Group Work, Exam Preparation).
- **Automated 15-Minute Grace Period**: Desks not confirmed via RFID tap or Digital Pass QR code within 15 minutes of reservation start are automatically recycled for fellow students.
- **Automated Conduct Penalty**: Unattended no-shows incur an account strike; 3 strikes trigger temporary booking privilege suspension.

### 4. 📊 Student Dashboard & Study Quota Analytics
- **Personalized Editorial Header**: Context-aware greetings with campus alerts (e.g. *Gate 4 RFID check-in open*).
- **4 Core Metrics**: Available Desks, Floor Occupancy Ring, Active Booking Timer, and Weekly Focus Hours with Academic Tier badge (*Dean's Honor Tier*).
- **Hourly Crowd Forecast**: 16-bar hourly projection chart (8:00 AM – 11:00 PM) comparing current load against the 85% safe capacity threshold.
- **Instant Seat Match**: Algorithmic one-click seat finder matching user preferences (Silent, Dual Monitor, Windows).

### 5. 🎟️ My Bookings & Digital Study Pass
- **Live Active Session Card**: Real-time elapsed time bar, live desk sensor readings, and instant desk extension (`+30 Mins`).
- **Digital Pass Modal**: Pop-up pass with scannable QR code, barcode, and one-click *Tap Virtual RFID Card* check-in simulator.
- **Reservation History & Status Tabs**: Real-time filtering across *Active*, *Upcoming*, and *Past/Cancelled* bookings.
- **Early Release**: Free up desks when leaving early to immediately return capacity to the community.

### 6. 🛡️ Admin Operations & Library Management Portal
- **Facility Operations Overview**: Master telemetry hub tracking total building occupancy (450 capacity), active turnstile throughput, and peak hour forecasts.
- **Student Conduct & Booking Audit**: Live searchable table of all campus reservations with instant strike waivers/pardons.
- **Desk Status Overrides**: Instant admin overrides to place desks under `MAINTENANCE` or release locks.
- **Turnstile Gate Controls**: Real-time toggle controls for Gates 1–4 (North Lobby, South Atrium, East Commons, West Mezzanine).
- **Emergency Protocols**: One-click Emergency Capacity Protocol button and automated CSV Audit Log export.

---

## 🏗️ Architecture & Technology Stack

```
                        ┌─────────────────────────────────────────┐
                        │          React.js Client (Vite)          │
                        │  - Tailwind CSS (Academic Sanctuary)   │
                        │  - Context API (Auth & Notifications)   │
                        │  - Responsive & Mobile Optimized        │
                        └────────────────────┬────────────────────┘
                                             │ HTTP / REST (Fetch)
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │         Node.js / Express.js API        │
                        │  - JWT Bearer Authentication            │
                        │  - Grace Period Automated Engine        │
                        │  - CORS & Global Error Handling         │
                        └──────────────┬──────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     MongoDB Atlas (Mongoose)  │             │   High-Performance In-Memory  │
│  - User & Role Model          │             │   Development Store (Fallback)│
│  - Seat & Zone Model          │             │  - Zero setup instant testing │
│  - Reservation Model          │             │  - 70 pre-seeded Level 02 des-│
│  - TelemetryLog Model         │             │    ks, sensors, & demo records│
└───────────────────────────────┘             └───────────────────────────────┘
```

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React & Google Material Symbols.
- **Backend**: Node.js 20+, Express.js 4, Mongoose 8, JSONWebToken, BcryptJS, Dotenv, CORS.
- **Database**: MongoDB (with seamless auto-fallback to pre-seeded in-memory store if Atlas connection is not configured).

---

## 🎨 Google Stitch Design System Tokens

The application strictly implements the design tokens extracted from Google Stitch:

| Token Name | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Primary Deep Forest** | `#1b3b2b` | Primary navigation, hero CTA buttons, active state indicators |
| **Primary Container** | `#2d5a43` | Badges, hover highlights, active tab indicators |
| **Warm Parchment** | `#fbf9f5` | Page background, serene academic atmosphere |
| **Muted Surface** | `#f3efe6` | Cards, secondary buttons, input field containers |
| **Academic Amber** | `#c28b26` | Live reservations, countdown timers, warning alerts |
| **Occupancy Terracotta** | `#d9534f` | Occupied desks, high noise sensor warnings, penalty alerts |
| **Serene Accent** | `#e8f0eb` | Available desk chips, subtle border outlines |
| **Muted Slate** | `#64748b` | Subheadings, timestamps, secondary metadata |

---

## 📂 Repository Directory Layout

```
A Seat to Study/
├── package.json                   # Root coordination scripts
├── .gitignore                     # Root git ignore (node_modules, .env, build artifacts)
├── README.md                      # Comprehensive platform handbook
│
├── frontend/                      # React.js Client (Vite + Tailwind CSS)
│   ├── .env                       # Frontend environment variables (VITE_API_BASE_URL)
│   ├── .env.example               # Template for environment configuration
│   ├── package.json               # Frontend dependencies & build commands
│   ├── vite.config.js             # Vite bundler configuration
│   ├── tailwind.config.js         # Stitch Academic Sanctuary theme tokens
│   ├── index.html                 # App shell with Newsreader & Plus Jakarta fonts
│   └── src/
│       ├── main.jsx               # React DOM hydration root
│       ├── App.jsx                # Application routing & active view switcher
│       ├── index.css              # Tailwind layer directives & custom utility classes
│       ├── context/
│       │   └── AuthContext.jsx    # Authentication & user session context provider
│       ├── components/
│       │   ├── common/            # Design system primitives (Button, Badge, Card, Input)
│       │   ├── layout/            # App shell (Sidebar, Header, AppLayout)
│       │   ├── map/               # Interactive 2D Seat Map & Zone filters
│       │   └── booking/           # Digital Pass Modal with simulated RFID scanner
│       ├── pages/
│       │   ├── LoginPage.jsx      # Student & Admin sign-in
│       │   ├── RegisterPage.jsx   # New student enrollment
│       │   ├── DashboardPage.jsx  # Primary student analytics & quick-booking
│       │   ├── FindSeatPage.jsx   # Interactive Level 02 floor plan & telemetry
│       │   ├── SeatBookingPage.jsx# 3-step reservation workflow & quota check
│       │   ├── MyBookingsPage.jsx # Active & past reservations with pass launcher
│       │   └── AdminPortalPage.jsx# Library staff control center & turnstile toggles
│       └── services/
│           ├── api.js             # Centralized HTTP request service
│           └── seatService.js     # Seat & telemetry client helpers
│
└── backend/                       # Node.js + Express.js API Server
    ├── .env                       # Backend environment variables (PORT, MONGO_URI, JWT)
    ├── .env.example               # Template for backend secrets
    ├── package.json               # Backend dependencies & test scripts
    ├── test-master.js             # 18-step automated end-to-end integration test suite
    └── src/
        ├── server.js              # Express app bootstrap & HTTP listener
        ├── config/
        │   └── db.js              # Mongoose MongoDB connection manager
        ├── middleware/
        │   ├── auth.js            # JWT verification & role authorization guards
        │   └── errorHandler.js    # Standardized JSON error response handler
        ├── models/
        │   ├── User.js            # Student/Admin schema with bcrypt password hashing
        │   ├── Seat.js            # Library desk schema with sensor telemetry & status
        │   ├── Reservation.js     # Booking schema with 15-min grace timestamp
        │   └── TelemetryLog.js    # Floor noise/light/occupancy sensor schema
        ├── controllers/
        │   ├── auth.controller.js # Auth, registration, and mock user store
        │   ├── seat.controller.js # 70-seat inventory, zone metrics, & telemetry
        │   ├── reservation.controller.js # Booking creation, RFID check-in, grace sweep
        │   └── admin.controller.js# Master facility metrics, strikes, CSV export
        └── routes/
            ├── index.js           # Central API router mounting all endpoints
            ├── auth.routes.js     # /api/auth
            ├── seat.routes.js     # /api/seats
            ├── reservation.routes.js # /api/reservations
            └── admin.routes.js    # /api/admin
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Installation
In the project root directory, install all dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Both `backend/.env` and `frontend/.env` have been created with production-safe defaults for development.

- **Backend Configuration (`backend/.env`)**:
  ```env
  PORT=5000
  NODE_ENV=development
  CLIENT_URL=http://localhost:5173
  JWT_SECRET=super_secret_study_sanctuary_jwt_token_2025_key
  MONGODB_URI=mongodb://localhost:27017/a-seat-to-study
  ```
  *(Note: If a local or Atlas MongoDB connection is not detected, the backend automatically transitions to its built-in in-memory store pre-populated with 70 desks, live telemetry, and active reservations!)*

- **Frontend Configuration (`frontend/.env`)**:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 3. Launch Development Servers
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Running on: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Running on: http://localhost:5173
```

---

## 🔑 Demo Login Credentials

For quick evaluation and demonstrations, use the following pre-configured university accounts:

| Role | Username / Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Student** | `ankit@lpu.in`<br>*(or ID: `12513583` / `student@campus.edu`)* | `password123`<br>*(or `StudySanctuary2025#`)* | Student Dashboard, Interactive Seat Map, 3-Step Booking, My Bookings, Digital RFID Pass, Desk Extension |
| **Admin** | `admin@library.campus.edu`<br>*(or `admin@library.univ.edu` / `ADMIN-001`)* | `password123`<br>*(or `StudySanctuary2025#`)* | Operations Overview, Turnstile Gate Toggles, Desk Status Override, Student Strike Waiver, CSV Audit Export |

*You can also use the **Quick Demo Switcher** pills located directly on the Login page (`LoginPage.jsx`) for instant 1-click authentication!*

---

## 🧪 Automated Testing & Verification

The project includes an end-to-end integration test runner validating all 18 backend endpoints and workflows:

```bash
cd backend
npm test
```

### Test Coverage (18 / 18 Passed - 100%):
- **Group 1: System Health**
  - ✅ Health Check (`GET /api/health`)
- **Group 2: Authentication & Roles**
  - ✅ Student Login (`POST /api/auth/login`)
  - ✅ Admin Privileged Login (`POST /api/auth/login`)
- **Group 3: Seats & Telemetry**
  - ✅ Level 02 70-Desk Inventory (`GET /api/seats`)
  - ✅ Single Desk Details (`GET /api/seats/B07`)
  - ✅ Real-time Floor Telemetry (`GET /api/seats/telemetry?floor=2`)
- **Group 4: Reservations & 15-Minute Grace Period**
  - ✅ Create Reservation & Issue Digital Pass (`POST /api/reservations`)
  - ✅ Retrieve Student Active & Historical Bookings (`GET /api/reservations/my`)
  - ✅ RFID & QR Pass Check-In Verification (`PATCH /api/reservations/:id/check-in`)
  - ✅ Extend Active Study Reservation (`PATCH /api/reservations/:id/extend`)
  - ✅ 15-Minute Grace Auto-Release Sweep (`POST /api/reservations/sweep-grace-expired`)
- **Group 5: Student Quota & Analytics**
  - ✅ Student Dashboard Analytics & Balance (`GET /api/reservations/analytics`)
- **Group 6: Admin Operations & Controls**
  - ✅ Facility Telemetry & Peak Projection (`GET /api/admin/overview`)
  - ✅ Master Student Bookings Audit List (`GET /api/admin/bookings`)
  - ✅ Desk Status Override (`PATCH /api/admin/seats/:seatNumber/status`)
  - ✅ Student Conduct Strike Waiver & Account Pardon (`PATCH /api/admin/students/:studentId/waive-strike`)
  - ✅ Turnstile Gate Toggle (`POST /api/admin/turnstiles/:gateId/toggle`)
  - ✅ Daily Operations CSV Audit Log Export (`GET /api/admin/export/audit.csv`)

### Production Frontend Build Verification:
```bash
cd frontend
npm run build
# Compiles all 40 modules into /dist with 0 warnings or errors in ~10 seconds.
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime, version, and database connection state |
| `POST` | `/api/auth/register` | Public | Register new student profile with RFID badge ID |
| `POST` | `/api/auth/login` | Public | Authenticate using Email or Student ID, issue JWT |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated user profile & quota balance |
| `GET` | `/api/seats` | Public | Retrieve Level 02 desks with zone & status filters |
| `GET` | `/api/seats/:seatNumber`| Public | Fetch single desk equipment, power outlets, & status |
| `GET` | `/api/seats/telemetry` | Public | Get real-time acoustic dB, temperature, & AQI data |
| `POST` | `/api/reservations` | Protected | Create reservation, validate quota, issue Digital Pass |
| `GET` | `/api/reservations/my` | Protected | List current student's active, upcoming, and past passes |
| `PATCH`| `/api/reservations/:id/check-in` | Protected | Confirm presence via simulated RFID tap or QR scan |
| `PATCH`| `/api/reservations/:id/extend` | Protected | Extend study slot by 30 or 60 minutes |
| `POST` | `/api/reservations/sweep-grace-expired` | Protected | Trigger 15-minute grace auto-cancellation sweep |
| `GET` | `/api/reservations/analytics` | Protected | Get student weekly quota, floor load, & hourly curve |
| `GET` | `/api/admin/overview` | Admin Only | Master facility metrics, floor sensor logs, alerts |
| `GET` | `/api/admin/bookings` | Admin Only | Master student booking audit table with strike tags |
| `PATCH`| `/api/admin/seats/:seatNumber/status` | Admin Only | Force desk into Maintenance or Available status |
| `PATCH`| `/api/admin/students/:studentId/waive-strike` | Admin Only | Waive student no-show conduct strike |
| `POST` | `/api/admin/turnstiles/:gateId/toggle` | Admin Only | Lock or unlock entrance turnstiles 1–4 |
| `GET` | `/api/admin/export/audit.csv` | Admin Only | Download CSV audit log of facility reservations |

---

## 🎓 Academic Presentation & Demo Checklist

When demonstrating this project to professors, review committees, or peers:
1. **Introduction**: Highlight the problem statement (crowded study halls, ghost bookings, unfair desk reservations).
2. **Design Fidelity**: Show the side-by-side alignment with the Google Stitch *Academic Sanctuary* design specification.
3. **Interactive 2D Seat Map**: Navigate to Level 02 floor plan; filter by *Silent Focus* zone and toggle *Dual 4K Monitors*.
4. **Reservation Workflow**: Select desk `B07`, pick a 2-hour study slot, choose *Individual Study*, and generate the Digital Pass.
5. **15-Minute Grace Policy**: Open *My Bookings*, show the countdown timer and policy banner, and click **Tap Virtual RFID Card** to simulate in-person physical check-in.
6. **Student Quota**: Point out the remaining balance out of 25.0 weekly hours and the 16-bar hourly crowd forecast.
7. **Admin Portal**: Log in as Admin (`admin@campus.edu`), review facility capacity gauges, toggle Turnstile Gate 01 to *LOCKED_OVERFLOW*, waive a student strike, and click **Export Audit CSV** to demonstrate operational compliance.

---

## 📄 License & Credits
- **Designed for**: College Capstone & Engineering Portfolio.
- **Design Origin**: Google Stitch Project — *Library Seat Reservation Platform*.
- **Author**: Ankit (Student ID: 12513583) • Lovely Professional University (LPU).
- **License**: MIT Open Source.
