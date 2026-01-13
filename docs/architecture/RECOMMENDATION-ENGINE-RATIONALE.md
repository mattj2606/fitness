# Recommendation Engine - Design Rationale

## Core Design Principles

### 1. Time-Based Recovery (Not Count-Based)

**Rationale**:
- Recovery is a **time-based process**, not a count-based one
- A muscle needs X hours to recover, regardless of how many workouts you've done
- Using "last 10 workouts" is arbitrary and doesn't scale
- As you accumulate more data, the system should look at ALL workouts, not just recent ones
- This approach will eventually be ML-driven (personal recovery time prediction)

**Implementation**:
- Calculate **hours since last stimulus** for each muscle
- Compare to recovery window (24-96 hours based on muscle size)
- Works whether you have 10 workouts or 10,000 workouts
- More precise than "days since" - uses hours for accuracy

**Example**:
- Chest was trained 36 hours ago
- Chest recovery time: 72 hours
- Recovery progress: 36/72 = 50% recovered
- Decision: Can train with reduced intensity

### 2. Flexible Workout Splits (Not Just Push/Pull/Legs)

**Rationale**:
- Push/pull/legs is ONE split type, but users have different needs
- Athletes might need sport-specific training
- PT patients need problem-focused workouts
- Users might prefer upper/lower or full body
- System should adapt to user's goals and problems

**Implementation**:
- Support multiple split types: push/pull/legs, upper/lower, full body, PT-focused
- Determine workout type based on:
  1. **Day of week** (if user has schedule preferences)
  2. **Recovery status** (which muscles are ready)
  3. **Goals** (what user wants to achieve)
  4. **Problems** (what needs addressing - PT, injury prevention)
- For now, focus on push/pull/legs but keep architecture flexible

**Example**:
- User has TMS (jaw/neck problem)
- System recommends PT-focused workout with neck/shoulder exercises
- Even if it's a "push" day, PT takes priority

### 3. Goal-Oriented Recommendations

**Rationale**:
- Different goals require different approaches
- Strength training ≠ hypertrophy ≠ PT ≠ injury prevention
- User should specify goals, and system adapts
- Goals drive exercise selection, volume, intensity

**Implementation**:
- User profile stores goals: strength, hypertrophy, endurance, PT, injury prevention, etc.
- Goal-specific logic:
  - **Strength**: Lower reps (3-5), higher weight, longer rest
  - **Hypertrophy**: Moderate reps (8-12), moderate weight, moderate rest
  - **PT**: Specific exercises for problems, higher frequency
  - **Injury Prevention**: Prehab exercises, mobility work
- Exercises scored based on goal alignment

**Example**:
- Goal: "strength"
- System prioritizes compound movements (squats, deadlifts, bench press)
- Suggests 3-5 reps, 3-5 sets, longer rest periods

### 4. Problem-Based Recommendations

**Rationale**:
- Users have specific problems (injuries, conditions, weaknesses)
- System should address these proactively
- Example: "wrist crack" → recommend forearm exercises
- Example: "TMS" → recommend neck/shoulder/PT exercises
- Problems can be added via voice check-in or manual entry

**Implementation**:
- Problem model stores: type, name, affected muscles, priority
- System finds exercises that target affected muscles
- Problem exercises get priority boost in scoring
- High-priority problems can override normal split rotation

**Example**:
- Problem: "wrist pain" (priority: 4)
- Affected muscles: ["forearms", "wrists"]
- System recommends: wrist curls, reverse wrist curls, forearm planks
- These exercises get +0.5 score boost

### 5. Muscle Coverage & Gap Analysis

**Rationale**:
- Users might miss certain muscle groups
- System should identify gaps and recommend exercises
- Visual muscle map shows coverage
- Helps prevent imbalances

**Implementation**:
- Calculate muscle stimulus over time windows (7 days, 30 days)
- Identify muscles with low/zero stimulus
- Mark as "undertrained" if below threshold
- Recommend exercises to fill gaps
- Show visual muscle map with coverage indicators

**Example**:
- Forearms haven't been trained in 14 days
- System identifies gap
- Recommends forearm exercises
- Shows in muscle coverage visualization

### 6. Advanced Multi-Factor Filtering

**Rationale**:
- Just excluding sore muscles is too simple
- Need to consider: recovery, goals, problems, coverage, preferences, equipment, energy, time
- Each factor is a parameter that can be weighted
- Will eventually be ML-optimized based on user feedback

**Implementation**:
- 8+ filter factors, each with weight:
  1. Recovery & Soreness (30%)
  2. Goals Alignment (20%)
  3. Problem Addressing (25%)
  4. Muscle Coverage (15%)
  5. Preferences (10%)
  6. Equipment (5%)
  7. Variety (5%)
  8. Workout Type Match (10%)
- Exercises scored 0-1, sorted by score
- Top exercises selected for recommendation

**Example**:
- Exercise A: Targets recovered muscles (0.3), aligns with strength goal (0.2), addresses wrist problem (0.25) = 0.75 score
- Exercise B: Targets sore muscles (-0.2), doesn't align with goals (0) = 0.3 score
- System recommends Exercise A

## Model Architecture

### UserFitnessProfile
Stores user's goals, problems, preferences, equipment, schedule.

### Problem
Stores specific problems (injuries, conditions, weaknesses) with affected muscles and priority.

### MuscleCoverage
Analyzes muscle stimulus over time, identifies gaps, calculates priority.

### AdvancedFilterParams
All filter parameters in one place, can be tuned/ML-optimized.

## Future ML Integration

1. **Personal Recovery Time Prediction**: Learn user's actual recovery times (not just muscle size-based)
2. **Filter Weight Optimization**: Learn which filters matter most for user
3. **Problem Exercise Matching**: Learn which exercises work best for specific problems
4. **Goal-Specific Recommendations**: Learn optimal exercises/volume for each goal
5. **Workout Type Prediction**: Learn when user prefers which workout types

## Key Benefits

1. **Scalable**: Time-based approach works with any amount of data
2. **Flexible**: Supports multiple splits, goals, problems
3. **Personalized**: Adapts to user's specific needs
4. **Explainable**: Clear reasoning for each recommendation
5. **Problem-Solving**: Addresses injuries, conditions, weaknesses
6. **Balanced**: Identifies and fills muscle coverage gaps
7. **ML-Ready**: Architecture supports future ML integration

