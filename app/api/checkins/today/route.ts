import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { getTodayCheckin } from '@/lib/services/checkin';

// GET /api/checkins/today - Get today's check-in
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { session } = authResult;
    const checkin = await getTodayCheckin(session.userId);

    return NextResponse.json({ checkin }, { status: 200 });
  } catch (error) {
    console.error('Error fetching today\'s check-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


