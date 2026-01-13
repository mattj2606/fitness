import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const SESSION_COOKIE_NAME = 'fitness_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface Session {
  userId: string;
  email?: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    // For single-user app, we can use a simple approach
    // Check if token matches a user ID (or implement proper session table later)
    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: { id: true, email: true },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email || undefined,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}



