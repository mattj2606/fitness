import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

const muscleMappingSchema = z.object({
  muscleId: z.string(),
  weight: z.number().min(0).max(1),
});

const updateMuscleMappingsSchema = z.object({
  mappings: z.array(muscleMappingSchema),
});

// GET /api/exercises/:id/muscles - Get muscle mappings for exercise
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;

    const mappings = await prisma.exerciseMuscleMap.findMany({
      where: { exerciseId: id },
      include: {
        muscle: true,
      },
    });

    return NextResponse.json({ mappings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching muscle mappings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/exercises/:id/muscles - Update muscle mappings for exercise
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const { mappings } = updateMuscleMappingsSchema.parse(body);

    // Delete existing mappings
    await prisma.exerciseMuscleMap.deleteMany({
      where: { exerciseId: id },
    });

    // Create new mappings
    const createdMappings = await prisma.$transaction(
      mappings.map((mapping) =>
        prisma.exerciseMuscleMap.create({
          data: {
            exerciseId: id,
            muscleId: mapping.muscleId,
            weight: mapping.weight,
          },
          include: {
            muscle: true,
          },
        })
      )
    );

    return NextResponse.json({ mappings: createdMappings }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating muscle mappings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

