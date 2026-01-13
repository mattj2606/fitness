/**
 * ML-Ready Architecture
 * 
 * This file defines interfaces and utilities that make the recommendation engine
 * ready for ML/AI integration. The current rule-based system provides features
 * that ML models will use for training and prediction.
 */

import { Exercise, Muscle, Workout, DailyCheckin } from '@prisma/client';
import { UserFitnessProfile, Problem, MuscleCoverage, MuscleRecoveryStatus } from './types';

/**
 * Feature Vector for ML Models
 * 
 * This is what we'll feed into ML models for training and prediction.
 * All features are extracted from the rule-based system.
 */
export interface MLFeatureVector {
  // Recovery Features
  muscleRecoveries: Array<{
    muscleId: string;
    hoursSinceStimulus: number;
    isRecovered: boolean;
    sorenessLevel: number | null;
    canTrain: boolean;
  }>;
  
  // Check-in Features
  checkin: {
    hoursSlept: number | null;
    sleepQuality: number | null;
    energyLevel: 'low' | 'normal' | 'high' | null;
    avgSoreness: number | null;
    timeAvailable: 'short' | 'normal' | 'long' | null;
  };
  
  // Coverage Features
  muscleCoverage: MuscleCoverage[];
  undertrainedMuscleCount: number;
  avgStimulusLast7Days: number;
  avgStimulusLast30Days: number;
  
  // Goal Features
  goals: string[];
  goalWeights: Record<string, number>;
  
  // Problem Features
  problems: Array<{
    type: string;
    priority: number;
    affectedMuscleCount: number;
  }>;
  activeProblemCount: number;
  highPriorityProblemCount: number;
  
  // History Features
  workoutCountLast7Days: number;
  workoutCountLast30Days: number;
  lastWorkoutType: string | null;
  hoursSinceLastWorkout: number;
  
  // Temporal Features
  dayOfWeek: number;
  hourOfDay: number;
  
  // User Profile Features
  preferredSplits: string[];
  availableEquipment: string[];
  favoriteExerciseCount: number;
  avoidExerciseCount: number;
}

/**
 * ML Model Predictions
 * 
 * What ML models will output
 */
export interface MLPredictions {
  // Recovery Predictions
  personalRecoveryTimes: Record<string, number>; // Muscle ID -> hours
  recoveryConfidence: Record<string, number>; // 0-1
  
  // Exercise Predictions
  exerciseEffectiveness: Record<string, number>; // Exercise ID -> score (0-1)
  exerciseConfidence: Record<string, number>; // 0-1
  
  // Workout Type Prediction
  workoutTypeProbabilities: Record<string, number>; // Workout type -> probability
  recommendedWorkoutType: string;
  
  // Volume/Intensity Predictions
  optimalSets: number;
  optimalReps: number;
  optimalIntensity: number; // RPE or %1RM
  
  // Problem Solutions
  problemExerciseMatches: Record<string, string[]>; // Problem ID -> Exercise IDs
  
  // Goal Achievement
  goalProgressPredictions: Record<string, number>; // Goal -> progress score (0-1)
}

/**
 * Training Data Structure
 * 
 * Format for training ML models
 */
export interface MLTrainingData {
  input: MLFeatureVector;
  output: {
    workoutType: string;
    exercises: string[]; // Exercise IDs
    sets: number[];
    reps: number[];
    actualOutcome: {
      completed: boolean;
      feedback: 'positive' | 'negative' | null;
      progress: number | null; // Strength gain, volume increase, etc.
    };
  };
  timestamp: Date;
}

/**
 * Extract features from current system state
 * 
 * This converts rule-based system data into ML-ready features
 */
export function extractMLFeatures(
  checkin: DailyCheckin | null,
  workouts: Workout[],
  muscleRecoveries: MuscleRecoveryStatus[],
  muscleCoverage: MuscleCoverage[],
  userProfile: UserFitnessProfile | undefined,
  dayOfWeek: number
): MLFeatureVector {
  const now = new Date();
  
  // Calculate workout history
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const workoutsLast7Days = workouts.filter(w => new Date(w.date) >= last7Days);
  const workoutsLast30Days = workouts.filter(w => new Date(w.date) >= last30Days);
  
  const lastWorkout = workouts[0];
  const hoursSinceLastWorkout = lastWorkout
    ? (now.getTime() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60)
    : Infinity;
  
  // Calculate average soreness
  const sorenessMap = checkin?.sorenessMap as Record<string, number> | null;
  const avgSoreness = sorenessMap
    ? Object.values(sorenessMap).reduce((sum, val) => sum + val, 0) / Object.values(sorenessMap).length
    : null;
  
  // Calculate coverage stats
  const undertrainedMuscles = muscleCoverage.filter(c => c.isUndertrained);
  const avgStimulus7 = muscleCoverage.length > 0
    ? muscleCoverage.reduce((sum, c) => sum + c.stimulusLast7Days, 0) / muscleCoverage.length
    : 0;
  const avgStimulus30 = muscleCoverage.length > 0
    ? muscleCoverage.reduce((sum, c) => sum + c.stimulusLast30Days, 0) / muscleCoverage.length
    : 0;
  
  // Problem stats
  const activeProblems = userProfile?.problems.filter(p => p.isActive !== false) || [];
  const highPriorityProblems = activeProblems.filter(p => p.priority >= 4);
  
  return {
    muscleRecoveries: muscleRecoveries.map(r => ({
      muscleId: r.muscleId,
      hoursSinceStimulus: r.hoursSinceStimulus || r.daysSinceStimulus * 24,
      isRecovered: r.isRecovered,
      sorenessLevel: r.sorenessLevel,
      canTrain: r.canTrain,
    })),
    checkin: {
      hoursSlept: checkin?.hoursSlept ?? null,
      sleepQuality: checkin?.sleepQuality ?? null,
      energyLevel: (checkin?.energyLevel as 'low' | 'normal' | 'high') || null,
      avgSoreness,
      timeAvailable: (checkin?.timeAvailable as 'short' | 'normal' | 'long') || null,
    },
    muscleCoverage,
    undertrainedMuscleCount: undertrainedMuscles.length,
    avgStimulusLast7Days: avgStimulus7,
    avgStimulusLast30Days: avgStimulus30,
    goals: userProfile?.goals || [],
    goalWeights: {}, // Will be learned by ML
    problems: activeProblems.map(p => ({
      type: p.type,
      priority: p.priority,
      affectedMuscleCount: p.affectedMuscles.length,
    })),
    activeProblemCount: activeProblems.length,
    highPriorityProblemCount: highPriorityProblems.length,
    workoutCountLast7Days: workoutsLast7Days.length,
    workoutCountLast30Days: workoutsLast30Days.length,
    lastWorkoutType: lastWorkout?.type || null,
    hoursSinceLastWorkout: hoursSinceLastWorkout === Infinity ? 0 : hoursSinceLastWorkout,
    dayOfWeek,
    hourOfDay: now.getHours(),
    preferredSplits: userProfile?.preferredSplits || [],
    availableEquipment: userProfile?.availableEquipment || [],
    favoriteExerciseCount: userProfile?.favoriteExerciseIds?.length || 0,
    avoidExerciseCount: userProfile?.avoidExerciseIds?.length || 0,
  };
}

/**
 * Prepare training data from workout history
 * 
 * This will be used to train ML models
 */
export function prepareTrainingData(
  workouts: Workout[],
  recommendations: any[], // Historical recommendations
  checkins: DailyCheckin[],
  muscleRecoveriesHistory: any[],
  muscleCoverageHistory: any[]
): MLTrainingData[] {
  // This will be implemented when we have enough data
  // For now, returns empty array
  return [];
}

/**
 * ML Model Interface
 * 
 * All ML models will implement this interface
 */
export interface MLModel {
  name: string;
  version: string;
  predict(features: MLFeatureVector): MLPredictions;
  train(trainingData: MLTrainingData[]): void;
  save(path: string): void;
  load(path: string): void;
}

/**
 * Model Registry
 * 
 * Manages all ML models
 */
export class ModelRegistry {
  private models: Map<string, MLModel> = new Map();
  
  register(model: MLModel): void {
    this.models.set(model.name, model);
  }
  
  get(name: string): MLModel | undefined {
    return this.models.get(name);
  }
  
  getAll(): MLModel[] {
    return Array.from(this.models.values());
  }
}

// Global model registry
export const modelRegistry = new ModelRegistry();

