import { Exercise, Muscle } from '@prisma/client';
import { UserFitnessProfile, Problem, MuscleCoverage, EnergyLevel, TimeAvailable, SorenessMap, ExerciseWithMuscles } from './types';

export interface AdvancedFilterParams {
  // Recovery & Soreness
  excludeSoreMuscles: boolean; // Muscles with soreness >= 4
  preferRecoveredMuscles: boolean; // Prioritize recovered muscles
  muscleRecoveries: Array<{ muscleId: string; isRecovered: boolean; canTrain: boolean }>;
  sorenessMap: SorenessMap | null;

  // Goals
  goals: string[]; // Fitness goals
  goalWeights: Record<string, number>; // Weight per goal

  // Problems
  problems: Problem[]; // Active problems to address
  problemWeight: number; // How much to weight problem-solving exercises

  // Muscle Coverage
  muscleCoverage: MuscleCoverage[]; // Coverage analysis
  targetUndertrainedMuscles: boolean; // Fill gaps

  // Preferences
  favoriteExerciseIds: string[];
  avoidExerciseIds: string[];
  preferenceWeight: number; // How much to weight preferences

  // Constraints
  availableEquipment: string[];
  maxDuration: number;
  energyLevel: EnergyLevel | null;
  timeAvailable: TimeAvailable | null;

  // Variety
  avoidRecentExercises: boolean;
  recentExerciseIds: string[]; // Exercises used in last N days
  daysSinceLastUse: number; // Minimum days since last use

  // Workout Type
  workoutType?: string; // "push", "pull", "legs", "pt", etc.
}

// Multi-factor exercise scoring
export function scoreExerciseAdvanced(
  exercise: ExerciseWithMuscles,
  params: AdvancedFilterParams
): number {
  let score = 0.5; // Base score

  // 1. Recovery & Soreness (weight: 0.3)
  for (const target of exercise.muscleTargets) {
    const recovery = params.muscleRecoveries.find((r) => r.muscleId === target.muscle.id);

    if (!recovery) {
      // Muscle never trained - good candidate
      score += 0.1 * target.weight;
      continue;
    }

    if (!recovery.canTrain) {
      // Muscle can't be trained - reduce score
      score -= 0.2 * target.weight;
      continue;
    }

    if (recovery.isRecovered) {
      // Muscle is fully recovered - good candidate
      score += 0.15 * target.weight;
    }

    // Check soreness
    const soreness = params.sorenessMap?.[target.muscle.name];
    if (soreness !== undefined) {
      if (soreness >= 4) {
        score -= 0.3 * target.weight; // Severe soreness
      } else if (soreness === 3) {
        score -= 0.1 * target.weight; // Moderate soreness
      }
    }
  }

  // 2. Goals Alignment (weight: 0.2)
  if (params.goals.length > 0) {
    const goalScore = calculateGoalAlignment(exercise, params.goals, params.goalWeights);
    score += goalScore * 0.2;
  }

  // 3. Problem Addressing (weight: 0.25)
  if (params.problems.length > 0) {
    const problemScore = calculateProblemAlignment(exercise, params.problems);
    score += problemScore * params.problemWeight;
  }

  // 4. Muscle Coverage (weight: 0.15)
  if (params.targetUndertrainedMuscles) {
    const coverageScore = calculateCoverageAlignment(exercise, params.muscleCoverage);
    score += coverageScore * 0.15;
  }

  // 5. Preferences (weight: 0.1)
  if (params.favoriteExerciseIds.includes(exercise.id)) {
    score += 0.1 * params.preferenceWeight;
  }
  if (params.avoidExerciseIds.includes(exercise.id)) {
    score -= 0.2; // Strong penalty for avoided exercises
  }

  // 6. Equipment (weight: 0.05)
  if (exercise.equipment && params.availableEquipment.includes(exercise.equipment)) {
    score += 0.05;
  } else if (!exercise.equipment) {
    // Bodyweight exercises always available
    score += 0.05;
  } else {
    score -= 0.1; // Equipment not available
  }

  // 7. Variety (weight: 0.05)
  if (params.avoidRecentExercises && params.recentExerciseIds.includes(exercise.id)) {
    score -= 0.1; // Penalty for recent use
  }

  // 8. Workout Type Match (weight: 0.1)
  if (params.workoutType && exercise.category === params.workoutType) {
    score += 0.1;
  }

  // Normalize to 0-1 range
  return Math.max(0, Math.min(1, score));
}

// Calculate how well exercise aligns with goals
function calculateGoalAlignment(
  exercise: ExerciseWithMuscles,
  goals: string[],
  goalWeights: Record<string, number>
): number {
  let alignment = 0;

  // Strength goals: prefer compound, heavy exercises
  if (goals.includes('strength')) {
    const weight = goalWeights['strength'] || 1;
    if (exercise.category === 'push' || exercise.category === 'pull' || exercise.category === 'legs') {
      alignment += 0.3 * weight;
    }
  }

  // Hypertrophy: prefer moderate rep ranges, isolation exercises
  if (goals.includes('hypertrophy')) {
    const weight = goalWeights['hypertrophy'] || 1;
    alignment += 0.2 * weight; // Most exercises work for hypertrophy
  }

  // PT/Injury Prevention: prefer specific exercises
  if (goals.includes('pt') || goals.includes('injury_prevention')) {
    const weight = goalWeights['pt'] || goalWeights['injury_prevention'] || 1;
    if (exercise.category === 'pt') {
      alignment += 0.4 * weight;
    }
  }

  return Math.min(1, alignment);
}

// Calculate how well exercise addresses problems
function calculateProblemAlignment(
  exercise: ExerciseWithMuscles,
  problems: Problem[]
): number {
  let alignment = 0;

  for (const problem of problems) {
    if (!problem.isActive) continue;

    const affectedMuscles = problem.affectedMuscles.map((m) => m.toLowerCase());

    // Check if exercise targets affected muscles
    for (const target of exercise.muscleTargets) {
      const muscleName = target.muscle.name.toLowerCase();
      if (affectedMuscles.some((affected) => muscleName.includes(affected) || affected.includes(muscleName))) {
        alignment += 0.3 * target.weight * (problem.priority / 5); // Weight by problem priority
      }
    }

    // Check if exercise is specifically recommended
    if (problem.recommendedExerciseIds?.includes(exercise.id)) {
      alignment += 0.5 * (problem.priority / 5);
    }
  }

  return Math.min(1, alignment);
}

// Calculate how well exercise addresses muscle coverage gaps
function calculateCoverageAlignment(
  exercise: ExerciseWithMuscles,
  coverage: MuscleCoverage[]
): number {
  let alignment = 0;

  for (const target of exercise.muscleTargets) {
    const muscleCoverage = coverage.find((c) => c.muscleId === target.muscle.id);
    if (muscleCoverage && muscleCoverage.isUndertrained) {
      alignment += 0.4 * target.weight * muscleCoverage.priority;
    }
  }

  return Math.min(1, alignment);
}

// Filter exercises using advanced multi-factor scoring
export function filterAndScoreExercises(
  exercises: ExerciseWithMuscles[],
  params: AdvancedFilterParams
): Array<ExerciseWithMuscles & { score: number }> {
  // First, basic filtering (hard exclusions)
  let filtered = exercises.filter((exercise) => {
    // Exclude if targets severely sore muscles
    if (params.excludeSoreMuscles && params.sorenessMap) {
      for (const target of exercise.muscleTargets) {
        const soreness = params.sorenessMap[target.muscle.name];
        if (soreness !== undefined && soreness >= 4) {
          return false; // Exclude
        }
      }
    }

    // Exclude if equipment not available
    if (exercise.equipment && !params.availableEquipment.includes(exercise.equipment)) {
      return false;
    }

    // Exclude if in avoid list
    if (params.avoidExerciseIds.includes(exercise.id)) {
      return false;
    }

    return true;
  });

  // Score each exercise
  const scored = filtered.map((exercise) => ({
    ...exercise,
    score: scoreExerciseAdvanced(exercise, params),
  }));

  // Sort by score (highest first)
  return scored.sort((a, b) => b.score - a.score);
}

