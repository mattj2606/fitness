import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createWorkout, getWorkoutHistory } from '@/lib/services/workouts';
import { z } from 'zod';

const createWorkoutSchema = z.object({
    type: z.string().min(1),
    notes: z.string().optional(),
    duration: z.number().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = createWorkoutSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const workout = await createWorkout({
            userId: session.userId,
            ...result.data,
        });

        return NextResponse.json(workout, { status: 201 });
    } catch (error) {
        console.error('Error creating workout:', error);
        return NextResponse.json(
            { error: 'Failed to create workout' },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workouts = await getWorkoutHistory(session.userId);
        return NextResponse.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workouts' },
            { status: 500 }
        );
    }
}
