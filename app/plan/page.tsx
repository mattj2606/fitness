import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

export default async function PlanPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Today's Plan</h1>
        <p className="text-muted-foreground">
          Your recommended workout for today
        </p>
      </div>

      <div className="p-6 border rounded-lg bg-card text-center">
        <p className="text-muted-foreground">
          Recommendation engine coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will show your workout plan based on your check-in.
        </p>
      </div>
    </div>
  );
}


