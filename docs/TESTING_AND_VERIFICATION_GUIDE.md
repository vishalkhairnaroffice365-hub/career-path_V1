# CareerPath V1 — Web Application Testing & Verification Guide

This guide provides step-by-step instructions to run, test, and verify the full-stack **CareerPath V1** application (Frontend + Backend + MongoDB Atlas).

---

## 📋 Table of Contents
1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [Step-by-Step Execution Guide](#2-step-by-step-execution-guide)
3. [End-to-End Feature Test Plan](#3-end-to-end-feature-test-plan)
4. [Live REST API Verification](#4-live-rest-api-verification)
5. [Database Verification (MongoDB Atlas)](#5-database-verification-mongodb-atlas)
6. [Troubleshooting & Diagnostics](#6-troubleshooting--diagnostics)

---

## 1. Prerequisites & Environment Setup

### Configuration Files Check

#### 1. Backend Configuration (`server/.env`)
Ensure `C:\Users\aknai\career-path_V1\server\.env` exists with:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@career-path-cluster.hcjddyr.mongodb.net/?appName=career-path-cluster
JWT_SECRET=0QLEZzUyew6TdtW0w1Zqn0E/bAxZz56pK3LGlyeYA70=
JWT_EXPIRES_IN=7d
```

#### 2. Frontend Configuration (`.env`)
Ensure `C:\Users\aknai\career-path_V1\.env` exists with:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 2. Step-by-Step Execution Guide

### Step 2.1: Seed the MongoDB Database
Populates MongoDB Atlas with domains, 3D theme parameters, careers, roadmaps, skills, projects, and resources:

```bash
# Open Terminal 1
cd C:\Users\aknai\career-path_V1\server
npm run seed
```

**Expected Console Output**:
```text
🌱 Starting idempotent MongoDB database seeding...
✅ Seeded 10 Achievements
✅ Seeded 8 Domains
✅ Seeded 36 Skills
✅ Seeded 11 Careers
✅ Seeded 3 Roadmaps
✅ Seeded 10 Projects
✅ Seeded 15 Resources
🎉 Database seeding completed successfully.
```

---

### Step 2.2: Start the Backend REST API Server
Keep the backend running in **Terminal 1**:

```bash
npm run dev
```

**Expected Console Output**:
```text
[INFO] ✅ Successfully connected to MongoDB Atlas database
[INFO] 🚀 Server running on http://localhost:5000
[INFO] 📡 API endpoint: http://localhost:5000/api/v1
[INFO] 🩺 Health check: http://localhost:5000/api/v1/health
[INFO] 🌍 Environment: development
```

---

### Step 2.3: Start the Frontend React Application
Open a **new Terminal (Terminal 2)**:

```bash
cd C:\Users\aknai\career-path_V1
npm run dev
```

**Expected Console Output**:
```text
  VITE v8.2.2  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 3. End-to-End Feature Test Plan

Open your browser at **`http://localhost:5173`** and test the application workflows:

### Test Flow 1: Landing Page & User Registration (`/signup`)
- [ ] Visit `http://localhost:5173`.
- [ ] Click **"Begin Journey"** or **"Discover My Path"**.
- [ ] Fill out the registration form with:
  - **Name**: `Alex Explorer`
  - **Email**: `alex@example.com`
  - **Password**: `password123`
- [ ] Click **"Let's Begin"**.
- [ ] **Verification**: Account is created in MongoDB Atlas with bcrypt-hashed password; JWT token is stored in `localStorage`; user is redirected to `/onboarding`.

---

### Test Flow 2: Multi-Step Onboarding Questionnaire (`/onboarding`)
- [ ] Step 1 (**About You**): Fill in current role, age, location, and education level.
- [ ] Step 2 (**Interests**): Select interest areas (e.g. *Building Apps*, *AI & Robotics*).
- [ ] Step 3 (**Skills**): Select your current skill level and existing technologies.
- [ ] Step 4 (**Strengths**): Choose core strengths (e.g. *Problem Solving*, *Visual Thinking*).
- [ ] Step 5 (**Work Style**): Select preferred work environments (e.g. *Remote-First*, *Collaborative*).
- [ ] Step 6 (**Career Goals**): Select primary timeline and salary expectations.
- [ ] Step 7 (**Future Vision**): Choose your 5-year vision and motivations.
- [ ] Click **"See My Profile"**.
- [ ] **Verification**: Onboarding payload is saved into the MongoDB user document in real time.

---

### Test Flow 3: Profile Reflection & Analysis (`/profile-reflection` & `/analysis`)
- [ ] Review your personalized archetype breakdown, core pillars, and summary.
- [ ] Click **"Explore Career Sky"**.
- [ ] Observe the animated analysis phase that computes your career alignment scores.

---

### Test Flow 4: Interactive 3D Career Sky (`/sky`)
- [ ] Interact with the Three.js 3D celestial canvas (orbit, pan, and zoom).
- [ ] Click on a floating domain sphere (e.g. **App Development** or **AI & Machine Learning**).
- [ ] **Verification**: Domain atmosphere, particles, lighting, and subdomains update based on database records.
- [ ] Click on a subdomain to view associated career cards.

---

### Test Flow 5: Career Details & Selection (`/careers/:id` & `/select`)
- [ ] Click **"View Details"** on a career (e.g. **Android Developer**).
- [ ] Switch between tabs: *Overview*, *A Day In The Life*, and *Key Skills*.
- [ ] Note the dynamic **Match Score** calculated specifically from your onboarding answers.
- [ ] Click **"Select This Career"**.
- [ ] **Verification**: `selectedCareerId` is saved to your MongoDB user profile; achievement `"Decided"` is earned.

---

### Test Flow 6: Career Comparison (`/compare`)
- [ ] On any career page, click **"+ Compare"**.
- [ ] Add up to 3 careers (e.g. *Android Developer*, *iOS Developer*, *ML Engineer*).
- [ ] Navigate to `/compare` to view side-by-side comparisons of salaries, demand tiers, time to ready, and pros/cons.
- [ ] **Verification**: Compared IDs are persisted in your user document.

---

### Test Flow 7: Skill Gap Analysis (`/skill-gap`)
- [ ] Navigate to `/skill-gap` from the navigation bar.
- [ ] Review the breakdown of skills: **Acquired**, **In Progress**, and **Missing**.
- [ ] Verify overall readiness percentage dynamically calculated from your skill profile.

---

### Test Flow 8: Interactive Roadmap (`/roadmap`)
- [ ] Navigate to `/roadmap`.
- [ ] View structured learning phases (e.g. *Foundation*, *Android Core*, *Advanced*, *Launch Ready*).
- [ ] Click on an available node (e.g. *Jetpack Compose UI*).
- [ ] Click **"Mark as Complete"**.
- [ ] **Verification**: Node status updates to completed; dependent prerequisite nodes unlock; user streak and hours learned increment automatically in MongoDB Atlas.

---

### Test Flow 9: Portfolio Projects & Resources (`/projects` & `/resources`)
- [ ] Navigate to `/projects`.
- [ ] Filter by career or difficulty tier (Starter, Intermediate, Capstone).
- [ ] Update a project's status to **In Progress** or **Completed**.
- [ ] Navigate to `/resources` and browse courses, books, and interactive practice platforms.
- [ ] Click **"Mark Completed"** on a learning resource.

---

### Test Flow 10: Gamified Achievements & User Profile (`/profile` & `/achievements`)
- [ ] Navigate to `/achievements` to inspect unlocked badges (*First Step*, *Decided*, *Builder*, etc.).
- [ ] Navigate to `/profile` to view summary stats:
  - Total Hours Learned
  - Skills Acquired
  - Projects Built
  - Active Streak Days
  - Career Readiness Score (%)
- [ ] Click **"Sign Out"** to verify secure session cleanup from `localStorage`.

---

## 4. Live REST API Verification

You can test individual endpoints directly in your browser, terminal (`curl`), or Postman:

| Endpoint | Method | Auth | Description | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| `http://localhost:5000/api/v1/health` | `GET` | Public | System and DB connectivity health check | `200 OK` |
| `http://localhost:5000/api/v1/domains` | `GET` | Public | 8 domains with 3D positions & theme styles | `200 OK` |
| `http://localhost:5000/api/v1/careers` | `GET` | Optional | 11 careers with match scores | `200 OK` |
| `http://localhost:5000/api/v1/skills` | `GET` | Public | 36 skill definitions | `200 OK` |
| `http://localhost:5000/api/v1/projects` | `GET` | Optional | 10 portfolio projects | `200 OK` |
| `http://localhost:5000/api/v1/resources` | `GET` | Optional | 15 learning resources | `200 OK` |
| `http://localhost:5000/api/v1/achievements` | `GET` | Optional | 10 system achievement definitions | `200 OK` |
| `http://localhost:5000/api/v1/auth/me` | `GET` | Protected | Authenticated user profile | `200 OK` (with Bearer token) |

---

## 5. Database Verification (MongoDB Atlas)

To verify the live database records directly in MongoDB Atlas:

1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com).
2. Under **Deployment** → **Database**, locate `career-path-cluster`.
3. Click **Browse Collections**.
4. You will see the following collections populated:
   - **`users`**: Contains registered user documents with embedded `onboardingData`, `progress`, `stats`, and `achievements`.
   - **`domains`**: 8 documents containing 3D coordinate vectors `[x, y, z]` and theme settings.
   - **`careers`**: 11 documents with salary tiers and skill mappings.
   - **`roadmaps`**: Learning node hierarchies with prerequisite relationships.
   - **`skills`**: Catalog of categorized skills.
   - **`projects`**: Guided portfolio projects.
   - **`resources`**: Learning resources.
   - **`achievements`**: System badge definitions.

---

## 6. Troubleshooting & Diagnostics

### Issue 1: `querySrv ECONNREFUSED`
- **Cause**: Local ISP router DNS rejects SRV record lookups for `_mongodb._tcp.*`.
- **Solution**: Node DNS servers are configured to use Google/Cloudflare DNS (`8.8.8.8`, `1.1.1.1`) inside `server/src/config/database.ts`.

### Issue 2: Frontend Cannot Reach Backend
- **Check**: Ensure `server/.env` has `PORT=5000` and root `.env` has `VITE_API_URL=http://localhost:5000/api/v1`.
- **Check**: Verify backend is running in Terminal 1 on `http://localhost:5000`.

### Issue 3: Port 5000 or 5173 Already in Use
- **PowerShell command to find and close a stuck port**:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

---

## 7. Automated Test Suite (`npm run test:api`)

To run a fast, comprehensive automated verification of all 15 backend API capabilities simultaneously:

```bash
# With the backend server running in Terminal 1:
npm run test:api
```

**Automated Test Matrix Executed**:
1. `GET /health` — DB status and server readiness
2. `POST /auth/register` — User creation & JWT generation
3. `POST /auth/login` — Authentication & password verification
4. `GET /auth/me` — Protected token validation
5. `POST /users/onboarding` — Multi-factor questionnaire persistence
6. `POST /users/onboarding/complete` — Lifecycle completion flag
7. `GET /domains` — 3D thematic domains catalog
8. `GET /careers` — Dynamic match scores based on user profile
9. `POST /careers/select` — Active path selection & achievement triggers
10. `POST /careers/compare` — Multi-career comparison list persistence
11. `GET /skills/gap/:careerId` — Skill gap calculation engine
12. `POST /roadmaps/nodes/:nodeId/complete` — Roadmap completion & streak calculation
13. `POST /projects/:projectId/status` — Project portfolio status tracking
14. `POST /resources/:resourceId/complete` — Learning resource tracking
15. `GET /achievements` — Unlocked milestone badges verification

---

## 8. Docker Deployment Verification

To test the entire containerized application locally with Docker:

```bash
# Build and run containers in background
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Shut down containers
docker compose down
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`
