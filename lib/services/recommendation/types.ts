import { DailyCheckin, Exercise, Workout, Muscle } from '@prisma/client';

export type WorkoutType = 'push' | 'pull' | 'legs' | 'full' | 'rest' | 'pt';

export type EnergyLevel = 'low' | 'normal' | 'high';

export type TimeAvailable = 'short' | 'normal' | 'long';

export interface SorenessMap {
  [muscleName: string]: number; // 0-5 scale
}

export interface ExerciseWithMuscles extends Exercise {
  muscleTargets: { muscle: Muscle; weight: number }[];
}

export interface RecommendedExercise {
  exerciseId: string;
  exerciseName: string;
  category: string;
  equipment?: string;
  reasoning: string;
  priority: number; // 0-1, higher = more important
  suggestedSets?: number;
  suggestedReps?: number;
}

export interface RecommendationInput {
  checkin: DailyCheckin | null;
  allWorkouts: (Workout & { sets: { exerciseId: string; exercise: Exercise }[] })[];
  exerciseCatalog: (Exercise & { muscleTargets: { muscle: Muscle; weight: number }[] })[];
  userProfile?: UserFitnessProfile;
  dayOfWeek?: number; // 0-6, Sunday = 0
}

export interface RecommendationOutput {
  workoutType: WorkoutType;
  exercises: RecommendedExercise[];
  reasoning: string[];
  estimatedDuration: number; // minutes
  confidence: number; // 0-1, how confident we are in this recommendation
}

export interface MuscleRecoveryStatus {
  muscleId: string;
  muscleName: string;
  lastStimulus: Date | null;
  daysSinceStimulus: number;
  hoursSinceStimulus?: number; // More precise than days
  recoveryUntil: Date | null;
  isRecovered: boolean;
  sorenessLevel: number | null; // 0-5 from check-in
  canTrain: boolean; // true if muscle can be trained today
  recommendedIntensity: 'low' | 'normal' | 'high'; // based on recovery status
}

export interface MuscleCoverage {
  muscleId: string;
  muscleName: string;
  lastStimulus: Date | null;
  hoursSinceStimulus: number;
  stimulusLast7Days: number; // Total volume in last 7 days
  stimulusLast30Days: number; // Total volume in last 30 days
  isUndertrained: boolean; // Below threshold
  recommendedStimulus: number; // Target volume
  gap: number; // Difference between current and target
  priority: number; // 0-1, higher = more important to train
}

export type FitnessGoal = 'strength' | 'hypertrophy' | 'endurance' | 'pt' | 'injury_prevention' | 'athletic_performance' | 'general_fitness';

export type SplitType = 'push_pull_legs' | 'upper_lower' | 'full_body' | 'pt_focused' | 'custom';

export interface Problem {
  id?: string;
  type: 'injury' | 'condition' | 'imbalance' | 'weakness';
  name: string; // "wrist pain", "TMS", "lower back pain"
  description?: string;
  affectedMuscles: string[]; // Muscle names that need attention
  recommendedExerciseIds?: string[]; // Exercise IDs
  priority: number; // 1-5, higher = more urgent
  isActive: boolean;
}

export interface UserFitnessProfile {
  goals: FitnessGoal[];
  problems: Problem[];
  preferredSplits: SplitType[];
  favoriteExerciseIds: string[];
  avoidExerciseIds: string[];
  availableEquipment: string[];
  trainingSchedule?: {
    daysPerWeek: number;
    preferredDays?: number[]; // 0-6, Sunday = 0
    timePerSession: number; // minutes
  };
}

export interface ExerciseFilter {
  excludeMuscles?: string[]; // Muscle names to exclude
  includeCategories?: string[]; // Exercise categories to include
  excludeCategories?: string[]; // Exercise categories to exclude
  availableEquipment?: string[]; // Equipment available
  maxDuration?: number; // Maximum workout duration in minutes
  energyLevel?: EnergyLevel;
  timeAvailable?: TimeAvailable;
}

