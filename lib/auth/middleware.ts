import { NextResponse } from 'next/server';
import { getSession } from './session';

export async function requireAuth(): Promise<{ session: { userId: string; email?: string } } | NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return { session };
}

