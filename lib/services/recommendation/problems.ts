import { Exercise, Muscle } from '@prisma/client';
import { Problem } from './types';

type ExerciseWithMuscles = Exercise & {
  muscleTargets: { muscle: Muscle; weight: number }[];
};

// Find exercises that address a problem
export function getExercisesForProblem(
  problem: Problem,
  exerciseCatalog: ExerciseWithMuscles[]
): ExerciseWithMuscles[] {
  const affectedMuscles = problem.affectedMuscles.map((m) => m.toLowerCase());
  
  // If problem has specific recommended exercises, use those
  if (problem.recommendedExerciseIds && problem.recommendedExerciseIds.length > 0) {
    return exerciseCatalog.filter((ex) =>
      problem.recommendedExerciseIds!.includes(ex.id)
    );
  }
  
  // Otherwise, find exercises that target affected muscles
  return exerciseCatalog.filter((exercise) => {
    return exercise.muscleTargets.some((target) => {
      const muscleName = target.muscle.name.toLowerCase();
      return affectedMuscles.some((affected) =>
        muscleName.includes(affected) || affected.includes(muscleName)
      );
    });
  });
}

// Get all exercises for all active problems
export function getAllProblemExercises(
  problems: Problem[],
  exerciseCatalog: ExerciseWithMuscles[]
): ExerciseWithMuscles[] {
  const activeProblems = problems.filter((p) => p.isActive !== false);
  const exerciseSet = new Set<string>();
  
  for (const problem of activeProblems) {
    const exercises = getExercisesForProblem(problem, exerciseCatalog);
    for (const exercise of exercises) {
      exerciseSet.add(exercise.id);
    }
  }
  
  return exerciseCatalog.filter((ex) => exerciseSet.has(ex.id));
}

// Example problem definitions (can be expanded)
export const PROBLEM_EXAMPLES: Record<string, Partial<Problem>> = {
  wrist_pain: {
    type: 'injury',
    name: 'Wrist Pain',
    affectedMuscles: ['forearms', 'wrists'],
    priority: 4,
  },
  tms: {
    type: 'condition',
    name: 'TMS (Temporomandibular Joint Syndrome)',
    affectedMuscles: ['neck', 'shoulders', 'jaw', 'upper back'],
    priority: 4,
  },
  lower_back_pain: {
    type: 'injury',
    name: 'Lower Back Pain',
    affectedMuscles: ['lower back', 'core', 'glutes', 'hip flexors'],
    priority: 5,
  },
  forearm_weakness: {
    type: 'weakness',
    name: 'Forearm Weakness',
    affectedMuscles: ['forearms'],
    priority: 3,
  },
};

// Create problem from description (simple keyword matching for now)
export function createProblemFromDescription(
  description: string
): Partial<Problem> | null {
  const lower = description.toLowerCase();
  
  // Check for known problems
  for (const [key, problem] of Object.entries(PROBLEM_EXAMPLES)) {
    if (lower.includes(key.replace('_', ' ')) || lower.includes(problem.name!.toLowerCase())) {
      return { ...problem, description };
    }
  }
  
  // Keyword matching
  if (lower.includes('wrist') && (lower.includes('pain') || lower.includes('crack'))) {
    return {
      type: 'injury',
      name: 'Wrist Issue',
      description,
      affectedMuscles: ['forearms', 'wrists'],
      priority: 4,
    };
  }
  
  if (lower.includes('forearm')) {
    return {
      type: 'weakness',
      name: 'Forearm Focus',
      description,
      affectedMuscles: ['forearms'],
      priority: 3,
    };
  }
  
  return null;
}

