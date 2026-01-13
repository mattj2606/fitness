import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { generateRecommendationV2 } from '@/lib/services/recommendation';
import { getTodayCheckin } from '@/lib/services/checkin';
import { RecommendationDisplay } from '@/components/recommendation/RecommendationDisplay';

export default async function PlanPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Get today's check-in
  const checkin = await getTodayCheckin(session.userId);

  // Get ALL workouts for time-based recovery (not just last 10)
  const allWorkouts = await prisma.workout.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      sets: {
        include: {
          exercise: {
            include: {
              muscleTargets: {
                include: {
                  muscle: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    // No limit - time-based recovery needs all workouts
  });

  // Get exercise catalog
  const exerciseCatalog = await prisma.exercise.findMany({
    include: {
      muscleTargets: {
        include: {
          muscle: true,
        },
      },
    },
  });

  // Generate or get existing recommendation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let recommendation = await prisma.recommendation.findUnique({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
  });

  if (!recommendation) {
    // Generate new recommendation using V2 engine (time-based, ML-ready)
    const userProfile = undefined; // TODO: Load from database when UserFitnessProfile model is added

    const generated = await generateRecommendationV2({
      checkin,
      allWorkouts,
      exerciseCatalog,
      userProfile,
      dayOfWeek: new Date().getDay(),
    });

    // Save to database
    recommendation = await prisma.recommendation.create({
      data: {
        userId: session.userId,
        date: today,
        workoutType: generated.workoutType,
        exercises: generated.exercises as any,
        reasoning: generated.reasoning as any,
      },
    });
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Today's Plan</h1>
        <p className="text-muted-foreground">
          Your recommended workout for today
        </p>
      </div>

      {recommendation ? (
        <RecommendationDisplay
          workoutType={recommendation.workoutType}
          exercises={(recommendation.exercises as any) || []}
          reasoning={(recommendation.reasoning as any) || []}
          estimatedDuration={45}
          confidence={0.8}
          recommendationId={recommendation.id}
        />
      ) : (
        <div className="p-6 border rounded-lg bg-card text-center">
          <p className="text-muted-foreground">
            Generating your workout recommendation...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure you've completed your check-in for today.
          </p>
        </div>
      )}
    </div>
  );
}
