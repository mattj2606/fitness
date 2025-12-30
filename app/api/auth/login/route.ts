import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { createSession } from '@/lib/auth/session';

const loginSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    // For single-user app, get or create the user
    let user = await prisma.user.findFirst();

    if (!user) {
      // Create first user if none exists
      user = await prisma.user.create({
        data: {
          email: data.email || null,
        },
      });
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


