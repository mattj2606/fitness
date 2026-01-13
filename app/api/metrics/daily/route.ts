import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { calculateTodayMetrics, calculateDailyMetrics } from '@/lib/services/analytics/daily-metrics';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { date } = body;
    
    if (date) {
      // Calculate for specific date
      await calculateDailyMetrics(session.userId, new Date(date));
    } else {
      // Calculate for today
      await calculateTodayMetrics(session.userId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error calculating daily metrics:', error);
    return NextResponse.json(
      { error: 'Failed to calculate daily metrics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();
    date.setHours(0, 0, 0, 0);
    
    // Calculate metrics if they don't exist
    await calculateDailyMetrics(session.userId, date);
    
    // Get metrics
    const { prisma } = await import('@/lib/db/prisma');
    const metrics = await prisma.dailyMetrics.findUnique({
      where: {
        userId_date: {
          userId: session.userId,
          date,
        },
      },
    });
    
    if (!metrics) {
      return NextResponse.json(
        { error: 'Metrics not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error getting daily metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get daily metrics' },
      { status: 500 }
    );
  }
}

