# Phase 2 Final Technical Specification & Implementation Report

## Overview
Phase 2 (Production Backend Implementation & Full-Stack Integration) is **100% complete, tested, and verified** on branch `backend-implementation`. The application is connected to **MongoDB Atlas** via **Mongoose ODM** with a production Node.js + Express + TypeScript REST API.

---

## 🏗️ Architecture & Technology Stack

- **Runtime**: Node.js v22+ & TypeScript (ES2022 / NodeNext)
- **Framework**: Express.js with `/api/v1` versioning
- **Database**: MongoDB Atlas using Mongoose ODM
- **DNS Resolution**: Dual public DNS resolvers (`8.8.8.8`, `1.1.1.1`) configured in Node to ensure 100% reliable SRV record lookups across all ISP/router environments
- **Authentication**: Stateless JSON Web Tokens (JWT) + `bcryptjs` password hashing (salt rounds 10, `select: false` security)
- **Validation**: Strict Zod schemas on request bodies, query params, and path params
- **Security & Hardening**:
  - `helmet` security headers with cross-origin policies
  - CORS whitelisting
  - Express rate limiting on auth endpoints (30 req / 15 min)
  - `mongoSanitizeMiddleware` to strip NoSQL operator injection (`$gt`, `$ne`, `.` traversal)
  - `requestIdMiddleware` injecting `X-Request-Id` UUID for distributed request tracing
  - Sensitive key log scrubber (`password`, `token`, `secret`, `credentials` auto-redacted)
- **Frontend Integration**: Axios client with Bearer token interceptor, optimistic UI updates, and session hydration in `CareerContext` and `OnboardingContext`

---

## 🗄️ Database Schemas & Collections

### 1. `User` Collection (`server/src/models/User.model.ts`)
- `email`: String (Unique, Lowercase, Indexed)
- `password`: String (Bcrypt hashed, `select: false`)
- `name`: String (Trimmed)
- `avatar`: String (Default emoji avatar)
- `selectedCareerId`: String (Indexed)
- `onboardingCompleted`: Boolean
- `onboardingData`: Embedded subdocument with 7-step preferences (interests, skills, experience, strengths, workStyle, goals, vision)
- `progress`: Embedded subdocument (completedNodeIds, inProgressNodeIds, completedProjectIds, completedResourceIds, currentPhase, totalProgress, weeklyGoalHours, hoursThisWeek, streak, longestStreak, lastActiveDate)
- `stats`: Embedded subdocument (totalHoursLearned, skillsAcquired, projectsCompleted, resourcesConsumed, careerReadinessScore)
- `achievements`: Embedded array of 10 gamified badges with `isEarned` and `earnedAt`
- `comparedCareerIds`: Array of strings (up to 3 compared careers)

### 2. `Domain` Collection (`server/src/models/Domain.model.ts`)
- `id`: String (Slug, Unique, Indexed)
- `name`, `icon`, `description`, `tagline`, `careerCount`, `avgSalary`, `growthRate`
- `position`: `[number, number, number]` (Three.js 3D coordinates)
- `theme`: Primary/Secondary/Accent colors, gradient, cloudStyle, particleStyle, lightingStyle, atmosphere, objectType, fogColor, emissiveColor
- `subDomains`: Array of subdomains with 3D offset positions and career mappings

### 3. `Career` Collection (`server/src/models/Career.model.ts`)
- `id`: String (Unique, Indexed)
- `domainId`: String (Indexed)
- `subDomainId`: String (Indexed)
- `title`, `emoji`, `tagline`, `description`
- `salary`: `{ entry, mid, senior }`
- `growthRate`, `demandLevel`, `workStyle`, `timeToReady`
- `keySkills`, `dayInLife`, `pros`, `cons`, `companies`, `requiredSkillIds`, `roadmapId`
- **Compound Index**: `{ domainId: 1, subDomainId: 1 }`

### 4. `Roadmap` Collection (`server/src/models/Roadmap.model.ts`)
- `id`: String (Unique, Indexed)
- `careerId`: String (Unique, Indexed)
- `title`, `description`, `totalDuration`
- `phases`: Array of `{ id, name, description, color, duration }`
- `nodes`: Array of `{ id, title, description, type, duration, skillIds, resourceIds, projectIds, prerequisites, defaultStatus, position, phase }`

### 5. `Skill` Collection (`server/src/models/Skill.model.ts`)
- `id`: String (Unique, Indexed)
- `name`, `category` (language, framework, tool, concept, soft), `icon`, `description`, `difficulty`, `learningTime`, `prerequisites`, `resources`

### 6. `Project` Collection (`server/src/models/Project.model.ts`)
- `id`: String (Unique, Indexed)
- `title`, `description`, `longDescription`, `emoji`, `difficulty`, `estimatedTime`, `skillIds`, `careerIds`, `tags`, `objectives`, `techStack`, `status`, `githubUrl`, `liveUrl`, `isPortfolioWorthy`, `phase`
- **Compound Index**: `{ careerIds: 1, difficulty: 1 }`

### 7. `Resource` Collection (`server/src/models/Resource.model.ts`)
- `id`: String (Unique, Indexed)
- `title`, `description`, `type`, `level`, `url`, `provider`, `duration`, `isFree`, `price`, `rating`, `skillIds`, `careerIds`, `tags`, `emoji`
- **Compound Index**: `{ careerIds: 1, isFree: 1, level: 1 }`

### 8. `Achievement` Collection (`server/src/models/Achievement.model.ts`)
- `id`: String (Unique, Indexed)
- `title`, `description`, `emoji`, `category`

---

## 📡 REST API Implementation (`/api/v1`)

| Module | Route | Method | Access | Handler Action |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `/api/v1/health` | `GET` | Public | System uptime & live MongoDB connectivity status |
| **Auth** | `/api/v1/auth/register` | `POST` | Public (Rate Limited) | Bcrypt hash password, save user, issue JWT |
| **Auth** | `/api/v1/auth/login` | `POST` | Public (Rate Limited) | Compare bcrypt hash, issue JWT |
| **Auth** | `/api/v1/auth/me` | `GET` | Protected | Return authenticated user document |
| **Users** | `/api/v1/users/profile` | `GET` | Protected | Return user profile, progress & stats |
| **Users** | `/api/v1/users/profile` | `PUT` | Protected | Update name / avatar |
| **Users** | `/api/v1/users/onboarding` | `POST` | Protected | Save onboarding questionnaire preferences |
| **Users** | `/api/v1/users/onboarding/complete`| `POST` | Protected | Mark onboarding complete, calculate initial readiness |
| **Users** | `/api/v1/users/progress` | `GET` | Protected | Return progress summary |
| **Domains** | `/api/v1/domains` | `GET` | Public | Fetch all 8 domains with 3D themes & positions |
| **Domains** | `/api/v1/domains/:id` | `GET` | Public | Fetch single domain |
| **Careers** | `/api/v1/careers` | `GET` | Optional Auth | Fetch careers (calculates personalized match score if logged in) |
| **Careers** | `/api/v1/careers/:id` | `GET` | Optional Auth | Fetch single career details |
| **Careers** | `/api/v1/careers/select` | `POST` | Protected | Set active career, recalculate readiness, trigger achievements |
| **Careers** | `/api/v1/careers/deselect` | `POST` | Protected | Clear active career |
| **Careers** | `/api/v1/careers/compare` | `GET` | Protected | Fetch compared career objects |
| **Careers** | `/api/v1/careers/compare` | `POST` | Protected | Add career to compare (max 3) |
| **Careers** | `/api/v1/careers/compare/:id` | `DELETE` | Protected | Remove from compare list |
| **Roadmaps**| `/api/v1/roadmaps/user/current` | `GET` | Protected | Get active user roadmap with dynamic node statuses |
| **Roadmaps**| `/api/v1/roadmaps/:careerId` | `GET` | Optional Auth | Get roadmap for specific career |
| **Roadmaps**| `/api/v1/roadmaps/nodes/:nodeId/complete` | `POST` | Protected | Mark node complete, unlock prereqs, increment streak & hours |
| **Skills** | `/api/v1/skills` | `GET` | Public | List skill catalog |
| **Skills** | `/api/v1/skills/gap/:careerId` | `GET` | Protected | Calculate skill gap breakdown (acquired, learning, missing) |
| **Projects**| `/api/v1/projects` | `GET` | Optional Auth | List portfolio projects |
| **Projects**| `/api/v1/projects/:id/status` | `POST` | Protected | Update project status, recalculate readiness score |
| **Resources**| `/api/v1/resources` | `GET` | Optional Auth | List learning resources |
| **Resources**| `/api/v1/resources/:id/complete` | `POST` | Protected | Mark resource completed |
| **Achievements**| `/api/v1/achievements` | `GET` | Optional Auth | List master achievements and user earned states |

---

## ⚙️ Core Business Logic Engines

1. **Personalized Match Scoring (`ScoringService.calculateCareerMatchScore`)**:
   - Evaluates user onboarding skill overlap (weight: 25%), interest alignment (weight: 15%), and work environment preference (weight: 10%) against career parameters to produce a dynamic 0–100 match score.
2. **Career Readiness Engine (`ScoringService.calculateCareerReadinessScore`)**:
   - Weighted multi-factor formula: Roadmap Nodes completed (40%) + Portfolio Projects completed (30%) + Learning Resources completed (15%) + Streak Consistency (15%).
3. **Automated Achievement System (`ProgressService.checkAchievements`)**:
   - Unlocks system badges automatically on trigger events: *First Step* (first node), *Decided* (career selected), *Week Warrior* (7-day streak), *Month Streak* (30-day streak), *Builder* (first project), *Portfolio Ready* (3 projects), and *Curious Mind* (5 resources).
4. **Idempotent Seeding Engine (`seed.service.ts`)**:
   - Uses MongoDB `bulkWrite` with `upsert: true` to insert/update catalog records without duplicates or data loss.

---

## 🧪 Verification & Automated Testing

- **Backend TypeScript Compilation**: Passes with 0 errors (`npm --prefix server run build`).
- **Frontend TypeScript & Vite Build**: Passes with 0 errors (`npm run build`).
- **Automated API Test Suite**: Executes 15 end-to-end integration tests (`npm run test:api`).
- **CI/CD Pipeline**: GitHub Actions workflow configured in `.github/workflows/ci.yml`.
- **Docker Multi-Stage Setup**: `server/Dockerfile`, `Dockerfile`, and `docker-compose.yml`.
