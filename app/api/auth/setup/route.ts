import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { createSession } from '@/lib/auth/session';

const setupSchema = z.object({
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data = setupSchema.parse(body);

    // Create first user
    const user = await prisma.user.create({
      data: {
        email: data.email || null,
      },
    });

    // Create session
    await createSession(user.id);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error setting up user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


