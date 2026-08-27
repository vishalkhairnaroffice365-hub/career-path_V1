# Phase 2 Technical Specification (Backend Preparation)

## Overview
This document outlines the architecture and database schema requirements for the Phase 2 backend implementation.
**Note**: This is a preparation document; no backend code is implemented yet.

## Architecture
- **Tech Stack**: Node.js / Express (or Next.js API routes), PostgreSQL or MongoDB (to be decided), Prisma ORM.
- **Authentication**: JWT-based auth or NextAuth.js.
- **API Style**: RESTful JSON APIs.

## Database Models (Proposed)

### 1. User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String
- `preferences`: JSON (Stores onboarding data)
- `stats`: JSON (Streak, readiness score, etc.)
- `createdAt`, `updatedAt`

### 2. Domain & Career
- Data currently mocked in `domains.ts` and `careers.ts` should be migrated to the database.
- `Domain` (id, name, description, theme, icon)
- `SubDomain` (id, domainId, name, description)
- `Career` (id, title, domainId, subDomainId, description, salary, growthRate, demandLevel)

### 3. User Progress (Roadmap & Skills)
- `UserCareerProgress` (userId, careerId, progressPercentage, currentStep)
- `UserSkills` (userId, skillId, proficiencyLevel)
- `CompletedProjects` (userId, projectId, url)

## API Endpoints (Draft)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Fetch user profile & stats
- `PUT /api/users/me` - Update preferences from onboarding
- `GET /api/domains` - Fetch all domains and subdomains
- `GET /api/careers/:id` - Fetch career details
- `GET /api/users/me/roadmap` - Fetch user's personalized roadmap
- `POST /api/users/me/progress` - Update user's progress on a node

## Integration Strategy
1. **Initialize Backend Repo/Folder**: Set up the Node/Express server or configure Next.js API routes.
2. **Database Setup**: Design the Prisma schema based on the proposed models and run initial migrations.
3. **Data Seeding**: Write scripts to migrate the mock data (`src/data/*`) to the database.
4. **API Development**: Implement the drafted endpoints.
5. **Frontend Integration**: Gradually replace static mock imports with React Query / SWR hooks fetching from the new API.
