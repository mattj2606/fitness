import { Exercise, Muscle } from '@prisma/client';
import { MuscleRecoveryStatus, RecommendedExercise } from './types';

export interface ExerciseWithMuscles extends Exercise {
  muscleTargets: { muscle: Muscle; weight: number }[];
}

// Score an exercise based on recovery status and other factors
export function scoreExercise(
  exercise: ExerciseWithMuscles,
  muscleRecoveries: MuscleRecoveryStatus[],
  lastWorkoutType?: string
): number {
  let score = 0.5; // Base score
  
  // Check muscle recovery status
  for (const target of exercise.muscleTargets) {
    const recovery = muscleRecoveries.find(
      (r) => r.muscleId === target.muscle.id
    );
    
    if (!recovery) {
      // Muscle never trained - good candidate
      score += 0.2 * target.weight;
      continue;
    }
    
    if (!recovery.canTrain) {
      // Muscle can't be trained - reduce score
      score -= 0.3 * target.weight;
      continue;
    }
    
    if (recovery.isRecovered) {
      // Muscle is fully recovered - good candidate
      score += 0.3 * target.weight;
      
      // Bonus if it's been a while since last stimulus
      if (recovery.daysSinceStimulus > 3) {
        score += 0.2 * target.weight;
      }
    } else {
      // Muscle is still recovering - reduce score
      score -= 0.2 * target.weight;
    }
    
    // Adjust based on recommended intensity
    if (recovery.recommendedIntensity === 'low') {
      score -= 0.1 * target.weight;
    } else if (recovery.recommendedIntensity === 'high') {
      score += 0.1 * target.weight;
    }
  }
  
  // Variety bonus: prefer different category than last workout
  if (lastWorkoutType && exercise.category !== lastWorkoutType) {
    score += 0.1;
  }
  
  // Normalize score to 0-1 range
  return Math.max(0, Math.min(1, score));
}

// Rank exercises by score
export function rankExercises(
  exercises: ExerciseWithMuscles[],
  muscleRecoveries: MuscleRecoveryStatus[],
  lastWorkoutType?: string
): Array<ExerciseWithMuscles & { score: number }> {
  return exercises
    .map((exercise) => ({
      ...exercise,
      score: scoreExercise(exercise, muscleRecoveries, lastWorkoutType),
    }))
    .sort((a, b) => b.score - a.score);
}

// Convert scored exercise to recommended exercise
export function toRecommendedExercise(
  exercise: ExerciseWithMuscles & { score: number },
  muscleRecoveries: MuscleRecoveryStatus[]
): RecommendedExercise {
  const reasoning: string[] = [];
  
  // Build reasoning based on recovery status
  for (const target of exercise.muscleTargets) {
    const recovery = muscleRecoveries.find(
      (r) => r.muscleId === target.muscle.id
    );
    
    if (!recovery) {
      reasoning.push(`${target.muscle.name} hasn't been trained recently`);
    } else if (recovery.isRecovered && recovery.daysSinceStimulus > 3) {
      reasoning.push(`${target.muscle.name} is recovered and ready (${recovery.daysSinceStimulus} days since last training)`);
    } else if (recovery.isRecovered) {
      reasoning.push(`${target.muscle.name} is recovered`);
    } else if (recovery.canTrain) {
      reasoning.push(`${target.muscle.name} can handle light work`);
    }
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
  };
}

