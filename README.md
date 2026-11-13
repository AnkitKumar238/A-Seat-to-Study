# A Seat to Study | Library Seat Reservation Platform

> **Full-Stack Academic Sanctuary Library Management System**  
> Designed from Google Stitch Project: *Library Seat Reservation Platform* (`projects/9107439051235603232`).  
> Built with **React.js (Vite)**, **Tailwind CSS**, **Node.js (Express.js)**, and **Supabase PostgreSQL**.

---

## 🌐 Live Production Deployments

| Component | Platform | Deployment URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [**https://a-seat-to-study.vercel.app**](https://a-seat-to-study.vercel.app) | 🟢 Live & Operational |
| **Backend REST API** | Vercel Serverless | [**https://a-seat-to-study-api.vercel.app**](https://a-seat-to-study-api.vercel.app) | 🟢 Live & Operational |
| **Cloud Database** | Supabase PostgreSQL | `rkfcnaetgtyguzbwwfgx.supabase.co` | 🟢 Cloud Connected |
| **System Health Check** | REST Endpoint | [**https://a-seat-to-study-api.vercel.app/api/health**](https://a-seat-to-study-api.vercel.app/api/health) | 🟢 JSON Verified |

---

## 🏛️ Executive Summary

**A Seat to Study** is an intelligent, full-stack library seat reservation and occupancy management web platform developed for modern university campuses (Lovely Professional University — LPU Central Library). Addressing study hall peak congestion, desk hogging, and poor space utilization during midterm and finals weeks, the platform integrates real-time environmental telemetry, visual 2D floor plans, an automated **15-minute fair-use grace period auto-release engine**, and granular role-based administrative auditing.

Every visual token—from the deep academic primary green (`#002043` / `#17365d`) and academic blues (`#0051d5`) to warm parchment background surfaces and tactile micro-states—is meticulously aligned with the **Google Stitch Academic Sanctuary** design specification.

---

## 📱 Mobile Responsiveness & Multi-Device Support

The frontend is fully responsive and optimized for touch interactions across all viewport form factors:
- **Small Mobile**: 320px (iPhone SE, narrow viewports)
- **Standard Mobile**: 375px (iPhone 12/13 mini), 390px (iPhone 14/15), 430px (iPhone Pro Max)
- **Tablets**: 768px (iPad Mini / Portrait), 1024px (iPad Pro)
- **Desktop**: 1280px to 4K Ultra-Wide

### Mobile UX Enhancements
- **Collapsible Mobile Drawer**: Sleek slide-out hamburger navigation drawer with dark backdrop overlay that automatically closes upon navigation.
- **Header Telemetry**: Responsive telemetry chips that gracefully adapt text on compact screens without horizontal overflow.
- **Stacking Grid Cards**: 4-card metric summaries and split master-detail layouts that transition from single-column on mobile to asymmetric multi-column grids on desktop.
- **Architectural Seat Map Pan**: Panning canvas with touch zoom and zone inspection that preserves blueprint fidelity on mobile screens.
- **Responsive Charts**: 16-bar hourly occupancy forecast with horizontal swipe capability on narrow devices.
- **Touch-Friendly Controls**: Minimum 44px tap targets for buttons, selectors, tabs, and modals.
- **Viewport Meta Configuration**: Viewport meta tag configured with `viewport-fit=cover` for edge-to-edge mobile viewing.

---

## 🧭 Initial Landing Page Architecture

Visitors opening the production URL ([https://a-seat-to-study.vercel.app](https://a-seat-to-study.vercel.app)) land directly on the **Main Dashboard**:
- **Public Sanctuary Overview**: Visitors can explore real-time occupancy counts, 3-floor load breakdown, IoT sensor metrics (sound dB, temperature, air quality), and study tips without mandatory login.
- **Contextual Actions**: The prominent **"Book a New Seat"** and **"Floor Heatmap"** buttons provide immediate access to the interactive floor map and booking wizard.
- **Dedicated Authentication**: Sign In (`/login`) and Enrollment (`/register`) are accessible separately via the top navigation and sidebar, maintaining session privacy for personal bookings and administrative consoles.

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
  - 🌿 *Zone A • Silent Study Pods (North Wing)*: Deep study, individual pods with acoustic glass (<32 dB).
  - 💻 *Zone D • Dual-Monitor Tech Stations (East Wing)*: Dual 4K workstations with 100W USB-C PD.
  - 🏛️ *Zone B • Collaborative Study Hub (Center Atrium)*: Group tables, natural light, and glass whiteboards.
  - 🌅 *Zone C • Window Panorama Bar (South Glass Curtain)*: High bar counter with campus lawn view.
- **Environmental Telemetry**: Live IoT monitoring displaying Ambient Sound (dB), Temperature (°C), Air Quality Index (AQI), and Natural Sunlight percentage.
- **Dynamic Desk Filtering**: Instant filtering by Zone, Amenity (Dual Monitors, Power Outlets, Natural Light, Ergonomic Chair), and Seat Status (*Available*, *Occupied*, *Reserved*, *Offline*).

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
                        │  - Deployed on Vercel                   │
                        │  - Tailwind CSS (Academic Sanctuary)   │
                        │  - Responsive (320px to Desktop 4K)     │
                        │  - Live at: a-seat-to-study.vercel.app  │
                        └────────────────────┬────────────────────┘
                                             │ HTTP / REST (Fetch)
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │       Node.js / Express.js Backend      │
                        │  - Deployed on Vercel Serverless        │
                        │  - JWT Bearer Authentication            │
                        │  - 15-Minute Grace Auto-Release Engine  │
                        │  - CORS & Global Error Handling         │
                        └────────────────────┬────────────────────┘
                                             │ @supabase/supabase-js
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │         Supabase PostgreSQL DB          │
                        │  - Managed Cloud Relational Database    │
                        │  - Users, Seats, Reservations, Logs     │
                        │  - Foreign Keys, Indexes & RLS Policies │
                        └─────────────────────────────────────────┘
```

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Google Material Symbols, Inter & Plus Jakarta Sans fonts.
- **Backend**: Node.js 20+, Express.js 4, `@supabase/supabase-js`, JSONWebToken, BcryptJS, Dotenv, CORS.
- **Database**: Supabase PostgreSQL Cloud with automatic resilience adapters.

---

## 🎨 Google Stitch Design System Tokens

| Token Name | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Primary Navy** | `#002043` | Primary navigation, hero CTA buttons, active state indicators |
| **Primary Container** | `#17365d` | Brand header badges, card accents, active tab indicators |
| **Secondary Accent** | `#0051d5` | Active focus highlights, primary action buttons, live indicators |
| **Warm Surface** | `#f8f9ff` | Background surface, serene academic atmosphere |
| **Surface Lowest** | `#ffffff` | Elevated cards, forms, input containers |
| **Status Available** | `#22c55e` | Available desk chips, verified check-in badges |
| **Status Occupied** | `#ef4444` | Occupied workstations, active alerts |
| **Status Reserved** | `#3b82f6` | 15-minute grace period holds, confirmed passes |

---

## 🔑 Demo Credentials

| Role | User & Identifier | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Student** | **Ankit Singh Rathore**<br>`ankit@lpu.in`<br>*(or ID: `12513583`)* | `StudySanctuary2025#`<br>*(or `password123`)* | Dashboard, Interactive Floor Map, 3-Step Booking Wizard, My Bookings, Digital RFID Pass, Desk Extension |
| **Admin** | **Ankit Singh Rathore**<br>`admin@library.univ.edu`<br>*(or ID: `ADMIN-001`)* | `StudySanctuary2025#`<br>*(or `admin123`)* | Operations Overview, Turnstile Controls, Desk Overrides, Student Strike Waivers, CSV Audit Export |

*You can also use the **Phase Switcher** located at the bottom of the screen to preview any workflow instantly.*

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime, version, and Supabase connection state |
| `POST` | `/api/auth/register` | Public | Register new student profile in Supabase PostgreSQL |
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

## 🧪 Automated Testing & Build Verification

### Backend Integration Tests (22 / 22 Passed):
```bash
node backend/test-migration.js
# Validates health, auth, seats, reservations, RFID check-in, auto-sweep, and admin endpoints.
```

### Frontend Production Build:
```bash
npm --prefix frontend run build
# Compiles all modules into /dist with 0 errors in ~13 seconds.
```

---

## 📄 License & Credits
- **Designed for**: College Capstone & Engineering Portfolio.
- **Design Origin**: Google Stitch Project — *Library Seat Reservation Platform*.
- **Author**: Ankit Singh Rathore (Student ID: 12513583) • Lovely Professional University (LPU).
- **License**: MIT Open Source.
