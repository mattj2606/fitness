import { Workout, WorkoutSet, Exercise, Muscle } from '@prisma/client';
import { MuscleCoverage } from './types';
import { extractMuscleGroupsFromWorkout } from './recovery';

type WorkoutWithSets = Workout & {
  sets: (WorkoutSet & {
    exercise: Exercise & {
      muscleTargets: { muscle: Muscle; weight: number }[];
    };
  })[];
};

// Calculate muscle stimulus over a time window (in hours)
export function calculateMuscleStimulus(
  workouts: WorkoutWithSets[],
  hoursWindow: number
): Record<string, number> {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - hoursWindow * 60 * 60 * 1000);
  
  const muscleStimulus: Record<string, number> = {};
  
  for (const workout of workouts) {
    const workoutDate = new Date(workout.date);
    if (workoutDate < cutoffTime) continue; // Outside window
    
    const muscles = extractMuscleGroupsFromWorkout(workout);
    
    for (const muscle of muscles) {
      if (!muscleStimulus[muscle.muscleId]) {
        muscleStimulus[muscle.muscleId] = 0;
      }
      muscleStimulus[muscle.muscleId] += muscle.stimulus;
    }
  }
  
  return muscleStimulus;
}

// Analyze muscle coverage and identify gaps
export function analyzeMuscleCoverage(
  workouts: WorkoutWithSets[],
  allMuscles: Muscle[],
  lastStimulusDates: Record<string, Date>
): MuscleCoverage[] {
  const stimulus7Days = calculateMuscleStimulus(workouts, 7 * 24);
  const stimulus30Days = calculateMuscleStimulus(workouts, 30 * 24);
  
  // Calculate average stimulus per muscle group (for threshold)
  const avgStimulus30Days = Object.values(stimulus30Days).reduce((sum, val) => sum + val, 0) / Math.max(1, Object.keys(stimulus30Days).length);
  const threshold = avgStimulus30Days * 0.5; // 50% of average = undertrained
  
  const coverage: MuscleCoverage[] = [];
  
  for (const muscle of allMuscles) {
    const lastStimulus = lastStimulusDates[muscle.id] || null;
    const hoursSince = lastStimulus
      ? (new Date().getTime() - lastStimulus.getTime()) / (1000 * 60 * 60)
      : Infinity;
    
    const stimulus7 = stimulus7Days[muscle.id] || 0;
    const stimulus30 = stimulus30Days[muscle.id] || 0;
    
    const isUndertrained = stimulus30 < threshold || hoursSince > 7 * 24; // No stimulus in 7 days
    
    // Calculate priority (higher = more important to train)
    let priority = 0.5; // Base priority
    
    if (isUndertrained) {
      priority += 0.3; // Boost priority for undertrained muscles
    }
    
    if (hoursSince > 14 * 24) {
      priority += 0.2; // Boost if not trained in 2+ weeks
    }
    
    // Reduce priority if recently trained
    if (hoursSince < 48) {
      priority -= 0.3;
    }
    
    priority = Math.max(0, Math.min(1, priority)); // Clamp to 0-1
    
    coverage.push({
      muscleId: muscle.id,
      muscleName: muscle.name,
      lastStimulus,
      hoursSinceStimulus: hoursSince === Infinity ? 0 : hoursSince,
      stimulusLast7Days: stimulus7,
      stimulusLast30Days: stimulus30,
      isUndertrained,
      recommendedStimulus: threshold * 1.5, // Target 150% of threshold
      gap: Math.max(0, threshold * 1.5 - stimulus30),
      priority,
    });
  }
  
  // Sort by priority (highest first)
  return coverage.sort((a, b) => b.priority - a.priority);
}

// Get muscles that need attention (gaps, undertrained, problems)
export function getMusclesNeedingAttention(
  coverage: MuscleCoverage[],
  problems: { affectedMuscles: string[] }[]
): MuscleCoverage[] {
  const problemMuscles = new Set<string>();
  for (const problem of problems) {
    for (const muscle of problem.affectedMuscles) {
      problemMuscles.add(muscle.toLowerCase());
    }
  }
  
  return coverage.filter((muscle) => {
    // Include if undertrained
    if (muscle.isUndertrained) return true;
    
    // Include if mentioned in problems
    if (problemMuscles.has(muscle.muscleName.toLowerCase())) return true;
    
    // Include if high priority
    if (muscle.priority > 0.7) return true;
    
    return false;
  });
}

