# For AI Agents: Quick Start Guide

**You're reviewing a fitness app project. Here's what you need to know.**

## TL;DR

- **What**: Personal fitness app with AI-powered recommendations
- **Status**: Foundation complete, ML-ready architecture built
- **Next**: Workout logging form (most critical missing piece)
- **Strategy**: Cloud-first MVP, incremental build with HTML snippets

## Key Architecture Decisions

### 1. Time-Based Recovery (Not Count-Based)
```typescript
// Uses HOURS since stimulus, not "last 10 workouts"
calculateHoursSinceStimulus(lastStimulus: Date): number
// Processes ALL workouts, scales infinitely
```

### 2. ML-Ready from Day 1
```typescript
// Feature extraction built-in
extractMLFeatures(...): MLFeatureVector
// Ready for personal ML models
```

### 3. Goal-Oriented & Problem-Solving
```typescript
// Adapts to user goals and problems
determineWorkoutType(goals, problems, recovery): WorkoutType
```

## Current State

### ✅ Built
- Database schema (15+ models)
- Authentication
- Check-in system
- Exercise management
- **Recommendation Engine V2** (time-based, ML-ready)
- Analytics foundation

### ⏳ Missing
- Workout logging form (CRITICAL)
- Workout API endpoints
- User profile system
- Shadcn UI integration

## Important Files

1. **`lib/services/recommendation/engine-v2.ts`** - Main recommendation engine
2. **`prisma/schema.prisma`** - Database schema
3. **`docs/PROJECT-ONBOARDING.md`** - Full onboarding guide
4. **`docs/recommendation-engine-research.md`** - ML/AI research

## What to Build Next

### Priority 1: Workout Logging Form
- Fast data entry (mobile-optimized)
- Select exercise
- Log sets (weight, reps, effort)
- Multiple sets per exercise

### Priority 2: User Profile
- Goals, problems, preferences
- Database models needed
- Setup flow

### Priority 3: Shadcn UI
- Fast component development
- Consistent design

## Build Strategy

**Incremental with HTML snippets:**
1. Receive HTML snippet from AI
2. Convert to React component
3. Add state + API calls
4. Integrate into app

## Tech Stack Decisions

- **Current**: PostgreSQL + Custom Auth (self-hosted)
- **Considering**: Convex + Clerk (cloud for MVP)
- **Decision**: Start cloud for beta, migrate if needed

## Key Concepts

- **Time-based recovery**: Hours since stimulus, not workout counts
- **ML-ready**: Architecture supports ML from day 1
- **Goal-oriented**: Recommendations adapt to user needs
- **Problem-solving**: Addresses injuries, conditions

## Don't Simplify

This is built for **sophisticated AI**, not simple rules. The architecture is designed to evolve from rule-based → ML → True AI.

## Questions?

Read `docs/PROJECT-ONBOARDING.md` for comprehensive guide.

---

**Ready to build. Architecture is solid. Vision is clear.**

