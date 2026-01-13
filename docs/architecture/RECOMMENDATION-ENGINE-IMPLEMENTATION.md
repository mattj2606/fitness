# Recommendation Engine Implementation

**Status**: ✅ Core Implementation Complete  
**Date**: 2024

## What's Been Built

### 1. Database Schema Updates ✅
- **Recommendation** model - Stores daily workout recommendations
- **DailyMetrics** model - Aggregated daily metrics for benchmarking
- **Benchmark** model - Weekly/monthly/yearly benchmarks
- **MuscleRecovery** model - Tracks muscle recovery status

### 2. Recommendation Engine ✅
**Location**: `lib/services/recommendation/`

- **`engine.ts`** - Main recommendation generation logic
- **`recovery.ts`** - Muscle recovery calculations
- **`filters.ts`** - Exercise filtering based on check-in data
- **`scoring.ts`** - Exercise scoring and ranking
- **`types.ts`** - TypeScript type definitions

**Features**:
- Determines workout type (push/pull/legs/rest) based on recovery
- Filters exercises based on soreness, energy, time available
- Scores exercises based on muscle recovery status
- Provides explainable recommendations with reasoning

### 3. Analytics Services ✅
**Location**: `lib/services/analytics/`

- **`daily-metrics.ts`** - Calculates daily aggregated metrics
  - Total volume (sets × reps × weight)
  - Average intensity
  - Muscle groups trained
  - Average soreness
  - Sleep and energy data

### 4. API Endpoints ✅
- **`POST /api/recommendations/generate`** - Generate new recommendation
- **`GET /api/recommendations/generate`** - Get today's recommendation
- **`POST /api/recommendations/feedback`** - Submit feedback on recommendation
- **`POST /api/metrics/daily`** - Calculate daily metrics
- **`GET /api/metrics/daily`** - Get daily metrics

### 5. UI Components ✅
- **`RecommendationDisplay`** - Displays workout recommendations with:
  - Workout type and duration
  - Recommended exercises with reasoning
  - Suggested sets/reps
  - Feedback buttons (thumbs up/down)
  - Rest day recommendations

### 6. Plan Page ✅
- Updated `/plan` page to display recommendations
- Automatically generates recommendation if none exists
- Shows full workout plan with explanations

## How It Works

### Recommendation Flow

1. **Check-in Data** → User completes daily check-in (soreness, sleep, energy)
2. **Workout History** → System loads last 10 workouts
3. **Recovery Calculation** → Calculates recovery status for each muscle group
4. **Workout Type Selection** → Determines push/pull/legs/rest based on:
   - Last workout type (rotates through push/pull/legs)
   - Muscle recovery status
   - Check-in data (sleep, energy, soreness)
5. **Exercise Filtering** → Filters exercises based on:
   - Soreness levels (excludes severely sore muscles)
   - Available equipment
   - Workout type (push/pull/legs)
6. **Exercise Scoring** → Scores exercises based on:
   - Muscle recovery status
   - Days since last stimulus
   - Exercise priority
7. **Recommendation Generation** → Selects top exercises and generates plan

### Recovery Logic

- **Small muscles** (biceps, triceps, calves): 24-48 hours recovery
- **Medium muscles** (shoulders, traps): 48-72 hours recovery
- **Large muscles** (chest, back, legs): 72-96 hours recovery
- **Soreness-based exclusions**:
  - Soreness ≥ 4: Exclude muscle completely
  - Soreness = 3: Light work only
  - Soreness ≤ 2: Normal training

### Rest Day Logic

Rest day is recommended when:
- Severe soreness (≥4) in multiple muscles
- Very poor sleep (<5 hours)
- Low energy + poor sleep quality
- No muscles are recovered and ready

## Next Steps

### Immediate
1. **Run Database Migration**:
   ```bash
   npx prisma migrate dev --name add_recommendation_engine
   ```

2. **Test the System**:
   - Complete a check-in
   - Visit `/plan` page
   - Verify recommendation is generated
   - Test feedback functionality

### Short-term
1. **Benchmarking Service** (Todo #7)
   - Compare current performance to historical
   - Weekly/monthly averages
   - Progress tracking

2. **Analytics Service** (Todo #9)
   - Correlation analysis (sleep vs. performance)
   - Muscle balance analysis
   - Trend identification

3. **Daily Metrics Automation**
   - Set up cron job or scheduled task
   - Automatically calculate metrics daily

### Long-term
1. **ML Model Integration**
   - Train models on user's historical data
   - Personal recovery time prediction
   - Personalized workout type prediction

2. **Advanced Features**
   - Periodization planning
   - Progressive overload automation
   - Workout sequence optimization

## Database Migration

Run the following to apply schema changes:

```bash
npx prisma migrate dev --name add_recommendation_engine
npx prisma generate
```

## Testing Checklist

- [ ] Complete daily check-in
- [ ] Visit `/plan` page
- [ ] Verify recommendation is displayed
- [ ] Check exercise recommendations make sense
- [ ] Test feedback buttons
- [ ] Verify rest day logic (test with high soreness)
- [ ] Test with no workout history
- [ ] Test with different energy levels
- [ ] Verify daily metrics calculation

## Files Created/Modified

### New Files
- `lib/services/recommendation/types.ts`
- `lib/services/recommendation/engine.ts`
- `lib/services/recommendation/recovery.ts`
- `lib/services/recommendation/filters.ts`
- `lib/services/recommendation/scoring.ts`
- `lib/services/recommendation/index.ts`
- `lib/services/analytics/daily-metrics.ts`
- `app/api/recommendations/generate/route.ts`
- `app/api/recommendations/feedback/route.ts`
- `app/api/metrics/daily/route.ts`
- `components/recommendation/RecommendationDisplay.tsx`

### Modified Files
- `prisma/schema.prisma` - Added 4 new models
- `app/plan/page.tsx` - Integrated recommendation engine

## Key Design Decisions

1. **Rule-Based First**: Started with deterministic rules for explainability
2. **Recovery-Focused**: Muscle recovery is the primary driver of recommendations
3. **Explainable**: All recommendations include reasoning
4. **Single-User Optimized**: Designed for personal data, not multi-user
5. **Privacy-First**: All data stays local, no external APIs

## Performance Considerations

- Recommendations are cached per day (one per user per day)
- Recovery calculations are efficient (O(n) where n = muscle groups)
- Exercise filtering is fast (simple array operations)
- Daily metrics are calculated on-demand or via scheduled job

## Future Enhancements

1. **ML Integration**: Add personal ML models as data accumulates
2. **Progressive Overload**: Automatically suggest weight/rep increases
3. **Periodization**: Plan deload weeks and intensity cycles
4. **Workout Templates**: Save and reuse workout plans
5. **Exercise Alternatives**: Suggest alternatives if equipment unavailable

