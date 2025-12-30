import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

// Example protected route
export async function GET() {
  const authResult = await requireAuth();

  if (authResult instanceof NextResponse) {
    return authResult; // Unauthorized response
  }

  const { session } = authResult;

  return NextResponse.json(
    {
      message: 'This is a protected route',
      userId: session.userId,
      email: session.email,
    },
    { status: 200 }
  );
}

