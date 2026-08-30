# CareerPath V1 — Interactive Career Discovery & Learning Platform

CareerPath is a modern, full-stack career discovery and progression platform featuring an interactive 3D Career Sky, personalized match scoring, curated roadmaps, project tracking, skill gap analysis, and gamified achievement systems.

---

## 🏗️ Architecture & Technology Stack

### Backend
- **Runtime**: Node.js & TypeScript (ES2022 / NodeNext)
- **Framework**: Express.js
- **Database**: MongoDB (Production: MongoDB Atlas) with Mongoose ODM
- **Authentication**: Stateless JSON Web Tokens (JWT) with bcryptjs password hashing (cost factor 10)
- **Validation**: Zod schema validation for request bodies, parameters, and query strings
- **Security**: Helmet HTTP headers, CORS whitelisting, Express rate limiting, credential log masking
- **API Versioning**: `/api/v1` prefix

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **3D Universe**: Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios with Bearer token request interceptors & automatic error handling

---

## 📁 Repository Structure

```
career-path_V1/
├── server/                       # Backend REST API
│   ├── src/
│   │   ├── config/               # Env (Zod), Database (Mongoose), Logger
│   │   ├── constants/            # System achievements
│   │   ├── controllers/          # Request handlers
│   │   ├── middlewares/          # Auth, Error, Rate limiting, Validation
│   │   ├── models/               # Mongoose schemas (User, Career, Domain, Roadmap, Skill, Project, Resource)
│   │   ├── routes/               # Modular Express routers mounted at /api/v1
│   │   ├── scripts/              # Standalone DB seeding script
│   │   ├── services/             # Auth, Scoring, Progress, and Seeding services
│   │   ├── types/                # Express declaration merging
│   │   ├── validators/           # Zod request validation schemas
│   │   └── server.ts             # Express entry point with graceful shutdown
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── src/                          # Frontend Application
│   ├── components/               # Layout, 3D Sky, UI components
│   ├── context/                  # CareerContext, OnboardingContext, UIContext
│   ├── data/                     # Frontend data types & catalog models
│   ├── pages/                    # Auth, Onboarding, Sky, Details, Roadmap, Profile, etc.
│   ├── services/                 # Typed Axios API clients
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: A running local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection URI

### 2. Environment Configuration

#### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/career_path_v1?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=replace_with_a_secure_random_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
```

#### Frontend (`.env`)
Create `.env` in the root folder based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Installation

Install frontend and backend dependencies:

```bash
# Install root (frontend) dependencies
npm install

# Install server (backend) dependencies
npm --prefix server install
```

### 4. Database Seeding

Populate MongoDB with domains, careers, roadmaps, skills, projects, and resources:

```bash
npm run seed
```

### 5. Running the Application

In development mode:

```bash
# Terminal 1: Run Backend API (starts on http://localhost:5000)
npm run server

# Terminal 2: Run Frontend App (starts on http://localhost:5173)
npm run dev
```

---

## 📡 REST API Reference (`/api/v1`)

### Health Check
- `GET /api/v1/health` — System uptime and database connection status

### Authentication
- `POST /api/v1/auth/register` — Register a new account (`{ name, email, password }`)
- `POST /api/v1/auth/login` — Sign in and obtain JWT token (`{ email, password }`)
- `GET /api/v1/auth/me` — Get authenticated user details *(Protected)*

### User & Onboarding
- `GET /api/v1/users/profile` — Get full user profile with progress and stats *(Protected)*
- `PUT /api/v1/users/profile` — Update user profile details *(Protected)*
- `POST /api/v1/users/onboarding` — Save onboarding preferences *(Protected)*
- `POST /api/v1/users/onboarding/complete` — Mark onboarding as complete *(Protected)*
- `GET /api/v1/users/progress` — Get user progress summary *(Protected)*

### Career Domains & 3D Sky
- `GET /api/v1/domains` — Get all domains with 3D positions, atmosphere themes, and subdomains
- `GET /api/v1/domains/:id` — Get single domain by ID

### Careers & Comparisons
- `GET /api/v1/careers` — List careers (includes personalized match scores when authenticated)
- `GET /api/v1/careers/:id` — Get single career details
- `POST /api/v1/careers/select` — Select active career path *(Protected)*
- `POST /api/v1/careers/deselect` — Deselect active career path *(Protected)*
- `GET /api/v1/careers/compare` — Get compared careers *(Protected)*
- `POST /api/v1/careers/compare` — Add career to comparison list (max 3) *(Protected)*
- `DELETE /api/v1/careers/compare/:careerId` — Remove career from comparison *(Protected)*
- `DELETE /api/v1/careers/compare` — Clear comparison list *(Protected)*

### Roadmaps & Progress
- `GET /api/v1/roadmaps/user/current` — Get roadmap for active career with node status *(Protected)*
- `GET /api/v1/roadmaps/:careerId` — Get roadmap for specific career
- `POST /api/v1/roadmaps/nodes/:nodeId/complete` — Mark node completed & unlock achievements *(Protected)*

### Skills & Gap Analysis
- `GET /api/v1/skills` — Get all skill definitions
- `GET /api/v1/skills/gap/:careerId` — Compute skill gap analysis for a career *(Protected)*

### Projects & Resources
- `GET /api/v1/projects` — Get portfolio projects
- `POST /api/v1/projects/:projectId/status` — Update project status *(Protected)*
- `GET /api/v1/resources` — Get learning resources catalog
- `POST /api/v1/resources/:resourceId/complete` — Mark learning resource as completed *(Protected)*

### Achievements
- `GET /api/v1/achievements` — Get full achievements catalog and earned state

---

## 🔒 Security Best Practices

- **Password Hashing**: Stored with `bcryptjs` salt rounds 10. Passwords are never returned in queries (`select: false`).
- **Input Sanitization & Validation**: Strict Zod schemas validate request body, query parameters, and route params.
- **Rate Limiting**: Auth endpoints are rate-limited to prevent brute-force attacks (30 req / 15 min).
- **Log Masking**: Sensitive keys (passwords, tokens, credentials) are automatically scrubbed from server logs.
- **Environment Isolation**: No production credentials or secrets are committed to version control.

---

## 🛠️ Building for Production

```bash
# Build backend TypeScript
npm run server:build

# Build frontend bundle
npm run build

# Start production backend server
npm run server:start
```
