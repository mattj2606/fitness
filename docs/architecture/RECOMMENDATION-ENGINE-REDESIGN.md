# Recommendation Engine Redesign

## Rationale & Design Decisions

### 1. Time-Based Recovery (Not Count-Based)

**Current Issue**: Using "last 10 workouts" is arbitrary and doesn't scale.

**New Approach**: 
- Calculate recovery based on **hours since last stimulus** for each muscle
- This is time-based, not count-based
- Scales infinitely - works whether you have 10 workouts or 1000
- Will eventually be ML-driven (personal recovery time prediction)

**Implementation**:
```typescript
// For each muscle, find last workout that stimulated it
// Calculate hours since that workout
// Compare to recovery window (24-96 hours based on muscle size)
// Determine if muscle is recovered
```

### 2. Flexible Workout Splits (Not Just Push/Pull/Legs)

**Current Issue**: Hard-coded push/pull/legs rotation is too rigid.

**New Approach**:
- **Workout Type Determination**: Based on day + recovery + goals
- **Split Types**: Support multiple splits (push/pull/legs, upper/lower, full body, PT-focused, etc.)
- **Goal-Based**: User specifies goals (strength, hypertrophy, PT, injury prevention, etc.)
- **Problem-Based**: User can specify problems (wrist pain, TMS, etc.) → system recommends exercises
- **Muscle Coverage Analysis**: Identify missing muscles, suggest additions

**Implementation**:
- User profile with goals, problems, preferred splits
- Workout type determined by:
  1. Day of week (if user has schedule preferences)
  2. Recovery status (which muscles are ready)
  3. Goals (what user wants to achieve)
  4. Problems (what needs addressing - PT, injury prevention)

### 3. Advanced Filtering (AI Parameters)

**Current Issue**: Just excluding sore muscles is too simple.

**New Approach**:
- **Multi-factor filtering**:
  - Recovery status (primary)
  - Soreness levels (secondary)
  - Energy level
  - Time available
  - Equipment available
  - Goals alignment
  - Problem addressing (e.g., wrist pain → forearm exercises)
  - Personal preferences (favorite exercises, avoid exercises)
  - Training history (variety, avoid overuse)
  - Muscle balance (target undertrained muscles)

**Implementation**:
- Each filter is a parameter that can be weighted
- Filters combine to create exercise scores
- Will eventually be ML-optimized based on user feedback

### 4. Muscle Coverage & Gap Analysis

**Current Issue**: No visibility into muscle coverage or gaps.

**New Approach**:
- **Muscle Coverage Map**: Visual representation of which muscles are trained
- **Gap Analysis**: Identify muscles that haven't been trained recently
- **Balance Analysis**: Identify muscle imbalances (e.g., push vs pull)
- **Problem-Based Recommendations**: 
  - User says "wrist crack" → system recommends forearm exercises
  - User says "TMS" → system recommends PT exercises, neck/shoulder work
  - User says "lower back pain" → system recommends core, glutes, hip flexors

**Implementation**:
- Calculate muscle stimulus over time windows (7 days, 30 days)
- Identify muscles with low/zero stimulus
- Recommend exercises to fill gaps
- Show visual muscle map with coverage indicators

### 5. Goal-Oriented Recommendations

**New Approach**:
- **User Goals**: Strength, Hypertrophy, Endurance, PT, Injury Prevention, Athletic Performance
- **Goal-Specific Logic**:
  - **Strength**: Lower reps, higher weight, longer rest
  - **Hypertrophy**: Moderate reps, moderate weight, moderate rest
  - **PT**: Specific exercises for problems, higher frequency
  - **Injury Prevention**: Prehab exercises, mobility work
- **Voice Check-in Integration**: Parse voice input for goals/problems
- **Question-Based Setup**: Ask user about goals, problems, preferences

## New Architecture

### User Profile Model
```typescript
interface UserFitnessProfile {
  goals: FitnessGoal[]; // ["strength", "hypertrophy", "pt", "injury_prevention"]
  problems: Problem[]; // [{ type: "wrist_pain", description: "crack sound", exercises: [...] }]
  preferredSplits: SplitType[]; // ["push_pull_legs", "upper_lower", "full_body"]
  favoriteExercises: string[]; // Exercise IDs
  avoidExercises: string[]; // Exercise IDs
  availableEquipment: string[];
  trainingSchedule: {
    daysPerWeek: number;
    preferredDays?: number[]; // 0-6, Sunday = 0
    timePerSession: number; // minutes
  };
}
```

### Problem Model
```typescript
interface Problem {
  id: string;
  type: string; // "injury", "condition", "imbalance"
  name: string; // "wrist pain", "TMS", "lower back pain"
  description?: string;
  affectedMuscles: string[]; // Muscle names that need attention
  recommendedExercises: string[]; // Exercise IDs
  priority: number; // 1-5, higher = more urgent
  createdAt: Date;
}
```

### Workout Type Determination
```typescript
function determineWorkoutType(
  dayOfWeek: number,
  recoveryStatus: MuscleRecoveryStatus[],
  goals: FitnessGoal[],
  problems: Problem[],
  lastWorkoutType?: string
): WorkoutType {
  // 1. Check for PT/problem-focused day
  if (problems.some(p => p.priority >= 4)) {
    return 'pt'; // Prioritize problem-solving
  }
  
  // 2. Check recovery status
  const recoveredMuscles = recoveryStatus.filter(r => r.isRecovered);
  
  // 3. Determine split based on goals and recovery
  if (goals.includes('pt') || problems.length > 0) {
    // PT-focused: prioritize problem-solving exercises
    return 'pt';
  }
  
  // 4. Standard split rotation (push/pull/legs for now)
  // But flexible for future splits
  return rotateSplit(lastWorkoutType, recoveredMuscles);
}
```

### Muscle Coverage Analysis
```typescript
interface MuscleCoverage {
  muscleId: string;
  muscleName: string;
  lastStimulus: Date | null;
  hoursSinceStimulus: number;
  stimulusLast7Days: number; // Total volume in last 7 days
  stimulusLast30Days: number; // Total volume in last 30 days
  isUndertrained: boolean; // Below threshold
  recommendedStimulus: number; // Target volume
  gap: number; // Difference between current and target
}

function analyzeMuscleCoverage(
  workouts: Workout[],
  days: number = 30
): MuscleCoverage[] {
  // Calculate stimulus for each muscle over time window
  // Identify gaps
  // Return coverage analysis
}
```

### Advanced Exercise Filtering
```typescript
interface ExerciseFilterParams {
  // Recovery
  excludeSoreMuscles: boolean; // Muscles with soreness >= 4
  preferRecoveredMuscles: boolean; // Prioritize recovered muscles
  
  // Goals
  goalAlignment: Record<string, number>; // Weight per goal
  
  // Problems
  addressProblems: Problem[]; // Include exercises for problems
  
  // Balance
  targetUndertrainedMuscles: boolean; // Fill gaps
  
  // Preferences
  favoriteExercises: string[];
  avoidExercises: string[];
  
  // Constraints
  availableEquipment: string[];
  maxDuration: number;
  energyLevel: EnergyLevel;
  
  // Variety
  avoidRecentExercises: boolean; // Don't repeat recent exercises
  daysSinceLastUse: number; // Minimum days since last use
}

function filterExercises(
  exercises: Exercise[],
  params: ExerciseFilterParams
): Exercise[] {
  // Multi-factor filtering with weights
  // Each factor contributes to score
  // Return filtered and scored exercises
}
```

### Problem-Based Recommendations
```typescript
function getProblemExercises(
  problem: Problem,
  exerciseCatalog: Exercise[]
): Exercise[] {
  // Find exercises that target affected muscles
  // Filter by problem type (PT exercises for injuries)
  // Return recommended exercises
}

// Example: "wrist crack" problem
// → Affected muscles: ["forearms", "wrists"]
// → Recommended exercises: ["wrist curls", "reverse wrist curls", "forearm planks"]
```

## Implementation Plan

### Phase 1: Core Redesign
1. ✅ Update recovery calculation to be time-based (hours since stimulus)
2. ✅ Add UserFitnessProfile model to database
3. ✅ Add Problem model to database
4. ✅ Redesign workout type determination (day + recovery + goals)
5. ✅ Implement muscle coverage analysis
6. ✅ Enhance exercise filtering with multiple parameters

### Phase 2: Goal & Problem System
1. Create user profile setup flow (questions about goals, problems)
2. Implement problem-based exercise recommendations
3. Add muscle coverage visualization
4. Build goal-specific workout logic

### Phase 3: Advanced Features
1. Voice check-in parsing for goals/problems
2. ML-based recovery time prediction
3. ML-based filter weight optimization
4. Personalized split recommendations

## Key Changes from Current Implementation

1. **Time-based recovery**: Hours since stimulus, not workout count
2. **Flexible splits**: Not just push/pull/legs, supports any split
3. **Goal-oriented**: User goals drive recommendations
4. **Problem-solving**: Addresses user problems (injuries, conditions)
5. **Muscle coverage**: Visual gap analysis and recommendations
6. **Advanced filtering**: Multi-factor, weighted filtering
7. **User profile**: Stores goals, problems, preferences

## Database Schema Updates Needed

```prisma
model UserFitnessProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  goals              Json     // ["strength", "hypertrophy", "pt", ...]
  preferredSplits    Json     // ["push_pull_legs", "upper_lower", ...]
  favoriteExercises  Json     // Exercise IDs
  avoidExercises     Json     // Exercise IDs
  availableEquipment Json     // Equipment list
  trainingSchedule   Json     // Schedule preferences
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  problems           Problem[]
}

model Problem {
  id                String   @id @default(cuid())
  userId            String
  type              String   // "injury", "condition", "imbalance"
  name              String   // "wrist pain", "TMS", "lower back pain"
  description       String?
  affectedMuscles   Json     // Muscle names
  recommendedExercises Json  // Exercise IDs
  priority          Int      @default(3) // 1-5
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  profile           UserFitnessProfile @relation(fields: [userId], references: [userId])
  
  @@index([userId, isActive])
}
```

