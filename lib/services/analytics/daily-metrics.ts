import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

type WorkoutWithSets = Prisma.WorkoutGetPayload<{
  include: {
    sets: {
      include: {
        exercise: {
          include: {
            muscleTargets: {
              include: {
                muscle: true,
              },
            },
          },
        },
      },
    },
  },
}>;

// Calculate total volume for a workout (sets × reps × weight)
export function calculateTotalVolume(workout: WorkoutWithSets): number {
  let totalVolume = 0;

  for (const set of workout.sets) {
    const weight = set.weight || 0;
    const reps = set.reps || 0;
    totalVolume += weight * reps;
  }

  return totalVolume;
}

// Calculate average intensity (simplified - using effort or RPE if available)
export function calculateAvgIntensity(workout: WorkoutWithSets): number | null {
  const efforts = workout.sets
    .map((set) => set.effort)
    .filter((effort): effort is string => effort !== null);

  if (efforts.length === 0) return null;

  // Convert effort to numeric (easy=1, normal=2, hard=3)
  const effortMap: Record<string, number> = {
    easy: 1,
    normal: 2,
    hard: 3,
  };

  const intensities = efforts.map((effort) => effortMap[effort.toLowerCase()] || 2);
  const avg = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;

  return avg;
}

// Extract muscle groups from workout
export function extractMuscleGroups(workout: WorkoutWithSets): string[] {
  const muscleGroups = new Set<string>();

  for (const set of workout.sets) {
    for (const target of set.exercise.muscleTargets) {
      muscleGroups.add(target.muscle.name);
    }
  }

  return Array.from(muscleGroups);
}

// Calculate average soreness from check-in
export function calculateAvgSoreness(
  sorenessMap: Record<string, number> | null
): number | null {
  if (!sorenessMap || Object.keys(sorenessMap).length === 0) {
    return null;
  }

  const values = Object.values(sorenessMap);
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// Calculate daily metrics for a specific date
export async function calculateDailyMetrics(
  userId: string,
  date: Date
): Promise<void> {
  // Normalize date to start of day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get workouts for the day
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      sets: {
        include: {
          exercise: {
            include: {
              muscleTargets: {
                include: {
                  muscle: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Get check-in for the day
  const checkin = await prisma.dailyCheckin.findUnique({
    where: {
      userId_date: {
        userId,
        date: startOfDay,
      },
    },
  });

  // Calculate metrics
  let totalVolume = 0;
  const intensities: number[] = [];
  const allMuscleGroups = new Set<string>();

  for (const workout of workouts) {
    const volume = calculateTotalVolume(workout as WorkoutWithSets);
    totalVolume += volume;

    const intensity = calculateAvgIntensity(workout as WorkoutWithSets);
    if (intensity !== null) {
      intensities.push(intensity);
    }

    const muscles = extractMuscleGroups(workout as WorkoutWithSets);
    muscles.forEach((muscle) => allMuscleGroups.add(muscle));
  }

  const avgIntensity =
    intensities.length > 0
      ? intensities.reduce((sum, val) => sum + val, 0) / intensities.length
      : null;

  const sorenessMap = checkin?.sorenessMap as Record<string, number> | null;
  const avgSoreness = calculateAvgSoreness(sorenessMap);

  // Upsert daily metrics
  await prisma.dailyMetrics.upsert({
    where: {
      userId_date: {
        userId,
        date: startOfDay,
      },
    },
    create: {
      userId,
      date: startOfDay,
      totalVolume: totalVolume > 0 ? totalVolume : null,
      avgIntensity,
      workoutCount: workouts.length,
      muscleGroupsHit:
        allMuscleGroups.size > 0 ? Array.from(allMuscleGroups) : null,
      avgSoreness,
      sleepHours: checkin?.hoursSlept ?? null,
      sleepQuality: checkin?.sleepQuality ?? null,
      energyLevel: checkin?.energyLevel ?? null,
    },
    update: {
      totalVolume: totalVolume > 0 ? totalVolume : null,
      avgIntensity,
      workoutCount: workouts.length,
      muscleGroupsHit:
        allMuscleGroups.size > 0 ? Array.from(allMuscleGroups) : null,
      avgSoreness,
      sleepHours: checkin?.hoursSlept ?? null,
      sleepQuality: checkin?.sleepQuality ?? null,
      energyLevel: checkin?.energyLevel ?? null,
    },
  });
}

// Calculate metrics for today
export async function calculateTodayMetrics(userId: string): Promise<void> {
  await calculateDailyMetrics(userId, new Date());
}

// Calculate metrics for a date range
export async function calculateMetricsForRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<void> {
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    await calculateDailyMetrics(userId, new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

