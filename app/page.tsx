import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export default async function Home() {
  const session = await getSession();

  // If no session, check if user exists
  if (!session) {
    const user = await prisma.user.findFirst();
    if (!user) {
      redirect('/setup');
    }
    // If user exists but no session, redirect to login
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Fitness Intelligence App</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Personal fitness tracking and workout recommendations
        </p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Welcome back! Session active.
          </p>
          {session.email && (
            <p className="text-sm text-muted-foreground">{session.email}</p>
          )}
        </div>
      </div>
    </main>
  );
}

