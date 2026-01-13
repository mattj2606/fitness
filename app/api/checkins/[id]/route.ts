import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/middleware';
import { checkinUpdateSchema } from '@/lib/validations/checkin';
import { updateCheckin } from '@/lib/services/checkin';
import { prisma } from '@/lib/db/prisma';

// GET /api/checkins/:id - Get check-in by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { session } = authResult;
    const { id } = await params;

    const checkin = await prisma.dailyCheckin.findUnique({
      where: { id },
    });

    if (!checkin || checkin.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Check-in not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ checkin }, { status: 200 });
  } catch (error) {
    console.error('Error fetching check-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/checkins/:id - Update check-in
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { session } = authResult;
    const { id } = await params;
    const body = await request.json();
    const data = checkinUpdateSchema.parse(body);

    const checkin = await updateCheckin(id, session.userId, data);

    return NextResponse.json({ checkin }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    console.error('Error updating check-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/checkins/:id - Delete check-in
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { session } = authResult;
    const { id } = await params;

    const checkin = await prisma.dailyCheckin.findUnique({
      where: { id },
    });

    if (!checkin || checkin.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Check-in not found' },
        { status: 404 }
      );
    }

    await prisma.dailyCheckin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting check-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



