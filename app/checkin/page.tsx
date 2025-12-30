import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getTodayCheckin } from '@/lib/services/checkin';
import { CheckinForm } from '@/components/checkin/CheckinForm';

export default async function CheckinPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const todayCheckin = await getTodayCheckin(session.userId);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Morning Check-In</h1>
        <p className="text-muted-foreground">
          How are you feeling today?
        </p>
      </div>

      <CheckinForm initialCheckin={todayCheckin} />
    </div>
  );
}


