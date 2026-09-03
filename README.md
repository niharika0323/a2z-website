# A2Z Solutions — Enterprise Background Verification (BGV) & Workforce Platform

A modern, full-stack Next.js web application engineered for enterprise-grade **Background Verification (BGV) Intelligence**, real-time workforce management, and single-source corporate operations.

---

## 🌟 Key Platform Features

### 1. Enterprise BGV Operations Platform
- **Operations Console**: Live monitoring of verification workloads with:
  - **Overall Checks Status**: Visual circular distribution of closed checks, work-in-progress, and insufficiencies.
  - **Turn-Around Time (TAT) Status**: Real-time SLA adherence gauge (82% In-TAT vs 18% Out-TAT).
  - **Month-wise Business Calculation ($)**: Annual verification volume and business trajectory graph with interactive monthly breakdown.
- **6 Core Forensic Verification Engines**:
  1. *Identity & Biometric KYC*: Aadhaar (UIDAI), PAN (NSDL), Passport, and Voter ID with AI facial liveness.
  2. *Criminal & Court Records*: Automated scanning across 10,000+ District Courts, High Courts, and Supreme Court e-Courts registries.
  3. *Employment & EPF Forensics*: Direct EPFO/UAN database integration and tenure verification.
  4. *Academic & Degree Validation*: 1,200+ accredited university registries and roll-number authentication.
  5. *Geo-Tagged Address Check*: Digital GPS geo-fencing combined with ground officer verification.
  6. *Global AML & Sanctions*: Interpol Red Notices, OFAC, UN Sanctions, RBI, and PEP registers.

### 2. Unified Authentication & Role-Based Routing
- **Single Login Portal** (`/login`): Clean, unified login interface that automatically routes users based on their role:
  - **ADMIN** ➔ Dedicated Administrative Control Center (`/admin`)
  - **STAFF / EMPLOYEE** ➔ Dedicated Staff Self-Service Portal (`/employee`)
- **Quick-Fill Demo Access**: 1-click test credentials for instant evaluation.

### 3. Administrative Control Center (`/admin`)
- **Workforce Attendance Statistics**: Real-time counters tracking Total Staff, Present Today, Absent, and Approved Leaves.
- **Employee Management**: Create new staff members with auto-generated IDs (`EMP-xxx`), assign usernames, passwords, departments, and designations.
- **1-Click Live Status Switcher**: Real-time toggles to mark employees as *Present*, *Absent*, or *On Leave*.
- **Company Calendar & Holidays**: Add and manage corporate milestones, audits, and official company holidays.

### 4. Staff Self-Service Portal (`/employee`)
- **Daily Attendance Clock**: 1-click shift punch (*Clock In*, *Clock Out*, and *Mark Leave*).
- **Assigned BGV Task Queue**: Prioritized forensic verification tasks with SLA timers.
- **Staff Directory**: Departmental colleague contact list.
- **Company Calendar**: Schedule of upcoming holidays and events.

### 5. Architectural Highlights
- **Single Table Workforce Database**: Built on Node.js native SQLite (`DatabaseSync`), housing all employee credentials, roles, and attendance records inside a single unified `employees` table.
- **No Client Brand Display**: Fully compliant with white-label requirements, focusing exclusively on the product, security engines, and workforce intelligence.
- **Scalable & Responsive Design**: Elegant glassmorphism aesthetic, sleek gradients, and compact card layouts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/niharika0323/a2z-website.git
   cd a2z-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Default Accounts

| Role | Username | Password | Direct Portal Route |
| :--- | :--- | :--- | :--- |
| **Root Administrator** | `admin` | `admin` | `/admin` |
| **Operations Staff** | `alok` | `password123` | `/employee` |
| **Forensic Verifier** | `priya` | `password123` | `/employee` |
| **Field Officer** | `rahul` | `password123` | `/employee` |

---

## 📁 Project Structure

```
├── data/
│   └── a2z.db                # SQLite database (auto-seeded on startup)
├── public/
│   └── bgv-dashboard-preview.jpg
├── src/
│   ├── app/
│   │   ├── admin/page.tsx    # Admin Control Center
│   │   ├── employee/page.tsx # Employee Self-Service Portal
│   │   ├── login/page.tsx    # Unified Authentication Page
│   │   ├── api/
│   │   │   ├── auth/         # Login verification API
│   │   │   ├── employees/    # Employee CRUD & attendance API
│   │   │   └── events/       # Calendar events API
│   │   ├── components/       # Hero, Portfolio, Navbar, Services, About, Logo
│   │   ├── globals.css       # Global styles & design tokens
│   │   ├── layout.tsx        # Root HTML layout & fonts
│   │   └── page.tsx          # Landing page
│   └── lib/
│       └── db.ts             # SQLite database layer with auto-migration
├── next.config.ts
└── package.json
```

---

## 🛡️ License
Proprietary — Developed for A2Z Solutions.
