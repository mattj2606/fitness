# Fitness Intelligence App

A personal, self-hosted fitness tracking and AI-powered workout recommendation system.

## 🎯 Vision

Build an AI personal trainer that:
- **Learns your body** (personal recovery times, exercise preferences)
- **Adapts to your needs** (goals, problems, schedule)
- **Solves your problems** (injuries, conditions, weaknesses)
- **Gets smarter every day** (continuous learning from your data)

## 🏗️ Current Status

### ✅ Phase 1: Foundation Complete
- Database schema (15+ models)
- Authentication system
- Check-in system (daily soreness, sleep, energy)
- Exercise management
- **Recommendation Engine V2** (time-based, ML-ready)
- Analytics foundation

### ⏳ Phase 2: ML Models (Pending)
- Need 30-50 workouts of data
- Personal recovery time predictor
- Exercise effectiveness model
- Workout type predictor

### 🎯 Phase 3: True AI (Future)
- Deep learning models
- Conversational interface
- Predictive health
- Adaptive periodization

## 🚀 Tech Stack

### Current
- **Next.js 14+** (App Router, Server Components)
- **PostgreSQL + Prisma** (Database, self-hosted)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Session-based Auth** (Custom, self-hosted)

### Considering for MVP
- **Convex** (Cloud database for faster beta)
- **Clerk** (Auth + Billing for beta)
- **Shadcn UI** (Fast component development)

**Strategy**: Start cloud for 5-person beta, migrate to self-hosted if needed.

## 📁 Project Structure

```
app/                    # Next.js App Router
  api/                  # API routes
  checkin/              # Daily check-in
  exercises/            # Exercise management
  plan/                 # Workout recommendations

components/             # React components
  checkin/              # Check-in components
  exercises/            # Exercise components
  recommendation/       # Recommendation display

lib/
  services/
    recommendation/     # ML-ready recommendation engine
      engine-v2.ts      # Main engine (time-based)
      recovery.ts       # Time-based recovery
      coverage.ts       # Muscle coverage analysis
      problems.ts       # Problem-based recommendations
      ml-ready.ts       # ML feature extraction
    analytics/          # Analytics services
  auth/                 # Authentication
  db/                   # Database (Prisma)

prisma/
  schema.prisma         # Database schema

docs/                   # Comprehensive documentation
```

## 🧠 Key Features

### Time-Based Recovery
- Uses **hours since stimulus** (not workout counts)
- Processes **ALL workouts** (scales infinitely)
- More precise than days-based
- ML-ready (will learn personal recovery times)

### Muscle Coverage Analysis
- Identifies undertrained muscles
- Calculates gaps in training
- Prioritizes muscles needing attention
- Balances muscle development

### Problem-Based Recommendations
- Addresses specific problems (injuries, conditions)
- Example: "wrist pain" → forearm exercises
- Priority-based (urgent problems first)

### ML-Ready Architecture
- Feature extraction built-in
- Model interfaces defined
- Training data preparation
- Ready for personal ML models

## 📚 Documentation

### For AI Agents / New Developers
- **[PROJECT-ONBOARDING.md](docs/PROJECT-ONBOARDING.md)** - Start here!
- **[MVP-STRATEGY.md](docs/product/MVP-STRATEGY.md)** - Cloud vs self-hosted strategy
- **[TECH-STACK-COMPARISON.md](docs/architecture/TECH-STACK-COMPARISON.md)** - Stack analysis
- **[INCREMENTAL-BUILD-STRATEGY.md](docs/architecture/INCREMENTAL-BUILD-STRATEGY.md)** - Build approach

### Research & Planning
- **[recommendation-engine-research.md](docs/architecture/recommendation-engine-research.md)** - ML/AI research (890 lines)
- **[AI-PERSONAL-TRAINER-VISION.md](docs/product/AI-PERSONAL-TRAINER-VISION.md)** - Long-term vision
- **[RECOMMENDATION-ENGINE-RATIONALE.md](docs/architecture/RECOMMENDATION-ENGINE-RATIONALE.md)** - Design decisions

### Implementation
- **[architecture-overview.md](docs/architecture/architecture-overview.md)** - Current status
- **[RECOMMENDATION-ENGINE-IMPLEMENTATION.md](docs/architecture/RECOMMENDATION-ENGINE-IMPLEMENTATION.md)** - What's built

## 🛠️ Development

### Setup
```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run lint         # Lint code
npm run type-check   # TypeScript checking
npx prisma studio    # Database GUI
```

## 🎯 Next Steps

### Immediate Priorities
1. **Workout Logging Form** - Most critical missing piece
2. **User Profile System** - Goals, problems, preferences
3. **Shadcn UI Integration** - Fast component development

### Short-Term
1. Collect 30-50 workouts of data
2. Train personal ML models
3. Build analytics dashboard

### Long-Term
1. Deep learning models
2. Conversational AI
3. True AI personal trainer

## 📝 Important Notes

- **ML-Ready**: Architecture supports ML from day 1
- **Time-Based**: Recovery uses hours, not workout counts
- **Goal-Oriented**: Recommendations adapt to user goals/problems
- **Incremental**: Build with HTML snippets, bit by bit

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

Private project - All rights reserved

---

**Built for sophisticated AI. Designed to evolve. Ready for the future.**
