// import { Exercise, Muscle } from '@prisma/client';
import { ExerciseFilter, EnergyLevel, TimeAvailable, SorenessMap, ExerciseWithMuscles } from './types';

// Filter exercises based on various criteria
export function filterExercises(
  exercises: ExerciseWithMuscles[],
  filter: ExerciseFilter
): ExerciseWithMuscles[] {
  let filtered = [...exercises];

  // Exclude exercises that target sore/excluded muscles
  if (filter.excludeMuscles && filter.excludeMuscles.length > 0) {
    filtered = filtered.filter((exercise) => {
      const targetsMuscle = exercise.muscleTargets.some(
        (target) => filter.excludeMuscles!.includes(target.muscle.name)
      );
      return !targetsMuscle;
    });
  }

  // Include only specific categories
  if (filter.includeCategories && filter.includeCategories.length > 0) {
    filtered = filtered.filter((exercise) =>
      filter.includeCategories!.includes(exercise.category)
    );
  }

  // Exclude specific categories
  if (filter.excludeCategories && filter.excludeCategories.length > 0) {
    filtered = filtered.filter(
      (exercise) => !filter.excludeCategories!.includes(exercise.category)
    );
  }

  // Filter by available equipment
  if (filter.availableEquipment && filter.availableEquipment.length > 0) {
    filtered = filtered.filter((exercise) => {
      if (!exercise.equipment) return true; // Bodyweight exercises
      return filter.availableEquipment!.includes(exercise.equipment);
    });
  }

  return filtered;
}

// Determine workout duration based on time available and energy
export function calculateWorkoutDuration(
  timeAvailable: TimeAvailable | null | undefined,
  energyLevel: EnergyLevel | null | undefined
): number {
  // Base duration by time available
  let duration = 45; // Default

  if (timeAvailable === 'short') {
    duration = 30;
  } else if (timeAvailable === 'normal') {
    duration = 45;
  } else if (timeAvailable === 'long') {
    duration = 60;
  }

  // Adjust based on energy
  if (energyLevel === 'low') {
    duration = Math.max(20, duration * 0.7); // Reduce by 30%
  } else if (energyLevel === 'high') {
    duration = Math.min(90, duration * 1.2); // Increase by 20%
  }

  return Math.round(duration);
}

// Determine number of exercises based on duration
export function calculateExerciseCount(duration: number): number {
  // Assume ~10 minutes per exercise (including rest)
  return Math.max(3, Math.min(8, Math.round(duration / 10)));
}

// Determine sets and reps based on energy and time
export function calculateVolume(
  energyLevel: EnergyLevel | null | undefined,
  timeAvailable: TimeAvailable | null | undefined
): { sets: number; reps: number } {
  let sets = 3;
  let reps = 10;

  // Adjust based on energy
  if (energyLevel === 'low') {
    sets = 2;
    reps = 8;
  } else if (energyLevel === 'high') {
    sets = 4;
    reps = 12;
  }

  // Adjust based on time
  if (timeAvailable === 'short') {
    sets = Math.max(2, sets - 1);
    reps = Math.max(8, reps - 2);
  } else if (timeAvailable === 'long') {
    sets = sets + 1;
    reps = reps + 2;
  }

  return { sets, reps };
}

// Build filter from check-in and preferences
export function buildFilterFromCheckin(
  sorenessMap: SorenessMap | null,
  energyLevel: EnergyLevel | null | undefined,
  timeAvailable: TimeAvailable | null | undefined,
  availableEquipment?: string[]
): ExerciseFilter {
  const excludeMuscles: string[] = [];

  // Exclude muscles with severe soreness (>= 4)
  if (sorenessMap) {
    for (const [muscle, soreness] of Object.entries(sorenessMap)) {
      if (soreness >= 4) {
        excludeMuscles.push(muscle);
      }
    }
  }

  return {
    excludeMuscles: excludeMuscles.length > 0 ? excludeMuscles : undefined,
    availableEquipment,
    energyLevel: energyLevel || undefined,
    timeAvailable: timeAvailable || undefined,
    maxDuration: calculateWorkoutDuration(timeAvailable, energyLevel),
  };
}

