// Muscle group constants and utilities

export const MUSCLE_GROUPS = {
  chest: 'chest',
  back: 'back',
  shoulders: 'shoulders',
  arms: 'arms',
  legs: 'legs',
  core: 'core',
} as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[keyof typeof MUSCLE_GROUPS];

export const MUSCLE_NAMES = {
  // Chest
  CHEST: 'Chest',
  // Back
  UPPER_BACK: 'Upper Back',
  LATS: 'Lats',
  LOWER_BACK: 'Lower Back',
  // Shoulders
  FRONT_DELTS: 'Front Delts',
  SIDE_DELTS: 'Side Delts',
  REAR_DELTS: 'Rear Delts',
  // Arms
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  // Legs
  QUADS: 'Quads',
  HAMSTRINGS: 'Hamstrings',
  GLUTES: 'Glutes',
  CALVES: 'Calves',
  // Core
  ABS: 'Abs',
} as const;

export function getMuscleGroup(muscleName: string): MuscleGroup | null {
  const name = muscleName.toLowerCase();
  
  if (name.includes('chest')) return MUSCLE_GROUPS.chest;
  if (name.includes('back') || name.includes('lat')) return MUSCLE_GROUPS.back;
  if (name.includes('delt') || name.includes('shoulder')) return MUSCLE_GROUPS.shoulders;
  if (name.includes('bicep') || name.includes('tricep')) return MUSCLE_GROUPS.arms;
  if (name.includes('quad') || name.includes('hamstring') || name.includes('glute') || name.includes('calve')) return MUSCLE_GROUPS.legs;
  if (name.includes('abs') || name.includes('core')) return MUSCLE_GROUPS.core;
  
  return null;
}


