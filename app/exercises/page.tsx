import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ExerciseList } from '@/components/exercises/ExerciseList';

export default async function ExercisesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const exercises = await prisma.exercise.findMany({
    include: {
      muscleTargets: {
        include: {
          muscle: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const muscles = await prisma.muscle.findMany({
    orderBy: [
      { group: 'asc' },
      { name: 'asc' },
    ],
  });

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Exercises</h1>
        <p className="text-muted-foreground">
          Manage your exercise catalog
        </p>
      </div>

      <ExerciseList initialExercises={exercises} muscles={muscles} />
    </div>
  );
}



