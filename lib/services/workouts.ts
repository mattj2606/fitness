import { prisma } from '@/lib/db/prisma';

export type WorkoutType = 'push' | 'pull' | 'legs' | 'full' | 'rest' | 'pt';

export type CreateWorkoutInput = {
    userId: string;
    type: WorkoutType | string; // loose typing to allow strings, but ideally specific
    notes?: string;
    duration?: number;
};

export type UpdateWorkoutInput = {
    workoutId: string;
    notes?: string;
    duration?: number;
    endTime?: Date;
};

export type LogSetInput = {
    workoutId: string;
    exerciseId: string;
    setNumber: number;
    weight: number;
    reps: number;
    effort?: string; // RPE or "easy"/"hard"
    restSeconds?: number;
    notes?: string;
};

/**
 * Creates a new active workout session
 */
export async function createWorkout(input: CreateWorkoutInput) {
    return prisma.workout.create({
        data: {
            userId: input.userId,
            type: input.type,
            notes: input.notes,
            duration: input.duration || 0,
            date: new Date(), // Sets start time
        },
    });
}

/**
 * Updates a workout (e.g., finishing it, adding duration)
 */
export async function updateWorkout(input: UpdateWorkoutInput) {
    return prisma.workout.update({
        where: { id: input.workoutId },
        data: {
            notes: input.notes,
            duration: input.duration,
            // If we had an 'endedAt' field, we'd set it here.
            // For now, duration updates imply completion or progress.
        },
    });
}

/**
 * Logs a completed set for an exercise
 */
export async function logSet(input: LogSetInput) {
    return prisma.workoutSet.create({
        data: {
            workoutId: input.workoutId,
            exerciseId: input.exerciseId,
            setNumber: input.setNumber,
            weight: input.weight,
            reps: input.reps,
            effort: input.effort,
            restSeconds: input.restSeconds,
            notes: input.notes,
        },
    });
}

/**
 * Retrieves a single workout with all details
 */
export async function getWorkoutDetails(workoutId: string) {
    return prisma.workout.findUnique({
        where: { id: workoutId },
        include: {
            sets: {
                include: {
                    exercise: true,
                },
                orderBy: {
                    setNumber: 'asc',
                },
            },
        },
    });
}

/**
 * Retrieves workout history for a user
 */
export async function getWorkoutHistory(userId: string, limit = 10) {
    return prisma.workout.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: limit,
        include: {
            _count: {
                select: { sets: true },
            },
        },
    });
}

/**
 * Delete a workout
 */
export async function deleteWorkout(workoutId: string) {
    return prisma.workout.delete({
        where: { id: workoutId },
    });
}
