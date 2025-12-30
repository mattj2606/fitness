import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { exerciseSchema } from '@/lib/validations/exercise';

// GET /api/exercises - List all exercises
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const equipment = searchParams.get('equipment');

    const where: {
      category?: string;
      equipment?: string;
    } = {};

    if (category) {
      where.category = category;
    }
    if (equipment) {
      where.equipment = equipment;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      include: {
        muscleTargets: {
          include: {
            muscle: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ exercises }, { status: 200 });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/exercises - Create custom exercise
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const data = exerciseSchema.parse(body);

    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        category: data.category,
        equipment: data.equipment || null,
        instructions: data.instructions || null,
      },
      include: {
        muscleTargets: {
          include: {
            muscle: true,
          },
        },
      },
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


