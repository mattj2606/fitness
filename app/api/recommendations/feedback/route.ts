import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { recommendationId, feedback } = body;
    
    if (!recommendationId || !feedback) {
      return NextResponse.json(
        { error: 'Missing recommendationId or feedback' },
        { status: 400 }
      );
    }
    
    if (!['positive', 'negative'].includes(feedback)) {
      return NextResponse.json(
        { error: 'Feedback must be "positive" or "negative"' },
        { status: 400 }
      );
    }
    
    // Verify recommendation belongs to user
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });
    
    if (!recommendation || recommendation.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Recommendation not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Update feedback
    const updated = await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { feedback },
    });
    
    return NextResponse.json({ success: true, feedback: updated.feedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

