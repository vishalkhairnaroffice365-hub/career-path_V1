# 🚀 CareerPath: How to Run & Complete Testing Guide

This guide gives you the exact, step-by-step instructions to verify the database, run the backend server and frontend client, and test every feature in the UI.

---

## 📊 Database Status (MongoDB Atlas Source of Truth)

All data has been seeded and verified in MongoDB Atlas:
- **23 3D Celestial Domains & 53 Subdomains** with orbital 3D vectors `[x, y, z]`, atmosphere styling, and career statistics.
- **24 Full-Featured Careers** spanning app development, frontend, backend, AI/ML, cybersecurity, cloud/DevOps, quantum computing, blockchain, UI/UX, and robotics.
- **24 Comprehensive 15-Step Roadmaps** organized across 4 phases: *Foundation*, *Core*, *Advanced*, and *Launch & Capstone* (Total: **360 Roadmap Nodes**).
- **360 Topic-Specific Assessments** with **10+ Meaningful Questions EACH** (Total: **3,600+ Questions** in MongoDB).
- **360 Topic-Specific Courses** with real working curriculum & documentation URLs.
- **360 Coding Challenges & 360 Practical Tasks** with test cases, starter templates, and evaluation criteria.
- **43 Portfolio Projects & 42 Learning Resources** with real-time multi-field search and filters.
- **Dedicated Submissions System** with GitHub URL validation, notes, and file attachments stored per authenticated user.

---

## 🛠️ Verification & Test Commands

You can run these standalone automated scripts directly from the terminal:

### 1. Run Database Integrity Validation
```powershell
cd server
npx.cmd tsx src/scripts/validate-db.ts
```
**Expected Output:**
```text
=========================================
CAREERPATH DATABASE VALIDATION
=========================================

Domains:                 23 ✓
Subdomains:              53 ✓
Careers:                 24 ✓
Roadmaps:                24 ✓
Roadmap Nodes:          360 ✓

Courses:                360 ✓
Resources:              42 ✓
Projects:               43 ✓

Assessments:            360 ✓
Assessment Questions:  3600 ✓

Coding Challenges:      360 ✓
Practical Tasks:        360 ✓

Missing Courses:          0 ✓
Missing Resources:        0 ✓
Missing Assessments:      0 ✓
Assessments <10 Q:        0 ✓
Broken References:        0 ✓
Orphan Records:           0 ✓

=========================================
VALIDATION PASSED (100% COMPLETE)
=========================================
```

### 2. Run Comprehensive 15-Scenario Test Suite
```powershell
cd server
npx.cmd tsx src/scripts/test-comprehensive.ts
```
**Expected Output:**
```text
================================================================
🧪 RUNNING COMPREHENSIVE CAREERPATH TEST SUITE (15 SCENARIOS)
================================================================

🔌 Connected to MongoDB Atlas for Testing

✅ PASS [Test 1]: Database Completeness & 20+ Domains - Found 23 domains and 53 subdomains in DB
✅ PASS [Test 2]: Career Sky 3D Celestial Coordinates & Theming - All 23 domains have 3D vectors and celestial theme configs
✅ PASS [Test 3]: Android Developer Roadmap Integrity - Loaded 15 learning steps across 4 phases
✅ PASS [Test 4]: Cyber Security Specialist Career Switching & Roadmap - Loaded 15 steps distinct from Android
✅ PASS [Test 5]: Cloud & DevOps Engineer Roadmap Integrity - Loaded 15 steps across 4 phases
✅ PASS [Test 6]: User 1 Progress Persistence - User 1 saved and retrieved with 2 completed nodes
✅ PASS [Test 7]: User 2 Complete Session & Progress Isolation - User 2 has 0 completed nodes (No leak from User 1)
✅ PASS [Test 8]: User 1 Multi-User Independent State Verification - User 1 maintains 2 completed nodes after User 2 actions
✅ PASS [Test 9]: Career Resources & Search Capability - Found 4 Android resources and 4 Kotlin search matches
✅ PASS [Test 10]: Portfolio Projects & Search Capability - Found 7 Android projects and 10 search matches
✅ PASS [Test 11]: 360 Assessments with >= 10 Questions EACH (3,600+ Total Questions) - 360 node assessments in DB with 3600 questions (0 assessments <10 Q)
✅ PASS [Test 12]: 360 Topic-Specific Courses across All Nodes - Found 360 courses with full modules and objectives in MongoDB
✅ PASS [Test 13]: 360 Coding Challenges & 360 Practical Tasks - Found 360 challenges and 360 practical tasks in MongoDB
✅ PASS [Test 14]: GitHub & Project Submissions Persisted per User - Saved and retrieved submission for Alice Developer
✅ PASS [Test 15]: Roadmap 404 Prevention (All 24 Careers have >= 15 Steps) - All 24 careers verified with complete >= 15 node roadmaps (0 errors)

================================================================
📊 RESULTS: 15 / 15 TESTS PASSED
🎉 100% SUCCESS — ALL 15 SCENARIOS PASSED WITH ZERO REGRESSIONS
================================================================
```

### 3. Re-Seed Database (Safe & Idempotent)
If you ever want to re-seed or refresh the database:
```powershell
cd server
npx.cmd tsx src/scripts/seed.ts
```

---

## ⚡ How to Run the Application

### Step 1: Start the Backend Server (Terminal 1)
Open a terminal in `career-path_V1/server` and run:
```powershell
cd server
npm.cmd run dev
```
**Expected Output:**
```text
[INFO] 🚀 CareerPath Server running on http://localhost:5000 in development mode
[INFO] ✅ Connected to MongoDB Atlas database
```

### Step 2: Start the Frontend Client (Terminal 2)
Open a second terminal in the project root `career-path_V1` and run:
```powershell
npm.cmd run dev
```
**Expected Output:**
```text
  VITE v8.2.2  ready in 480 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Now open `http://localhost:5173` in your browser!

---

## 🔍 How to Test Every Feature in the UI

### 1. Test Career Sky & Drei 3D Celestial Clusters
1. Navigate to `/sky` (or click **Career Sky** in the navbar).
2. Orbit with mouse drag, zoom in/out with scroll.
3. Hover over and click any of the 23 glowing domain spheres.
4. Select a subdomain and choose a career (e.g. *Android Developer* or *Ethical Hacker*).
5. Click **"Explore Career Path"** ➔ verify career overview and salary data.
6. Click **"Start Learning Path"** ➔ navigates to `/roadmap` for that exact career.

### 2. Test 15-Step Dynamic Roadmap & Flowchart
1. On `/roadmap`, verify 15 learning steps organized across 4 color-coded phases.
2. Type in the search box `[ 🔍 Search roadmap topics... ]` (e.g. *Compose* or *Docker*) ➔ observe instant node highlighting.
3. Click **"View Roadmap Flow Diagram"** ➔ interactive 4-phase SVG diagram opens in a modal.
4. Click any node in the flowchart ➔ modal closes and smoothly scrolls directly to that learning step in the list!

### 3. Test 10+ Question Assessment Engine
1. Expand any roadmap node (e.g., *Kotlin Fundamentals*).
2. Click **"Assessment (10 Questions)"**.
3. Verify the timer starts, and question navigation buttons (Previous, Next, Question palette) work smoothly.
4. Select answers for all 10 questions and click **"Submit Test"**.
5. Verify the detailed report card with score, Pass/Fail status, and full question review with explanations.

### 4. Test In-Browser Code Challenge & GitHub Submissions
1. Click **"Code Challenge"** on any roadmap node.
2. Edit the starter code in the built-in code editor.
3. Click **"Run Test Cases"** ➔ verify simulated execution and passed assertions.
4. Enter your solution's GitHub repository URL (e.g., `https://github.com/your-username/my-solution`).
5. Add optional notes, select an attachment file, and click **"Submit Solution"**.
6. Verify the score and submission record are persisted in MongoDB.

### 5. Test Practical Milestone Project Submissions
1. Click **"Practical Task"** on any roadmap node.
2. Read the requirements and deliverables checklist.
3. Enter your project's GitHub URL and live deployment URL.
4. Add implementation notes and attach a project file.
5. Click **"Submit Project Milestone 🚀"**.
6. Verify status updates to **"Submitted to MongoDB"** with persistent timestamp and links.

### 6. Test Multi-Field Search on Resources & Projects
1. Navigate to `/resources` ➔ type `Docker`, `Python`, or `AWS` into `[ 🔍 Search resources... ]` ➔ check instant filtering and result count.
2. Navigate to `/projects` ➔ search by tech stack `React`, `Kotlin`, or `PyTorch` ➔ check difficulty filters (Starter, Intermediate, Advanced, Capstone).

### 7. Test Multi-User Isolation & Career Switching
1. Register **User 1** (`alice@test.com`) and choose *Android Developer*.
2. Complete 2 roadmap nodes and submit a milestone task.
3. Log out and register **User 2** (`bob@test.com`) and choose *Ethical Hacker*.
4. Verify User 2 starts with 0 completed nodes and loads the *Ethical Hacker* 15-step roadmap.
5. Log back in as User 1 ➔ verify Alice's 2 completed nodes and submissions are intact with 0 data leakage.
