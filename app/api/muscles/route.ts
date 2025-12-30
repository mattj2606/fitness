import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/muscles - List all muscles
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const muscles = await prisma.muscle.findMany({
      orderBy: [
        { group: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ muscles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching muscles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


