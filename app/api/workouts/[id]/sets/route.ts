import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getWorkoutDetails, logSet } from '@/lib/services/workouts';
import { z } from 'zod';

const logSetSchema = z.object({
    exerciseId: z.string().min(1),
    setNumber: z.number().int().min(1),
    weight: z.number().min(0),
    reps: z.number().int().min(0),
    effort: z.string().optional(),
    restSeconds: z.number().int().min(0).optional(),
    notes: z.string().optional(),
});

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const workout = await getWorkoutDetails(params.id);
        if (!workout || workout.userId !== session.userId) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const body = await req.json();
        const result = logSetSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const set = await logSet({
            workoutId: params.id,
            ...result.data,
        });

        return NextResponse.json(set, { status: 201 });
    } catch (error) {
        console.error('Error logging set:', error);
        return NextResponse.json(
            { error: 'Failed to log set' },
            { status: 500 }
        );
    }
}
