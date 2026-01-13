# Technical Evaluation & Roadmap
## Personal Fitness Intelligence App

**Document Purpose**: Technical second opinion, stack definition, and detailed implementation roadmap for AI-assisted development.

---

## Executive Summary

This document provides a technical evaluation of the Personal Fitness Intelligence App project, defines a concrete tech stack, and outlines a detailed technical roadmap. The evaluation considers mobile-first PWA requirements, self-hosting constraints, data ownership, and long-term maintainability.

**Key Recommendations**:
- **Next.js 14+ (App Router)** for full-stack framework
- **PostgreSQL** with **Prisma ORM** for type-safe database access
- **React Server Components** for optimal performance
- **PWA-first** architecture with offline support
- **Docker Compose** for local development and deployment
- **TypeScript** throughout for type safety

---

## 1. Project Review & Technical Assessment

### 1.1 Strengths of Current Plan

✅ **Clear scope boundaries** - Single user, no social features, focused MVP
✅ **Mobile-first approach** - Correct for daily-use fitness app
✅ **PWA strategy** - Smart choice for iPhone "app-like" experience
✅ **Self-hosted** - Aligns with data ownership goals
✅ **Deterministic recommendations** - No AI dependency for v1 reduces complexity
✅ **Muscle-level tracking** - Unique differentiator

### 1.2 Technical Concerns & Recommendations

#### Concern 1: Next.js API Routes vs. Separate Backend
**Current Plan**: Next.js API routes (or FastAPI later)

**Recommendation**: **Stick with Next.js API routes for v1**
- Single codebase reduces deployment complexity
- Server Components + API routes = excellent DX
- Can extract to FastAPI later if needed (unlikely for single-user app)
- **Decision**: Next.js API routes only

#### Concern 2: Database Schema Design
**Current Plan**: Basic table list provided

**Recommendation**: 
- Use **Prisma ORM** for schema management and migrations
- Design for time-series queries (workout history, trends)
- Add indexes on date fields and foreign keys
- Consider JSONB columns for flexible metadata (soreness map, etc.)

#### Concern 3: PWA Offline Support
**Current Plan**: PWA mentioned but not detailed

**Recommendation**: 
- **Service Worker** for offline workout logging
- **IndexedDB** for local storage during offline periods
- **Background sync** for uploading when connection restored
- Critical for gym environments with poor connectivity

#### Concern 4: Authentication Strategy
**Current Plan**: "Simple auth (single user)"

**Recommendation**: 
- **Session-based auth** with secure HTTP-only cookies
- Use Next.js built-in session management
- For self-hosted: Consider basic auth or simple JWT
- **No OAuth needed** for single-user app

#### Concern 5: Analytics Computation
**Current Plan**: "Computed weekly"

**Recommendation**: 
- **Incremental computation** via database triggers or background jobs
- Cache results in materialized views or Redis
- Real-time updates for "Today" view, batch for historical
- Use **PostgreSQL window functions** for efficient trend calculations

---

## 2. Defined Tech Stack

### 2.1 Frontend Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Framework** | Next.js | 14+ (App Router) | Full-stack, SSR, excellent PWA support |
| **Language** | TypeScript | 5+ | Type safety, better DX |
| **UI Library** | React | 18+ | Core framework (via Next.js) |
| **Styling** | Tailwind CSS | 3+ | Mobile-first, rapid UI development |
| **UI Components** | shadcn/ui or Radix UI | Latest | Accessible, customizable components |
| **State Management** | React Server Components + Zustand | Latest | Server-first, minimal client state |
| **Forms** | React Hook Form + Zod | Latest | Type-safe form validation |
| **SVG Graphics** | React + SVG | Native | Muscle visualization |
| **PWA** | next-pwa | Latest | Service worker, offline support |
| **Icons** | Lucide React | Latest | Lightweight, consistent icon set |

### 2.2 Backend Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **API Framework** | Next.js API Routes | 14+ | Integrated with frontend |
| **Database** | PostgreSQL | 15+ | Robust, excellent for analytics |
| **ORM** | Prisma | 5+ | Type-safe, migrations, excellent DX |
| **Validation** | Zod | Latest | Schema validation, type inference |
| **Auth** | NextAuth.js (optional) or custom | Latest | Simple session management |
| **Background Jobs** | BullMQ + Redis (optional) | Latest | For analytics computation (Phase 3+) |
| **Caching** | Redis (optional) | Latest | For analytics cache (Phase 3+) |

### 2.3 DevOps & Infrastructure

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Containerization** | Docker + Docker Compose | Latest | Consistent dev/prod environments |
| **Reverse Proxy** | Nginx or Caddy | Latest | HTTPS, SSL termination |
| **SSL Certificates** | Let's Encrypt (via Caddy) | Latest | Free, automatic HTTPS |
| **Database Migrations** | Prisma Migrate | Latest | Version-controlled schema |
| **Environment Config** | dotenv + .env files | Latest | Secure config management |

### 2.4 Development Tools

| Component | Technology | Rationale |
|-----------|-----------|----------|
| **Package Manager** | pnpm or npm | Fast, reliable |
| **Linting** | ESLint + Prettier | Code quality |
| **Type Checking** | TypeScript | Compile-time safety |
| **Testing** | Vitest + React Testing Library | Fast unit/integration tests |
| **E2E Testing** | Playwright (optional) | Mobile testing |

### 2.5 Stack Decision Rationale

**Why Next.js App Router?**
- Server Components reduce client bundle size
- Built-in API routes eliminate separate backend
- Excellent PWA support via next-pwa
- Optimized for mobile performance

**Why Prisma?**
- Type-safe database access
- Auto-generated TypeScript types
- Migration system built-in
- Excellent developer experience

**Why PostgreSQL?**
- Robust for time-series data (workout history)
- Excellent JSONB support (flexible soreness/pain data)
- Window functions for analytics
- Proven reliability

**Why Tailwind CSS?**
- Mobile-first utility classes
- Rapid UI development
- Small bundle size with purging
- Excellent responsive design support

---

## 3. Detailed Technical Architecture

### 3.1 Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Browser (iPhone)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   PWA Shell  │  │ Service Worker│  │  IndexedDB   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │ HTTPS
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Nginx/Caddy (Reverse Proxy)                │
│              SSL Termination, Static Files              │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Next.js Application                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │           React Server Components                 │  │
│  │  (Check-in UI, Plan Display, Analytics Views)    │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Client Components                      │  │
│  │  (Interactive Forms, Muscle Map, Workout Timer)  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │           API Routes (Next.js)                   │  │
│  │  /api/checkins, /api/workouts, /api/analytics    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Prisma ORM (Type-Safe DB Access)            │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Tables  │  │  Indexes │  │  Views   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema Design

#### Core Tables (Prisma Schema)

```prisma
// User (single user for v1)
model User {
  id            String   @id @default(cuid())
  email         String?  @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  checkins      DailyCheckin[]
  workouts      Workout[]
  ptLogs        PTLog[]
  nutrition     NutritionEntry[]
}

// Exercises catalog
model Exercise {
  id            String   @id @default(cuid())
  name          String
  category      String   // "push", "pull", "legs", "cardio", "pt"
  equipment     String?  // "barbell", "dumbbell", "bodyweight", etc.
  instructions  String?
  createdAt     DateTime @default(now())
  
  muscleTargets ExerciseMuscleMap[]
  workoutSets   WorkoutSet[]
}

// Muscle groups
model Muscle {
  id            String   @id @default(cuid())
  name          String   @unique
  group         String   // "chest", "back", "legs", etc.
  side          String?  // "left", "right", null for bilateral
  
  exerciseMaps  ExerciseMuscleMap[]
}

// Exercise-to-muscle mapping with weights
model ExerciseMuscleMap {
  id            String   @id @default(cuid())
  exerciseId    String
  muscleId      String
  weight        Float    @default(1.0) // 0.0-1.0, how much this exercise targets muscle
  
  exercise      Exercise @relation(fields: [exerciseId], references: [id])
  muscle        Muscle   @relation(fields: [muscleId], references: [id])
  
  @@unique([exerciseId, muscleId])
  @@index([muscleId])
}

// Daily check-ins
model DailyCheckin {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime @default(now()) @db.Date
  hoursSlept    Float?
  sleepQuality  Int?     // 1-5
  energyLevel   String?  // "low", "normal", "high"
  sorenessMap   Json?    // { "chest": 2, "quads": 3, ... }
  acutePain     Boolean  @default(false)
  painNote      String?
  timeAvailable String?  // "short", "normal", "long"
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, date])
  @@index([userId, date])
}

// Workouts
model Workout {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime @default(now()) @db.Date
  type          String?  // "push", "pull", "legs", "pt", "rest"
  duration      Int?     // minutes
  notes         String?
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  sets          WorkoutSet[]
  
  @@index([userId, date])
}

// Individual sets within a workout
model WorkoutSet {
  id            String   @id @default(cuid())
  workoutId     String
  exerciseId    String
  setNumber     Int
  weight        Float?
  reps          Int?
  effort        String?  // "easy", "normal", "hard"
  restSeconds   Int?
  notes         String?
  createdAt     DateTime @default(now())
  
  workout       Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  exercise      Exercise @relation(fields: [exerciseId], references: [id])
  
  @@index([workoutId])
  @@index([exerciseId])
}

// Physical therapy exercises
model PTExercise {
  id            String   @id @default(cuid())
  name          String
  instructions  String?
  required      Boolean  @default(false) // Always required vs. optional
  createdAt     DateTime @default(now())
  
  logs          PTLog[]
}

// PT exercise logs
model PTLog {
  id            String   @id @default(cuid())
  userId        String
  ptExerciseId  String
  date          DateTime @default(now()) @db.Date
  completed     Boolean  @default(true)
  notes         String?
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  ptExercise    PTExercise @relation(fields: [ptExerciseId], references: [id])
  
  @@index([userId, date])
}

// Basic nutrition tracking
model NutritionEntry {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime @default(now()) @db.Date
  mealType      String?  // "breakfast", "lunch", "dinner", "snack"
  description   String
  calories      Int?
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  
  @@index([userId, date])
}
```

#### Indexes & Performance

- **Time-series queries**: Index all `date` fields
- **User lookups**: Composite indexes on `(userId, date)`
- **Analytics**: Consider materialized views for weekly summaries
- **Muscle stimulus**: Index `ExerciseMuscleMap.muscleId` for fast lookups

### 3.3 API Route Structure

```
/api
  /auth
    POST   /login
    POST   /logout
    GET    /session
  /checkins
    GET    /                    # Get check-ins (with date range)
    POST   /                    # Create check-in
    GET    /today               # Get today's check-in
    PUT    /:id                 # Update check-in
  /workouts
    GET    /                    # Get workouts (with filters)
    POST   /                    # Create workout
    GET    /today               # Get today's workout/plan
    GET    /:id                 # Get workout details
    PUT    /:id                 # Update workout
    DELETE /:id                 # Delete workout
  /workouts/:id/sets
    GET    /                    # Get sets for workout
    POST   /                    # Add set
    PUT    /:setId              # Update set
    DELETE /:setId              # Delete set
  /exercises
    GET    /                    # Get exercise catalog
    POST   /                    # Create custom exercise
    GET    /:id                 # Get exercise details
  /analytics
    GET    /muscle-stimulus     # Get muscle stimulus scores
    GET    /training-frequency  # Get training frequency per muscle
    GET    /neglected-muscles   # Get neglected muscles
    GET    /trends              # Get volume/intensity trends
  /recommendations
    GET    /today               # Get today's workout recommendation
    POST   /regenerate          # Regenerate recommendation
  /pt
    GET    /exercises           # Get PT exercises
    GET    /logs                # Get PT logs
    POST   /logs                # Log PT exercise
```

### 3.4 Component Architecture

```
app/
  (routes)
    /                          # Home/redirect
    /checkin                  # Morning check-in (Server Component)
    /plan                     # Today's plan (Server Component)
    /workout                  # Active workout (Client Component)
    /workout/[id]             # Workout history detail
    /analytics                # Analytics dashboard (optional)
    /settings                 # Settings page
    
  components/
    ui/                       # shadcn/ui components
    checkin/
      CheckinForm.tsx         # Client component
      SorenessMap.tsx         # Interactive SVG body map
    workout/
      WorkoutTimer.tsx        # Client component
      SetLogger.tsx           # Fast set logging
      ExerciseSelector.tsx    # Exercise picker
    analytics/
      MuscleVisualization.tsx # SVG muscle diagram
      StimulusChart.tsx       # Charts/graphs
    layout/
      NavBar.tsx              # Bottom nav for mobile
      Header.tsx              # Top header
    
  lib/
    db/                       # Prisma client
    analytics/                # Analytics computation functions
    recommendations/          # Recommendation engine
    utils/                    # Utilities
    
  api/                        # API routes (see structure above)
```

---

## 4. Detailed Technical Roadmap

### Phase 0: Project Setup & Infrastructure (Days 1-2)

#### Day 1: Repository & Development Environment

**Tasks**:
1. Initialize Next.js 14+ project with TypeScript
   ```bash
   npx create-next-app@latest fitness-app --typescript --tailwind --app
   ```
2. Set up project structure
   - Create folder structure (app/, components/, lib/, etc.)
   - Configure ESLint + Prettier
   - Set up Git repository
3. Install core dependencies
   ```bash
   pnpm add prisma @prisma/client zod react-hook-form @hookform/resolvers
   pnpm add -D @types/node
   ```
4. Configure Tailwind CSS for mobile-first
   - Custom breakpoints if needed
   - Mobile-first utility classes
5. Set up environment variables
   - `.env.local` for local development
   - `.env.example` template
   - Database connection string

**Deliverables**:
- ✅ Next.js project running locally
- ✅ TypeScript configured
- ✅ Tailwind CSS working
- ✅ Project structure established

#### Day 2: Database Setup & Docker

**Tasks**:
1. Set up Docker Compose
   ```yaml
   # docker-compose.yml
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_USER: fitness
         POSTGRES_PASSWORD: [secure]
         POSTGRES_DB: fitness_db
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
     redis:  # Optional for Phase 3
       image: redis:7
       ports:
         - "6379:6379"
   ```
2. Initialize Prisma
   ```bash
   npx prisma init
   ```
3. Design and implement database schema
   - Create `schema.prisma` with all models
   - Define relationships and indexes
4. Create initial migration
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed database with initial data
   - Create `prisma/seed.ts`
   - Seed exercises catalog (bench press, squat, etc.)
   - Seed muscle groups
   - Seed exercise-muscle mappings
6. Generate Prisma Client
   ```bash
   npx prisma generate
   ```

**Deliverables**:
- ✅ Docker Compose running PostgreSQL
- ✅ Prisma schema defined
- ✅ Database migrations working
- ✅ Seed data loaded

---

### Phase 1: Foundation & Core Data (Days 3-7)

#### Day 3: Authentication & User Setup

**Tasks**:
1. Implement simple session-based auth
   - Create `/api/auth/login` route
   - Create `/api/auth/session` route
   - Use HTTP-only cookies for sessions
2. Create user setup flow (first-time use)
   - Simple form: name, email (optional)
   - Create user record
3. Protect API routes with auth middleware
   - Create `lib/auth.ts` utility
   - Add auth check to API routes
4. Create basic layout components
   - Mobile-first layout wrapper
   - Bottom navigation (for later)

**Deliverables**:
- ✅ User can "log in" (single user)
- ✅ Session management working
- ✅ Protected API routes

#### Day 4: Exercise & Muscle Data Management

**Tasks**:
1. Create exercise catalog API
   - `GET /api/exercises` - List all exercises
   - `GET /api/exercises/:id` - Get exercise details
   - `POST /api/exercises` - Create custom exercise
2. Create exercise management UI (admin/internal)
   - List exercises
   - Add custom exercise
   - Map exercises to muscles
3. Create muscle group utilities
   - Muscle list constants
   - Muscle group categorization
4. Test exercise-muscle mappings
   - Verify data integrity
   - Test queries for muscle stimulus calculation

**Deliverables**:
- ✅ Exercise catalog accessible via API
- ✅ Can create custom exercises
- ✅ Exercise-muscle mappings working

#### Day 5: Daily Check-In Backend

**Tasks**:
1. Create check-in API routes
   - `POST /api/checkins` - Create check-in
   - `GET /api/checkins/today` - Get today's check-in
   - `PUT /api/checkins/:id` - Update check-in
   - `GET /api/checkins` - List check-ins (with date range)
2. Implement check-in validation
   - Zod schema for check-in data
   - Validate sleep quality (1-5)
   - Validate energy level enum
   - Validate soreness map structure
3. Create check-in service layer
   - `lib/services/checkin.ts`
   - Business logic for check-ins
4. Write API route tests (optional but recommended)

**Deliverables**:
- ✅ Check-in API fully functional
- ✅ Data validation working
- ✅ Can create/read/update check-ins

#### Day 6: Daily Check-In UI (Morning Screen)

**Tasks**:
1. Create check-in form component
   - Hours slept input (number)
   - Sleep quality slider (1-5)
   - Energy level buttons (low/normal/high)
   - Time available selector
2. Create interactive soreness map
   - SVG human body (front/back views)
   - Clickable muscle groups
   - Visual feedback for selected areas
   - Intensity selector (0-5) per muscle
3. Create acute pain section
   - Toggle for acute pain
   - Optional text note
4. Create check-in page (`/checkin`)
   - Server Component for data fetching
   - Client Component for form
   - Form submission handling
   - Redirect to `/plan` after submission
5. Add form validation
   - Client-side with React Hook Form
   - Server-side with Zod

**Deliverables**:
- ✅ Beautiful, mobile-optimized check-in form
- ✅ Interactive soreness body map
- ✅ Form submission working
- ✅ Redirects to plan page

#### Day 7: Basic Recommendation Engine

**Tasks**:
1. Create recommendation service
   - `lib/services/recommendations.ts`
   - Deterministic rule-based logic
2. Implement basic split logic
   - Push/Pull/Legs rotation
   - Track last workout type
   - Handle missed days
3. Implement recovery logic
   - Check soreness levels
   - Check energy levels
   - Suggest rest or PT if needed
4. Create recommendation API
   - `GET /api/recommendations/today`
   - Returns: day type, exercises, sets, reps
5. Test recommendation logic
   - Various scenarios (high soreness, low energy, etc.)

**Deliverables**:
- ✅ Recommendation engine working
- ✅ Basic split logic implemented
- ✅ Recovery-aware recommendations

---

### Phase 2: Workout Logging & Daily Plan (Days 8-14)

#### Day 8: Today's Plan UI

**Tasks**:
1. Create plan display page (`/plan`)
   - Server Component fetches recommendation
   - Display day type (Push/Pull/Legs/PT/Rest)
   - Display recommended exercises
   - Show sets, reps, target weights
2. Create plan action buttons
   - "Start Workout" button
   - "Modify Intensity" button
   - "Swap Exercise" button
   - "Skip Day" button
3. Implement plan modification
   - Intensity adjustment (easy/normal/hard)
   - Exercise swapping interface
4. Add plan persistence
   - Save plan to database when generated
   - Load existing plan if already generated today

**Deliverables**:
- ✅ Plan page displays recommendations
- ✅ Can modify plan before starting
- ✅ Plan persists for the day

#### Day 9: Workout Creation & Management API

**Tasks**:
1. Create workout API routes
   - `POST /api/workouts` - Create workout
   - `GET /api/workouts/today` - Get today's workout
   - `GET /api/workouts/:id` - Get workout details
   - `PUT /api/workouts/:id` - Update workout
2. Create workout set API routes
   - `POST /api/workouts/:id/sets` - Add set
   - `PUT /api/workouts/:id/sets/:setId` - Update set
   - `DELETE /api/workouts/:id/sets/:setId` - Delete set
3. Implement workout service layer
   - `lib/services/workout.ts`
   - Business logic for workouts
4. Add workout validation
   - Zod schemas for workout data

**Deliverables**:
- ✅ Workout API fully functional
- ✅ Can create workouts and sets
- ✅ Data validation working

#### Day 10: Active Workout UI

**Tasks**:
1. Create workout page (`/workout`)
   - Display workout exercises
   - Show planned sets/reps
   - Active workout state management
2. Create set logging component
   - Fast input for weight
   - Fast input for reps
   - Effort selector (easy/normal/hard)
   - Quick "Next Set" button
3. Implement workout timer
   - Rest timer between sets
   - Visual countdown
   - Sound/vibration on completion (optional)
4. Add exercise completion tracking
   - Mark exercises as complete
   - Show progress through workout
5. Optimize for speed
   - Large touch targets
   - Minimal typing
   - Quick actions

**Deliverables**:
- ✅ Fast, mobile-optimized workout logging
   - ✅ Rest timer working
   - ✅ Sets can be logged quickly

#### Day 11: Workout History & Details

**Tasks**:
1. Create workout history page
   - List past workouts
   - Filter by date range
   - Filter by workout type
2. Create workout detail page (`/workout/[id]`)
   - Display all sets
   - Show exercise details
   - Display notes
3. Add workout editing
   - Edit sets after workout
   - Add notes
   - Delete sets
4. Add workout statistics
   - Total volume
   - Duration
   - Exercises completed

**Deliverables**:
- ✅ Can view workout history
- ✅ Can view/edit workout details
- ✅ Basic statistics displayed

#### Day 12: PT Exercise Logging

**Tasks**:
1. Create PT exercise API
   - `GET /api/pt/exercises` - List PT exercises
   - `POST /api/pt/logs` - Log PT exercise
   - `GET /api/pt/logs` - Get PT logs
2. Create PT logging UI
   - List required PT exercises
   - Quick "Complete" buttons
   - Optional notes
3. Integrate PT into daily plan
   - Show required PT exercises in plan
   - Mark as complete during workout
4. Add PT exercise management (admin)
   - Create/edit PT exercises
   - Mark as required/optional

**Deliverables**:
- ✅ PT exercise logging working
- ✅ PT integrated into daily flow

#### Day 13: PWA Setup & Offline Support

**Tasks**:
1. Install and configure next-pwa
   ```bash
   pnpm add next-pwa
   ```
2. Configure service worker
   - Cache static assets
   - Cache API responses (strategically)
   - Offline fallback page
3. Set up IndexedDB for offline storage
   - Store workout data locally
   - Queue API requests when offline
4. Implement background sync
   - Sync workout data when online
   - Handle conflicts
5. Add PWA manifest
   - App name, icons, theme colors
   - Display mode: "standalone"
   - Start URL
6. Test offline functionality
   - Log workout offline
   - Verify sync when online

**Deliverables**:
- ✅ PWA installable on iPhone
- ✅ Offline workout logging works
- ✅ Data syncs when online

#### Day 14: Basic Nutrition Logging

**Tasks**:
1. Create nutrition API
   - `POST /api/nutrition` - Log meal
   - `GET /api/nutrition` - Get nutrition entries
2. Create simple nutrition logging UI
   - Quick meal entry form
   - Preset meals (optional)
   - Free-text description
   - Optional calories
3. Add nutrition to evening check-in (optional)
   - Quick meal log
   - Cardio/steps entry
4. Display nutrition in daily view

**Deliverables**:
- ✅ Basic nutrition logging working
- ✅ Integrated into daily flow

---

### Phase 3: Analytics & Visualization (Days 15-21)

#### Day 15: Muscle Stimulus Calculation Engine

**Tasks**:
1. Create analytics service
   - `lib/services/analytics.ts`
2. Implement muscle stimulus calculation
   - Formula: `sets × reps × load × muscle_weight`
   - Aggregate by time period (day, week, month)
   - Handle missing data gracefully
3. Create muscle stimulus API
   - `GET /api/analytics/muscle-stimulus`
   - Parameters: date range, muscle filter
4. Optimize calculations
   - Use database aggregations (SQL)
   - Cache results for common queries
   - Consider materialized views for weekly summaries
5. Test calculation accuracy
   - Verify with sample data
   - Edge cases (missing weights, etc.)

**Deliverables**:
- ✅ Muscle stimulus scores calculated correctly
- ✅ API returns accurate data
- ✅ Performance optimized

#### Day 16: Training Frequency & Neglect Detection

**Tasks**:
1. Implement training frequency calculation
   - Days since last trained per muscle
   - Training frequency over time windows
2. Implement neglect detection
   - Identify muscles not trained in X days
   - Calculate "neglect score"
3. Create neglect API
   - `GET /api/analytics/neglected-muscles`
   - Returns: muscles, days since last trained, priority
4. Integrate into recommendations
   - Prioritize neglected muscles
   - Adjust split based on neglect

**Deliverables**:
- ✅ Training frequency calculated
- ✅ Neglect detection working
- ✅ Influences recommendations

#### Day 17: Volume & Intensity Trends

**Tasks**:
1. Implement volume trend calculation
   - Weekly volume per muscle
   - Volume over time (line chart data)
2. Implement intensity trend calculation
   - Average weight used
   - Intensity over time
3. Create trends API
   - `GET /api/analytics/trends`
   - Parameters: muscle, time period
4. Add trend visualization data
   - Format data for charting libraries

**Deliverables**:
- ✅ Volume trends calculated
- ✅ Intensity trends calculated
- ✅ API returns chart-ready data

#### Day 18: Muscle Visualization Component

**Tasks**:
1. Create SVG human body component
   - Front view SVG
   - Back view SVG
   - Toggle between views
2. Map muscle groups to SVG paths
   - Each muscle is a separate path
   - Proper coordinates for front/back
3. Implement color intensity mapping
   - Map stimulus score to color
   - Gradient from low to high
   - Clear visual distinction
4. Add interactivity
   - Hover to show muscle name
   - Click to filter/view details
   - Touch-friendly on mobile
5. Create visualization views
   - "Today" view
   - "Last 7 days" view
   - "Push/Pull/Legs" filter
   - "Neglected muscles" highlight

**Deliverables**:
- ✅ Beautiful muscle visualization
- ✅ Interactive and touch-friendly
- ✅ Multiple view modes working

#### Day 19: Analytics Dashboard

**Tasks**:
1. Create analytics page (`/analytics`)
   - Server Component for data fetching
   - Display muscle visualization
   - Show key metrics
2. Add analytics widgets
   - Weekly volume summary
   - Most trained muscles
   - Neglected muscles alert
   - Training frequency chart
3. Add date range selector
   - Filter analytics by date
   - Quick presets (7 days, 30 days, etc.)
4. Make analytics optional/hidden
   - Collapsible sections
   - "Deep dive" button
   - Don't overwhelm daily users

**Deliverables**:
- ✅ Analytics dashboard functional
- ✅ Key metrics displayed
- ✅ User-friendly and optional

#### Day 20: Weekly Summaries

**Tasks**:
1. Create weekly summary calculation
   - Aggregate weekly data
   - Compute key metrics
   - Store in database (optional caching)
2. Create weekly summary API
   - `GET /api/analytics/weekly-summary`
   - Parameters: week start date
3. Create weekly summary UI
   - Display week overview
   - Highlight achievements
   - Show trends
4. Add weekly summary to dashboard
   - "This Week" section
   - Comparison to previous week

**Deliverables**:
- ✅ Weekly summaries calculated
- ✅ Displayed in dashboard
- ✅ Useful insights provided

#### Day 21: Recommendation Engine Enhancement

**Tasks**:
1. Enhance recommendation logic with analytics
   - Use muscle stimulus data
   - Use neglect detection
   - Use training frequency
2. Implement volume adjustment
   - Reduce volume if high fatigue
   - Increase volume if well-recovered
3. Add recommendation explanations
   - "Why this workout?" section
   - Show reasoning (e.g., "Chest hasn't been trained in 5 days")
4. Test recommendation quality
   - Various scenarios
   - Verify logic makes sense

**Deliverables**:
- ✅ Recommendations use analytics
- ✅ Explanations provided
- ✅ Recommendations feel intelligent

---

### Phase 4: Polish & Optimization (Days 22-28)

#### Day 22: UI/UX Refinement

**Tasks**:
1. Review and improve mobile UX
   - Touch target sizes (min 44x44px)
   - Spacing and padding
   - Typography (readable on mobile)
2. Add loading states
   - Skeleton loaders
   - Optimistic UI updates
3. Add error handling
   - User-friendly error messages
   - Retry mechanisms
4. Improve form UX
   - Better input types (number pads on mobile)
   - Auto-focus next field
   - Smart defaults

**Deliverables**:
- ✅ Polished, mobile-optimized UI
- ✅ Smooth user experience
- ✅ Error handling in place

#### Day 23: Performance Optimization

**Tasks**:
1. Optimize database queries
   - Add missing indexes
   - Use database aggregations
   - Reduce N+1 queries
2. Optimize API routes
   - Cache frequently accessed data
   - Batch requests where possible
3. Optimize frontend
   - Code splitting
   - Lazy load analytics components
   - Optimize images/SVG
4. Test performance
   - Lighthouse scores
   - Mobile performance
   - API response times

**Deliverables**:
- ✅ Fast page loads
- ✅ Quick API responses
- ✅ Good Lighthouse scores

#### Day 24: Saved Meals & Presets

**Tasks**:
1. Create saved meals feature
   - Save frequently logged meals
   - Quick selection from saved meals
2. Create exercise presets
   - Save common workout templates
   - Quick workout creation from template
3. Add preset management UI
   - Create/edit/delete presets
   - Organize presets

**Deliverables**:
- ✅ Saved meals working
- ✅ Exercise presets working
- ✅ Faster daily logging

#### Day 25: Data Export & Backup

**Tasks**:
1. Implement data export
   - Export all data as JSON
   - Export workouts as CSV
   - User-accessible export
2. Implement data backup
   - Automatic daily backups (optional)
   - Manual backup trigger
   - Backup storage location
3. Add data import (optional)
   - Import from export file
   - Validate imported data

**Deliverables**:
- ✅ Users can export their data
- ✅ Backup system in place
- ✅ Data ownership maintained

#### Day 26: Settings & Configuration

**Tasks**:
1. Create settings page
   - User preferences
   - Split schedule configuration
   - Notification settings (if added)
2. Add split customization
   - Choose split type (PPL, Upper/Lower, etc.)
   - Set training days
   - Set rest days
3. Add unit preferences
   - Weight units (lbs/kg)
   - Distance units (miles/km)
4. Persist settings
   - Save to database
   - Apply to recommendations

**Deliverables**:
- ✅ Settings page functional
- ✅ Split customization working
- ✅ Preferences persisted

#### Day 27: Testing & Bug Fixes

**Tasks**:
1. Write critical path tests
   - Check-in flow
   - Workout logging flow
   - Recommendation generation
2. Test on iPhone
   - Install as PWA
   - Test all flows
   - Verify offline functionality
3. Fix discovered bugs
   - Prioritize critical bugs
   - Fix UX issues
4. Test edge cases
   - Missing data
   - Invalid inputs
   - Network failures

**Deliverables**:
- ✅ Critical paths tested
- ✅ Works on iPhone
- ✅ Bugs fixed

#### Day 28: Deployment Preparation

**Tasks**:
1. Set up production environment
   - Production database
   - Environment variables
   - SSL certificates
2. Configure reverse proxy (Nginx/Caddy)
   - HTTPS setup
   - Static file serving
   - API proxying
3. Create deployment scripts
   - Docker Compose for production
   - Database migration script
   - Backup script
4. Document deployment process
   - README with setup instructions
   - Environment variable guide
   - Troubleshooting guide
5. Final testing in production-like environment
   - Test all features
   - Verify performance
   - Check security

**Deliverables**:
- ✅ Production environment ready
- ✅ Deployment documented
- ✅ App ready for self-hosting

---

## 5. Implementation Priorities & Dependencies

### Critical Path (Must Have for MVP)

1. **Database Schema** → All features depend on this
2. **Authentication** → Required for all user actions
3. **Check-In Flow** → Core daily interaction
4. **Recommendation Engine** → Core value proposition
5. **Workout Logging** → Core daily interaction
6. **Basic Analytics** → Core value proposition

### Nice to Have (Can Defer)

- Advanced analytics visualizations
- Nutrition logging (can be basic)
- PT exercise logging (can be simplified)
- Weekly summaries
- Data export (important but not blocking)

### Dependencies Graph

```
Database Schema
    ↓
Authentication
    ↓
Check-In API → Check-In UI
    ↓
Recommendation Engine
    ↓
Workout API → Workout UI
    ↓
Analytics Engine → Analytics UI
```

---

## 6. Technical Decisions & Rationale

### Decision 1: Next.js App Router vs. Pages Router
**Choice**: App Router
**Rationale**: 
- Server Components reduce client bundle
- Better performance for mobile
- Modern React patterns
- Better PWA support

### Decision 2: Prisma vs. Raw SQL
**Choice**: Prisma
**Rationale**:
- Type safety
- Excellent DX
- Migration system
- Single-user app doesn't need raw SQL performance

### Decision 3: Session Auth vs. JWT
**Choice**: Session-based (HTTP-only cookies)
**Rationale**:
- More secure (XSS protection)
- Simpler for single-user app
- Next.js has built-in support

### Decision 4: Real-time Analytics vs. Batch
**Choice**: Hybrid (real-time for today, batch for historical)
**Rationale**:
- Today's view needs to be instant
- Historical data can be computed on-demand or cached
- Balance between performance and accuracy

### Decision 5: Client vs. Server Components
**Choice**: Server Components by default, Client Components for interactivity
**Rationale**:
- Smaller client bundle
- Better performance
- Only ship JavaScript for interactive parts

---

## 7. Risk Mitigation

### Risk 1: PWA Offline Support Complexity
**Mitigation**: 
- Start with basic offline (cache static assets)
- Add IndexedDB incrementally
- Test early and often on real devices

### Risk 2: Muscle Visualization SVG Complexity
**Mitigation**:
- Use existing SVG body templates (open source)
- Start with simple color mapping
- Iterate on interactivity

### Risk 3: Recommendation Engine Quality
**Mitigation**:
- Start with simple rules
- Log recommendation reasoning
- Allow manual overrides
- Iterate based on usage

### Risk 4: Performance with Large Dataset
**Mitigation**:
- Add database indexes early
- Use pagination for history
- Cache analytics results
- Monitor query performance

### Risk 5: Self-Hosting Deployment Complexity
**Mitigation**:
- Use Docker Compose (simplifies deployment)
- Document thoroughly
- Provide setup scripts
- Test on clean server

---

## 8. Success Metrics

### Technical Metrics
- ✅ Page load time < 2s on 3G
- ✅ API response time < 200ms (p95)
- ✅ Lighthouse score > 90
- ✅ Zero critical bugs in production
- ✅ 99.9% uptime (self-hosted)

### User Experience Metrics
- ✅ Check-in takes < 30 seconds
- ✅ Workout logging doesn't interrupt training
- ✅ App works offline
- ✅ Muscle visualization loads instantly
- ✅ Recommendations feel relevant

---

## 9. Future Considerations (Post-MVP)

### Phase 5: Enhanced Features
- LLM integration for narrative summaries
- Advanced meal logging with nutrition database
- Integration with fitness trackers (Apple Health, etc.)
- Custom split builder UI
- Social sharing (optional, if user wants)

### Phase 6: Native App (If Needed)
- React Native version
- Native iOS app
- Push notifications
- Better offline support

### Phase 7: Multi-User (If Needed)
- User management
- Family/shared accounts
- Privacy controls

---

## 10. Development Best Practices

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- Pre-commit hooks (Husky)
- Code reviews (self-review checklist)

### Testing Strategy
- Unit tests for business logic (analytics, recommendations)
- Integration tests for API routes
- E2E tests for critical paths (optional initially)
- Manual testing on iPhone regularly

### Documentation
- Inline code comments for complex logic
- API documentation (JSDoc)
- README with setup instructions
- Architecture decision records (ADRs) for major decisions

### Version Control
- Feature branches
- Descriptive commit messages
- Regular commits
- Tag releases

---

## Conclusion

This technical evaluation provides a concrete roadmap for building the Personal Fitness Intelligence App. The defined tech stack prioritizes:

1. **Developer Experience**: TypeScript, Prisma, Next.js
2. **Performance**: Server Components, optimized queries, PWA
3. **Mobile-First**: Touch-optimized, offline support, fast interactions
4. **Maintainability**: Clear architecture, type safety, good documentation

The 28-day roadmap is ambitious but achievable for a focused MVP. Adjust timelines based on actual development speed, but maintain the phase structure and dependencies.

**Next Steps**:
1. Review this document
2. Set up development environment (Phase 0, Day 1)
3. Begin implementation following the roadmap
4. Iterate based on learnings

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: Technical Evaluation


