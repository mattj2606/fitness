import { DailyCheckin, Workout, Muscle, WorkoutSet } from '@prisma/client';
import {
  RecommendationInput,
  RecommendationOutput,
  WorkoutType,
  MuscleRecoveryStatus,
  RecommendedExercise,
  UserFitnessProfile,
  ExerciseWithMuscles,
} from './types';
import {
  calculateMuscleRecoveryHours,
  findLastStimulusDates,
} from './recovery';
import { analyzeMuscleCoverage, getMusclesNeedingAttention } from './coverage';
import { getAllProblemExercises } from './problems';
import { filterAndScoreExercises, AdvancedFilterParams } from './advanced-filters';
import { calculateExerciseCount, calculateVolume } from './filters';
import { extractMLFeatures } from './ml-ready';



type WorkoutWithSets = Workout & {
  sets: (WorkoutSet & {
    exerciseId: string;
    exercise: ExerciseWithMuscles;
  })[];
};

// Determine workout type based on day + recovery + goals + problems
function determineWorkoutType(
  dayOfWeek: number,
  checkin: DailyCheckin | null,
  muscleRecoveries: MuscleRecoveryStatus[],
  userProfile: UserFitnessProfile | undefined,
  lastWorkoutType?: string
): WorkoutType {
  const problems = userProfile?.problems.filter(p => p.isActive !== false) || [];

  // 1. Check for high-priority problems (PT takes priority)
  const highPriorityProblems = problems.filter(p => p.priority >= 4);
  if (highPriorityProblems.length > 0) {
    return 'pt'; // Prioritize problem-solving
  }

  // 2. Check for rest day conditions
  if (checkin) {
    const sorenessMap = checkin.sorenessMap as Record<string, number> | null;
    if (sorenessMap) {
      const maxSoreness = Math.max(...Object.values(sorenessMap));
      if (maxSoreness >= 4) {
        return 'rest';
      }
    }

    if (checkin.hoursSlept && checkin.hoursSlept < 5) {
      return 'rest';
    }

    if (
      checkin.energyLevel === 'low' &&
      checkin.sleepQuality &&
      checkin.sleepQuality <= 2
    ) {
      return 'rest';
    }
  }

  // 3. Check if user has PT goals or problems
  const hasPTGoal = userProfile?.goals.includes('pt') || false;
  const hasPTProblems = problems.length > 0;
  if (hasPTGoal || hasPTProblems) {
    // Alternate PT days with regular training
    if (dayOfWeek % 2 === 0) { // Even days = PT
      return 'pt';
    }
  }

  // 4. Determine split based on recovery and preferences
  const preferredSplits = userProfile?.preferredSplits || ['push_pull_legs'];
  const usePushPullLegs = preferredSplits.includes('push_pull_legs');

  if (usePushPullLegs) {
    return determinePushPullLegsRotation(
      lastWorkoutType,
      muscleRecoveries,
      dayOfWeek
    );
  }

  // Default to push if no history
  return 'push';
}

// Determine push/pull/legs rotation based on recovery
function determinePushPullLegsRotation(
  lastWorkoutType: string | undefined,
  muscleRecoveries: MuscleRecoveryStatus[],
  _dayOfWeek: number
): WorkoutType {
  if (!lastWorkoutType) {
    return 'push'; // Start with push
  }

  // Find which muscle groups are recovered and ready
  const pushMuscles = muscleRecoveries.filter((r) =>
    ['chest', 'shoulders', 'triceps'].some((name) =>
      r.muscleName.toLowerCase().includes(name)
    )
  );

  const pullMuscles = muscleRecoveries.filter((r) =>
    ['back', 'lats', 'biceps', 'rear delts'].some((name) =>
      r.muscleName.toLowerCase().includes(name)
    )
  );

  const legMuscles = muscleRecoveries.filter((r) =>
    ['quads', 'hamstrings', 'glutes', 'calves'].some((name) =>
      r.muscleName.toLowerCase().includes(name)
    )
  );

  // Rotate based on last workout
  if (lastWorkoutType === 'push') {
    // Check pull first, then legs
    if (pullMuscles.some((r) => r.canTrain && r.isRecovered)) {
      return 'pull';
    }
    if (legMuscles.some((r) => r.canTrain && r.isRecovered)) {
      return 'legs';
    }
    return 'rest'; // Nothing ready
  } else if (lastWorkoutType === 'pull') {
    if (legMuscles.some((r) => r.canTrain && r.isRecovered)) {
      return 'legs';
    }
    if (pushMuscles.some((r) => r.canTrain && r.isRecovered)) {
      return 'push';
    }
    return 'rest';
  } else if (lastWorkoutType === 'legs') {
    if (pushMuscles.some((r) => r.canTrain && r.isRecovered)) {
      return 'push';
    }
    if (pullMuscles.some((r) => r.canTrain && r.isRecovered)) {
      return 'pull';
    }
    return 'rest';
  }

  return 'push'; // Default
}

// Generate workout recommendation with ML-ready architecture
export async function generateRecommendationV2(
  input: RecommendationInput
): Promise<RecommendationOutput & { muscleCoverage: any[]; mlFeatures: any }> {
  const { checkin, allWorkouts, exerciseCatalog, userProfile, dayOfWeek = new Date().getDay() } = input;

  // Get all muscles from exercise catalog
  const allMuscles = new Map<string, Muscle>();
  for (const exercise of exerciseCatalog) {
    for (const target of exercise.muscleTargets) {
      allMuscles.set(target.muscle.id, target.muscle);
    }
  }

  // TIME-BASED RECOVERY: Find last stimulus for ALL workouts (not just last 10)
  const lastStimulusDates = findLastStimulusDates(
    allWorkouts as WorkoutWithSets[]
  );

  const sorenessMap = (checkin?.sorenessMap as Record<string, number> | null) || null;

  // Calculate recovery status using HOURS (not days)
  const muscleRecoveries: MuscleRecoveryStatus[] = Array.from(
    allMuscles.values()
  ).map((muscle) => {
    const lastStimulus = lastStimulusDates[muscle.id] || null;
    const recovery = calculateMuscleRecoveryHours(muscle, lastStimulus, sorenessMap);
    return {
      ...recovery,
      daysSinceStimulus: (recovery.hoursSinceStimulus || 0) / 24, // For backward compatibility
    };
  });

  const muscleCoverage = analyzeMuscleCoverage(
    allWorkouts as WorkoutWithSets[],
    Array.from(allMuscles.values()),
    lastStimulusDates
  );

  // Get muscles needing attention (gaps, problems)
  const problems = userProfile?.problems || [];
  const musclesNeedingAttention = getMusclesNeedingAttention(muscleCoverage, problems);

  // Determine workout type (day + recovery + goals + problems)
  const lastWorkout = allWorkouts[0];
  let workoutType = determineWorkoutType(
    dayOfWeek,
    checkin,
    muscleRecoveries,
    userProfile,
    lastWorkout?.type || undefined
  );

  // If rest day, return early
  if (workoutType === 'rest') {
    return {
      workoutType: 'rest',
      exercises: [],
      reasoning: [
        'Rest day recommended based on recovery status',
        checkin?.hoursSlept && checkin.hoursSlept < 5
          ? 'Poor sleep quality (< 5 hours)'
          : 'High soreness or low energy levels',
      ],
      estimatedDuration: 0,
      confidence: 0.9,
      muscleCoverage: muscleCoverage.slice(0, 10), // Top 10 for display
      mlFeatures: extractMLFeatures(
        checkin,
        allWorkouts,
        muscleRecoveries,
        muscleCoverage,
        userProfile,
        dayOfWeek
      ),
    };
  }

  // Get problem exercises if PT-focused
  const problemExercises = workoutType === 'pt' && problems.length > 0
    ? getAllProblemExercises(problems, exerciseCatalog as ExerciseWithMuscles[])
    : [];

  // Build advanced filter parameters
  const filterParams: AdvancedFilterParams = {
    excludeSoreMuscles: true,
    preferRecoveredMuscles: true,
    muscleRecoveries,
    sorenessMap,
    goals: userProfile?.goals || [],
    goalWeights: {}, // Will be ML-optimized
    problems,
    problemWeight: 0.25, // 25% weight for problem-solving
    muscleCoverage,
    targetUndertrainedMuscles: true,
    favoriteExerciseIds: userProfile?.favoriteExerciseIds || [],
    avoidExerciseIds: userProfile?.avoidExerciseIds || [],
    preferenceWeight: 0.1,
    availableEquipment: userProfile?.availableEquipment || [],
    maxDuration: userProfile?.trainingSchedule?.timePerSession || 45,
    energyLevel: (checkin?.energyLevel as 'low' | 'normal' | 'high') || null,
    timeAvailable: (checkin?.timeAvailable as 'short' | 'normal' | 'long') || null,
    avoidRecentExercises: true,
    recentExerciseIds: allWorkouts.slice(0, 3).flatMap(w =>
      w.sets.map(s => s.exerciseId)
    ),
    daysSinceLastUse: 3,
    workoutType,
  };

  // Filter and score exercises using advanced multi-factor system
  let candidateExercises = exerciseCatalog as ExerciseWithMuscles[];

  // If PT-focused, prioritize problem exercises
  if (workoutType === 'pt' && problemExercises.length > 0) {
    // Mix problem exercises with regular exercises
    const problemExerciseIds = new Set(problemExercises.map(e => e.id));
    candidateExercises = [
      ...problemExercises,
      ...candidateExercises.filter(e => !problemExerciseIds.has(e.id))
    ];
  } else {
    // Filter by workout type category
    candidateExercises = candidateExercises.filter(
      (ex) => ex.category === workoutType
    );
  }

  // Advanced filtering and scoring
  const scoredExercises = filterAndScoreExercises(candidateExercises, filterParams);

  // Select top exercises based on duration
  const duration = filterParams.maxDuration;
  const exerciseCount = calculateExerciseCount(duration);
  const topExercises = scoredExercises.slice(0, exerciseCount);

  // Convert to recommended exercises with reasoning
  const recommendedExercises: RecommendedExercise[] = topExercises.map(
    (exercise, _index) => {
      const volume = calculateVolume(
        checkin?.energyLevel as 'low' | 'normal' | 'high' | null,
        checkin?.timeAvailable as 'short' | 'normal' | 'long' | null
      );

      // Build reasoning
      const reasoning: string[] = [];

      // Recovery reasoning
      for (const target of exercise.muscleTargets) {
        const recovery = muscleRecoveries.find((r) => r.muscleId === target.muscle.id);
        if (recovery?.isRecovered && recovery.hoursSinceStimulus && recovery.hoursSinceStimulus > 48) {
          reasoning.push(`${target.muscle.name} recovered (${Math.round(recovery.hoursSinceStimulus / 24)} days since last training)`);
        }
      }

      // Problem reasoning
      for (const problem of problems) {
        if (problem.affectedMuscles.some(m =>
          exercise.muscleTargets.some(t =>
            t.muscle.name.toLowerCase().includes(m.toLowerCase())
          )
        )) {
          reasoning.push(`Addresses ${problem.name}`);
        }
      }

      // Coverage reasoning
      const coverage = muscleCoverage.find(c =>
        exercise.muscleTargets.some(t => t.muscle.id === c.muscleId)
      );
      if (coverage?.isUndertrained) {
        reasoning.push(`Fills gap in ${coverage.muscleName} training`);
      }

      // Preference reasoning
      if (userProfile?.favoriteExerciseIds.includes(exercise.id)) {
        reasoning.push('Your favorite exercise');
      }

      if (reasoning.length === 0) {
        reasoning.push('Good exercise for today');
      }

      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        category: exercise.category,
        equipment: exercise.equipment || undefined,
        reasoning: reasoning.join('; '),
        priority: exercise.score,
        suggestedSets: volume.sets,
        suggestedReps: volume.reps,
      };
    }
  );

  // Build reasoning for recommendation
  const reasoning: string[] = [
    `Recommended ${workoutType} workout based on recovery status and goals`,
  ];

  if (checkin?.energyLevel) {
    reasoning.push(`Energy level: ${checkin.energyLevel}`);
  }

  if (checkin?.hoursSlept) {
    reasoning.push(`Slept ${checkin.hoursSlept} hours`);
  }

  const recoveredMuscles = muscleRecoveries.filter((r) => r.isRecovered);
  if (recoveredMuscles.length > 0) {
    reasoning.push(
      `${recoveredMuscles.length} muscle groups are recovered and ready`
    );
  }

  if (musclesNeedingAttention.length > 0) {
    reasoning.push(
      `${musclesNeedingAttention.length} muscles need attention (gaps or problems)`
    );
  }

  if (problems.length > 0) {
    reasoning.push(`Addressing ${problems.length} active problem(s)`);
  }

  // Calculate confidence
  let confidence = 0.7; // Base
  if (recommendedExercises.length >= exerciseCount) confidence += 0.1;
  if (checkin) confidence += 0.1;
  if (allWorkouts.length > 0) confidence += 0.1;
  if (userProfile) confidence += 0.1;

  // Extract ML features for future model training
  const mlFeatures = extractMLFeatures(
    checkin,
    allWorkouts,
    muscleRecoveries,
    muscleCoverage,
    userProfile,
    dayOfWeek
  );

  return {
    workoutType,
    exercises: recommendedExercises,
    reasoning,
    estimatedDuration: duration,
    confidence: Math.min(1, confidence),
    muscleCoverage: muscleCoverage.slice(0, 10), // Top 10 for display
    mlFeatures, // For ML model training
  };
}

