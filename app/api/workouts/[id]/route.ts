import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getWorkoutDetails, updateWorkout, deleteWorkout } from '@/lib/services/workouts';
import { z } from 'zod';

const updateWorkoutSchema = z.object({
    notes: z.string().optional(),
    duration: z.number().optional(),
    endTime: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
});

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workout = await getWorkoutDetails(params.id);
        if (!workout || workout.userId !== session.userId) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(workout);
    } catch (error) {
        console.error('Error fetching workout:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workout' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const existing = await getWorkoutDetails(params.id);
        if (!existing || existing.userId !== session.userId) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const body = await req.json();
        const result = updateWorkoutSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const updated = await updateWorkout({
            workoutId: params.id,
            ...result.data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating workout:', error);
        return NextResponse.json(
            { error: 'Failed to update workout' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const existing = await getWorkoutDetails(params.id);
        if (!existing || existing.userId !== session.userId) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        await deleteWorkout(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting workout:', error);
        return NextResponse.json(
            { error: 'Failed to delete workout' },
            { status: 500 }
        );
    }
}
