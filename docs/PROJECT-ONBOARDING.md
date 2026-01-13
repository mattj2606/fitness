# Project Onboarding Guide

**For AI Agents/New Developers Reviewing This Project**

## Project Overview

**Fitness Intelligence App** - A personal, self-hosted fitness tracking and AI-powered workout recommendation system.

### Core Vision
- **Self-hosted** personal fitness app (privacy-first)
- **ML/AI-powered** recommendation engine (learns your body)
- **Mobile-first** PWA (fast data entry, offline support)
- **Data-rich** analytics (benchmarking, trends, correlations)

### Current Status
- ✅ **Phase 1 Complete**: Foundation + Recommendation Engine (Rule-based)
- ⏳ **Phase 2 Pending**: ML Models (need 30-50 workouts of data)
- 🎯 **Goal**: True AI personal trainer that replaces human trainers

---

## Architecture Decisions

### Tech Stack (Current)
- **Next.js 14+** (App Router, Server Components)
- **PostgreSQL + Prisma** (Database, self-hosted)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Session-based Auth** (Custom, self-hosted)

### Tech Stack (Considering for MVP)
- **Convex** (Cloud database for faster MVP)
- **Clerk** (Auth + Billing for beta)
- **Shadcn UI** (Fast component development)
- **Decision**: Start cloud for 5-person beta, migrate to self-hosted if needed

---

## Key Design Decisions

### 1. Time-Based Recovery (Not Count-Based)
- Uses **hours since stimulus** (not "last 10 workouts")
- Processes **ALL workouts** (scales infinitely)
- More precise than days-based
- ML-ready (will learn personal recovery times)

### 2. ML-Ready Architecture
- Feature extraction built-in
- Model interfaces defined
- Training data preparation ready
- Can add ML models when data accumulates

### 3. Goal-Oriented & Problem-Solving
- User goals drive recommendations
- Problems (injuries, conditions) get priority
- Muscle coverage analysis (identifies gaps)
- Flexible splits (not just push/pull/legs)

### 4. Incremental Build Strategy
- Build with HTML snippets from AI
- Focus on input forms first
- Web/desktop PWA
- Bit by bit development

---

## Project Structure

```
app/
  (routes)/          # Route groups
  api/               # API routes (route.ts files)
  checkin/           # Check-in page
  exercises/         # Exercise management
  plan/              # Recommendation display
  login/             # Authentication
  setup/             # User setup

components/
  checkin/           # Check-in components
  exercises/         # Exercise components
  recommendation/    # Recommendation display
  layout/            # Layout components
  ui/                # Base UI (empty - will add Shadcn)

lib/
  services/
    recommendation/  # Recommendation engine (ML-ready)
      engine-v2.ts   # Main engine (time-based, ML-ready)
      recovery.ts    # Time-based recovery calculations
      coverage.ts    # Muscle coverage analysis
      problems.ts    # Problem-based recommendations
      advanced-filters.ts  # Multi-factor filtering
      ml-ready.ts    # ML feature extraction
    analytics/       # Analytics services
    checkin/         # Check-in services
  auth/              # Authentication
  db/                # Database (Prisma)
  validations/       # Zod schemas
  types/             # TypeScript types
  utils/             # Utilities

prisma/
  schema.prisma      # Database schema (15+ models)
  seed.ts            # Seed data

docs/                # Comprehensive documentation
```

---

## Current Implementation Status

### ✅ Completed

1. **Database Schema**
   - 15+ models (User, Exercise, Workout, Checkin, etc.)
   - Recommendation, DailyMetrics, Benchmark models
   - Complete relationships

2. **Authentication**
   - Session-based auth
   - User setup flow
   - Login/logout
   - Protected routes

3. **Check-In System**
   - Daily check-in form
   - Soreness body map
   - API endpoints
   - Service layer

4. **Exercise Management**
   - Exercise CRUD
   - Muscle mapping
   - Exercise catalog

5. **Recommendation Engine (V2)**
   - Time-based recovery
   - Muscle coverage analysis
   - Problem-based recommendations
   - Advanced multi-factor filtering
   - ML-ready feature extraction
   - Goal-oriented logic

6. **Analytics Foundation**
   - Daily metrics calculation
   - Benchmarking structure
   - Data collection ready

### ⏳ In Progress / Pending

1. **Workout Logging**
   - Form UI (needs to be built)
   - API endpoints (need to be created)
   - Fast data entry interface

2. **User Profile**
   - Goals, problems, preferences
   - Database models (need to add)
   - Setup flow

3. **ML Models**
   - Need 30-50 workouts of data
   - Personal recovery time predictor
   - Exercise effectiveness model
   - Workout type predictor

4. **UI Components**
   - Shadcn integration (planned)
   - Muscle coverage visualization
   - Analytics dashboard

---

## Key Files to Understand

### Recommendation Engine
- `lib/services/recommendation/engine-v2.ts` - Main engine (time-based, ML-ready)
- `lib/services/recommendation/recovery.ts` - Time-based recovery (hours since stimulus)
- `lib/services/recommendation/coverage.ts` - Muscle coverage & gap analysis
- `lib/services/recommendation/problems.ts` - Problem-based recommendations
- `lib/services/recommendation/advanced-filters.ts` - Multi-factor filtering
- `lib/services/recommendation/ml-ready.ts` - ML feature extraction

### API Routes
- `app/api/recommendations/generate/route.ts` - Generate recommendations
- `app/api/checkins/route.ts` - Check-in CRUD
- `app/api/exercises/route.ts` - Exercise CRUD
- `app/api/metrics/daily/route.ts` - Daily metrics

### Pages
- `app/checkin/page.tsx` - Daily check-in
- `app/plan/page.tsx` - Workout recommendations
- `app/exercises/page.tsx` - Exercise management

---

## Documentation Files

### Planning & Strategy
- `docs/product/MVP-STRATEGY.md` - Cloud-first vs self-hosted strategy
- `docs/architecture/TECH-STACK-COMPARISON.md` - Stack comparison analysis
- `docs/architecture/INCREMENTAL-BUILD-STRATEGY.md` - Build approach with HTML snippets
- `docs/architecture/RECOMMENDATION-ENGINE-REDESIGN.md` - Engine architecture
- `docs/architecture/RECOMMENDATION-ENGINE-RATIONALE.md` - Design rationale

### Research
- `docs/architecture/recommendation-engine-research.md` - ML/AI research (701 lines)
- `docs/archive/literature-review.md` - Academic research
- `docs/product/AI-PERSONAL-TRAINER-VISION.md` - Long-term AI vision

### Implementation
- `docs/architecture/RECOMMENDATION-ENGINE-IMPLEMENTATION.md` - What's built
- `docs/architecture/architecture-overview.md` - ML-ready status

---

## Key Concepts

### Time-Based Recovery
- Recovery calculated in **hours** since last stimulus
- Processes **ALL workouts** (not just last 10)
- More precise than days-based
- Scales infinitely

### Muscle Coverage Analysis
- Identifies undertrained muscles
- Calculates gaps in training
- Prioritizes muscles needing attention
- Balances muscle development

### Problem-Based Recommendations
- User can specify problems (injuries, conditions)
- System finds exercises that address problems
- Example: "wrist pain" → forearm exercises
- Priority-based (urgent problems first)

### ML-Ready Architecture
- Feature extraction built-in
- Model interfaces defined
- Training data preparation
- Ready for personal ML models

---

## Next Steps (For New Agent)

### Immediate Priorities
1. **Workout Logging Form** - Most critical missing piece
   - Fast data entry interface
   - Mobile-optimized
   - Connect to workout API

2. **User Profile System**
   - Goals, problems, preferences
   - Database models
   - Setup flow

3. **Shadcn UI Integration**
   - Fast component development
   - Consistent design system

### Short-Term
1. **ML Model Training** (after 30-50 workouts)
   - Personal recovery time predictor
   - Exercise effectiveness model

2. **Analytics Dashboard**
   - Muscle coverage visualization
   - Trends and correlations

### Long-Term
1. **Deep Learning Models**
2. **Conversational AI**
3. **Form Analysis** (if video available)

---

## Important Notes

### For AI Agents
- **Don't simplify** - This is built for sophisticated AI, not simple rules
- **ML-ready** - Architecture supports ML from day 1
- **Time-based** - Recovery uses hours, not workout counts
- **Goal-oriented** - Recommendations adapt to user goals/problems
- **Incremental** - Build with HTML snippets, bit by bit

### Current Philosophy
- **Start cloud for MVP** (faster iteration)
- **Migrate to self-hosted if needed** (privacy, costs)
- **Focus on input forms first** (data ingestion)
- **Build incrementally** (HTML snippets → components)

### Code Style
- TypeScript everywhere
- Server Components by default
- Client Components only when needed
- Mobile-first design
- Explainable recommendations

---

## Questions to Consider

1. **Should we pivot to cloud stack for MVP?**
   - Convex + Clerk for faster beta
   - Migrate to PostgreSQL later if needed

2. **What's the priority for next build?**
   - Workout logging form (most critical)
   - User profile system
   - Shadcn integration

3. **How to handle HTML snippets?**
   - Convert to React components
   - Add functionality
   - Integrate with existing APIs

---

## Getting Started

1. **Read this document** (you're here!)
2. **Review key files**:
   - `lib/services/recommendation/engine-v2.ts`
   - `prisma/schema.prisma`
   - `docs/recommendation-engine-research.md`
3. **Understand architecture**:
   - Time-based recovery
   - ML-ready design
   - Goal-oriented recommendations
4. **Check current status**:
   - What's built
   - What's pending
   - What's next

---

**This project is designed to evolve from rule-based to ML-powered to true AI personal trainer.**

**The foundation is solid. The architecture is ML-ready. The vision is clear.**

**Ready for the next phase of development.**

