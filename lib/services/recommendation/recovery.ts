import { Muscle, Workout, WorkoutSet, Exercise } from '@prisma/client';
import { MuscleRecoveryStatus, SorenessMap } from './types';

// Recovery times in hours for different muscle group sizes
const MUSCLE_RECOVERY_TIMES: Record<string, number> = {
  // Small muscle groups: 24-48 hours
  biceps: 36,
  triceps: 36,
  calves: 36,
  forearms: 24,

  // Medium muscle groups: 48-72 hours
  shoulders: 60,
  traps: 48,
  abs: 24,

  // Large muscle groups: 72-96 hours
  chest: 72,
  back: 72,
  lats: 72,
  quads: 84,
  hamstrings: 84,
  glutes: 84,

  // Default for unknown muscles
  default: 48,
};

// Get recovery time for a muscle group
export function getRecoveryTime(muscleName: string): number {
  const normalized = muscleName.toLowerCase();
  return MUSCLE_RECOVERY_TIMES[normalized] ?? MUSCLE_RECOVERY_TIMES['default'] ?? 48;
}

// Calculate days since last stimulus for a muscle
export function calculateDaysSinceStimulus(
  lastStimulus: Date | null
): number {
  if (!lastStimulus) return Infinity; // Never trained

  const now = new Date();
  const diff = now.getTime() - lastStimulus.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Calculate recovery status for a muscle
export function calculateMuscleRecovery(
  muscle: Muscle,
  lastStimulus: Date | null,
  sorenessMap: SorenessMap | null
): MuscleRecoveryStatus {
  const recoveryHours = getRecoveryTime(muscle.name);
  const daysSince = calculateDaysSinceStimulus(lastStimulus);
  const recoveryDays = recoveryHours / 24;

  const sorenessLevel = sorenessMap?.[muscle.name] ?? null;

  // Calculate recovery until date
  let recoveryUntil: Date | null = null;
  if (lastStimulus) {
    recoveryUntil = new Date(lastStimulus);
    recoveryUntil.setHours(recoveryUntil.getHours() + recoveryHours);
  }

  // Determine if muscle can be trained
  let canTrain = true;
  let recommendedIntensity: 'low' | 'normal' | 'high' = 'normal';

  // Soreness-based exclusions
  if (sorenessLevel !== null) {
    if (sorenessLevel >= 4) {
      canTrain = false; // Severe soreness - rest
    } else if (sorenessLevel >= 3) {
      canTrain = true;
      recommendedIntensity = 'low'; // Moderate soreness - light work
    } else if (sorenessLevel === 2) {
      canTrain = true;
      recommendedIntensity = 'normal'; // Mild soreness - normal work
    }
  }

  // Recovery time-based logic
  if (lastStimulus && daysSince < recoveryDays) {
    // Still in recovery window
    const recoveryProgress = daysSince / recoveryDays;
    if (recoveryProgress < 0.5) {
      // Less than 50% recovered
      canTrain = false;
    } else if (recoveryProgress < 0.75) {
      // 50-75% recovered
      canTrain = true;
      recommendedIntensity = 'low';
    }
  }

  const isRecovered = !lastStimulus || daysSince >= recoveryDays;

  return {
    muscleId: muscle.id,
    muscleName: muscle.name,
    lastStimulus,
    daysSinceStimulus: daysSince,
    recoveryUntil,
    isRecovered,
    sorenessLevel,
    canTrain,
    recommendedIntensity,
  };
}

// Extract muscle groups from a workout
export function extractMuscleGroupsFromWorkout(
  workout: Workout & { sets: (WorkoutSet & { exercise: Exercise & { muscleTargets: { muscle: Muscle; weight: number }[] } })[] }
): { muscleId: string; muscleName: string; stimulus: number }[] {
  const muscleStimulus: Record<string, { muscleId: string; muscleName: string; stimulus: number }> = {};

  for (const set of workout.sets) {
    const exercise = set.exercise;
    if (!exercise.muscleTargets) continue;

    for (const target of exercise.muscleTargets) {
      const muscle = target.muscle;
      const weight = set.weight || 0;
      const reps = set.reps || 0;
      const volume = weight * reps * target.weight; // Weighted volume

      if (!muscleStimulus[muscle.id]) {
        muscleStimulus[muscle.id] = {
          muscleId: muscle.id,
          muscleName: muscle.name,
          stimulus: 0,
        };
      }

      muscleStimulus[muscle.id]!.stimulus += volume;
    }
  }

  return Object.values(muscleStimulus);
}

// Find last stimulus date for each muscle from ALL workout history (time-based, not count-based)
export function findLastStimulusDates(
  workouts: (Workout & { sets: (WorkoutSet & { exercise: Exercise & { muscleTargets: { muscle: Muscle; weight: number }[] } })[] })[]
): Record<string, Date> {
  const lastStimulus: Record<string, Date> = {};

  // Process ALL workouts, not just last 10
  // This is time-based - we look at hours since stimulus, not workout count
  for (const workout of workouts) {
    const muscles = extractMuscleGroupsFromWorkout(workout);

    for (const muscle of muscles) {
      if (muscle.stimulus > 0) {
        // Only count if there was actual stimulus
        const workoutDate = new Date(workout.date);
        // Use the most recent stimulus date for each muscle
        if (!lastStimulus[muscle.muscleId] || workoutDate > lastStimulus[muscle.muscleId]!) {
          lastStimulus[muscle.muscleId] = workoutDate;
        }
      }
    }
  }

  return lastStimulus;
}

// Calculate hours since last stimulus (more precise than days)
export function calculateHoursSinceStimulus(
  lastStimulus: Date | null
): number {
  if (!lastStimulus) return Infinity; // Never trained

  const now = new Date();
  const diff = now.getTime() - lastStimulus.getTime();
  return diff / (1000 * 60 * 60); // Convert to hours
}

// Updated recovery calculation using hours instead of days
export function calculateMuscleRecoveryHours(
  muscle: Muscle,
  lastStimulus: Date | null,
  sorenessMap: SorenessMap | null
): MuscleRecoveryStatus {
  const recoveryHours = getRecoveryTime(muscle.name);
  const hoursSince = calculateHoursSinceStimulus(lastStimulus);
  const daysSince = hoursSince / 24;


  const sorenessLevel = sorenessMap?.[muscle.name] ?? null;

  // Calculate recovery until date
  let recoveryUntil: Date | null = null;
  if (lastStimulus) {
    recoveryUntil = new Date(lastStimulus);
    recoveryUntil.setHours(recoveryUntil.getHours() + recoveryHours);
  }

  // Determine if muscle can be trained
  let canTrain = true;
  let recommendedIntensity: 'low' | 'normal' | 'high' = 'normal';

  // Soreness-based exclusions
  if (sorenessLevel !== null) {
    if (sorenessLevel >= 4) {
      canTrain = false; // Severe soreness - rest
    } else if (sorenessLevel >= 3) {
      canTrain = true;
      recommendedIntensity = 'low'; // Moderate soreness - light work
    } else if (sorenessLevel === 2) {
      canTrain = true;
      recommendedIntensity = 'normal'; // Mild soreness - normal work
    }
  }

  // Recovery time-based logic (using hours for precision)
  if (lastStimulus && hoursSince < recoveryHours) {
    // Still in recovery window
    const recoveryProgress = hoursSince / recoveryHours;
    if (recoveryProgress < 0.5) {
      // Less than 50% recovered
      canTrain = false;
    } else if (recoveryProgress < 0.75) {
      // 50-75% recovered
      canTrain = true;
      recommendedIntensity = 'low';
    }
  }

  const isRecovered = !lastStimulus || hoursSince >= recoveryHours;

  return {
    muscleId: muscle.id,
    muscleName: muscle.name,
    lastStimulus,
    daysSinceStimulus: daysSince,
    hoursSinceStimulus: hoursSince, // More precise than days
    recoveryUntil,
    isRecovered,
    sorenessLevel,
    canTrain,
    recommendedIntensity,
  };
}
