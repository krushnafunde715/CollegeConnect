# CollegeConnect

> **A Secure and Privacy-Aware Student Data Management System Based on DPDP Principles**

CollegeConnect is a production-grade educational data management platform engineered with an emphasis on **secure authentication, role-based authorization (RBAC), department-level data isolation, student personal data privacy, and immutable audit trails** aligned with modern Digital Personal Data Protection (DPDP) principles.

---

## 🚀 Key Highlights & Architecture

- **Mandatory Authentication via Institutional Email + Argon2id:**
  - Authenticates strictly using registered institutional email (`user@college.edu`) and password hashed using constant-time **Argon2id** (`time_cost=3`, `memory_cost=64MB`, `parallelism=4`).
  - **No public self-registration:** All accounts are created by authorized administrators.
  - **College ID / PRN is stored separately as a student identifier**, never used as the login credential.
  - Automatic role identification after authentication (no client-side role selection dropdowns).
- **Controlled Super Admin Initial Setup:**
  - Initial Super Admin account is provisioned via a dedicated secure setup key (`INIT-CCIT-SECURE-SETUP-KEY-2026`). Uncontrolled creation of additional super admin accounts is strictly prevented.
- **Account Verification Lifecycle:**
  - Account states: `Pending Verification`, `Active`, `Suspended`, `Disabled`.
  - Unverified accounts cannot access protected resources.
  - Cryptographically random single-use tokens are hashed with **SHA-256** in the database and automatically invalidated upon activation.
  - Honest email delivery interface with **Local Development Outbox** capture when SMTP is unconfigured.
- **Strict Role-Based Authorization & Isolation:**
  - **Department Isolation:** Academic Department Admins cannot view or modify student/faculty records outside their assigned department (e.g. Computer Engineering vs. IT).
  - **Class-Level Control:** Faculty/Teachers only access students in their assigned divisions with privacy minimization (masked guardian contacts and restricted home addresses).
  - **Student Ownership & IDOR Protection:** Students can only view and modify their own records.
- **DPDP Right to Data Correction & Privacy Center:**
  - Students can submit correction requests for demographic or academic fields.
  - Department Admins review and approve/reject requests; approved requests automatically update target database records and record an audit log event.
- **Tamper-Proof Examination Hall Tickets:**
  - Hall tickets generated with SHA-256 cryptographic verification fingerprints for counterfeit prevention.
- **Purpose-Limited Campus Placements:**
  - Corporate recruiters and placement admins access only purpose-limited student data (CGPA, department, roll number, institutional email).

---

## 🛠 Technology Stack

### Backend
- **Python 3.14 / 3.11+** with **Flask 3.x**
- **Flask-SQLAlchemy 3.x** & **Flask-Migrate**
- **Argon2-cffi** for password hashing
- **PyJWT** for cryptographically signed tokens
- **Flask-Limiter** for rate-limiting brute force attacks
- **Pytest** for automated security & authorization test suites
- **PostgreSQL** (intended) / **SQLite** (local development fallback)

### Frontend
- **React 19**
- **Vite 6**
- **Tailwind CSS v4**
- **Lucide React**

---

## ⚙️ Quick Start Guide

### 1. Prerequisites
- Python 3.11+ (Python 3.14 supported)
- Node.js 18+ / npm

### 2. Backend Setup

```bash
# From project root
python -m venv venv

# Activate venv:
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# Linux/macOS:
source venv/bin/activate

# Install dependencies:
pip install -r backend/requirements.txt

# Configure environment variables (defaults provided):
cp backend/.env.example backend/.env

# Seed initial database & demo credentials:
python backend/seed.py

# Start Flask Backend server (runs on http://127.0.0.1:5000):
python backend/run.py
```

### 3. Frontend Setup

```bash
# In a separate terminal, navigate to frontend directory:
cd frontend

# Install Node dependencies:
npm install

# Start Vite Development Server (runs on http://localhost:5173):
npm run dev
```

Open your browser at **http://localhost:5173**.

---

## 👥 Demo Institutional Credentials

All roles authenticate using **registered institutional email + password**:

| Role Authority | Registered Email | Password | Scope & Boundaries |
| :--- | :--- | :--- | :--- |
| **Super College Admin** | `superadmin@college.edu` | `SuperAdmin@2026!` | Institutional governance, departments, admin provisioning, global audit |
| **COMP Dept Admin** | `comp.admin@college.edu` | `Admin@COMP2026!` | Computer Engineering classes, students, faculty, DPDP corrections |
| **IT Dept Admin** | `it.admin@college.edu` | `Admin@IT2026!` | Information Technology classes and students (isolated from COMP) |
| **Exam Dept Admin** | `exam.admin@college.edu` | `Admin@EXAM2026!` | Timetables, seat registrations, tamper-proof hall tickets, results |
| **Placement Dept Admin** | `placement.admin@college.edu` | `Admin@TPO2026!` | Recruiting companies, placement drives, purpose-limited candidate pool, offers |
| **Class Teacher** | `teacher.hayes@college.edu` | `Teacher@2026!` | Class Teacher for `SE A` (Subject: DSA), daily attendance, internal marks |
| **Student** | `alice.sharma@college.edu` | `Student@2026!` | Roll: `CC-2026-COMP-001`, profile, marks, hall tickets, Privacy Center |

> **Tip:** You can click any card in the **"Evaluation Quick Logins"** section on the login screen for instant credential autofill.

---

## 🧪 Running Automated Tests

CollegeConnect includes automated test suites covering authentication, authorization barriers, DPDP privacy workflows, and the complete 15-step Priority E2E MVP flow.

```bash
# Run all tests:
.\venv\Scripts\pytest .\backend\tests\ -v
```

### Tested Scenarios:
1. `test_auth.py`:
   - Controlled Super Admin setup with secret key.
   - Re-initialization prevention.
   - Login authentication & Argon2 password hashing.
   - Account lockout & generic failure messages preventing email enumeration.
   - Verification token single-use invalidation & account activation.
   - Time-limited password reset workflow & active session revocation.
2. `test_authorization.py`:
   - Department isolation between Computer Engineering and IT Admins.
   - Class-level access control preventing teachers from accessing unassigned classes.
   - Student role privilege boundaries.
3. `test_student_privacy.py`:
   - DPDP Privacy Notice retrieval and active consent recording.
   - Student data access requests and grievance logging.
4. `test_e2e_flow.py`:
   - **The exact 15-step Priority MVP workflow from Super Admin setup &rarr; Department creation &rarr; Admin provisioning &rarr; Class creation &rarr; Student addition &rarr; Email verification &rarr; Teacher assignment &rarr; Teacher attendance &rarr; Student profile &rarr; DPDP Correction request &rarr; Admin review & update &rarr; Institutional audit logging.**

---

## 📧 Email Delivery in Local Development

When `MAIL_SERVER` is left blank in `.env`, the system safely switches to **Local Development Outbox Mode**:
- Activation and password reset tokens are safely captured in memory.
- You can inspect all captured messages in real-time by clicking **"Dev Outbox"** in the top navigation bar.
- Includes a **"1-Click Verify"** button to instantly activate accounts during testing without opening an email client.
- When production SMTP credentials (`MAIL_SERVER`, `MAIL_USERNAME`, `MAIL_PASSWORD`) are configured, emails are delivered over TLS.
