import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create muscle groups
  console.log('Creating muscle groups...');
  const muscles = await Promise.all([
    // Chest
    prisma.muscle.upsert({
      where: { name: 'Chest' },
      update: {},
      create: { name: 'Chest', group: 'chest' },
    }),
    // Back
    prisma.muscle.upsert({
      where: { name: 'Upper Back' },
      update: {},
      create: { name: 'Upper Back', group: 'back' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Lats' },
      update: {},
      create: { name: 'Lats', group: 'back' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Lower Back' },
      update: {},
      create: { name: 'Lower Back', group: 'back' },
    }),
    // Shoulders
    prisma.muscle.upsert({
      where: { name: 'Front Delts' },
      update: {},
      create: { name: 'Front Delts', group: 'shoulders' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Side Delts' },
      update: {},
      create: { name: 'Side Delts', group: 'shoulders' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Rear Delts' },
      update: {},
      create: { name: 'Rear Delts', group: 'shoulders' },
    }),
    // Arms
    prisma.muscle.upsert({
      where: { name: 'Biceps' },
      update: {},
      create: { name: 'Biceps', group: 'arms' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Triceps' },
      update: {},
      create: { name: 'Triceps', group: 'arms' },
    }),
    // Legs
    prisma.muscle.upsert({
      where: { name: 'Quads' },
      update: {},
      create: { name: 'Quads', group: 'legs' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Hamstrings' },
      update: {},
      create: { name: 'Hamstrings', group: 'legs' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Glutes' },
      update: {},
      create: { name: 'Glutes', group: 'legs' },
    }),
    prisma.muscle.upsert({
      where: { name: 'Calves' },
      update: {},
      create: { name: 'Calves', group: 'legs' },
    }),
    // Core
    prisma.muscle.upsert({
      where: { name: 'Abs' },
      update: {},
      create: { name: 'Abs', group: 'core' },
    }),
  ]);

  console.log(`✅ Created ${muscles.length} muscle groups`);

  // Create exercises
  console.log('Creating exercises...');
  const exercises = await Promise.all([
    // Push exercises
    prisma.exercise.upsert({
      where: { id: 'bench-press' },
      update: {},
      create: {
        id: 'bench-press',
        name: 'Bench Press',
        category: 'push',
        equipment: 'barbell',
        instructions: 'Lie on bench, lower bar to chest, press up',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'overhead-press' },
      update: {},
      create: {
        id: 'overhead-press',
        name: 'Overhead Press',
        category: 'push',
        equipment: 'barbell',
        instructions: 'Press bar overhead from shoulders',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'dips' },
      update: {},
      create: {
        id: 'dips',
        name: 'Dips',
        category: 'push',
        equipment: 'bodyweight',
        instructions: 'Lower body by bending arms, push back up',
      },
    }),
    // Pull exercises
    prisma.exercise.upsert({
      where: { id: 'pull-ups' },
      update: {},
      create: {
        id: 'pull-ups',
        name: 'Pull-ups',
        category: 'pull',
        equipment: 'bodyweight',
        instructions: 'Hang from bar, pull body up until chin over bar',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'barbell-rows' },
      update: {},
      create: {
        id: 'barbell-rows',
        name: 'Barbell Rows',
        category: 'pull',
        equipment: 'barbell',
        instructions: 'Bend over, pull bar to lower chest/upper abs',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'lat-pulldown' },
      update: {},
      create: {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        category: 'pull',
        equipment: 'cable',
        instructions: 'Pull bar down to upper chest',
      },
    }),
    // Leg exercises
    prisma.exercise.upsert({
      where: { id: 'squat' },
      update: {},
      create: {
        id: 'squat',
        name: 'Squat',
        category: 'legs',
        equipment: 'barbell',
        instructions: 'Lower body by bending knees and hips, stand back up',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'deadlift' },
      update: {},
      create: {
        id: 'deadlift',
        name: 'Deadlift',
        category: 'legs',
        equipment: 'barbell',
        instructions: 'Lift bar from floor to standing position',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'leg-press' },
      update: {},
      create: {
        id: 'leg-press',
        name: 'Leg Press',
        category: 'legs',
        equipment: 'machine',
        instructions: 'Push weight with legs, lower with control',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'leg-curls' },
      update: {},
      create: {
        id: 'leg-curls',
        name: 'Leg Curls',
        category: 'legs',
        equipment: 'machine',
        instructions: 'Curl weight with hamstrings',
      },
    }),
  ]);

  console.log(`✅ Created ${exercises.length} exercises`);

  // Create exercise-muscle mappings
  console.log('Creating exercise-muscle mappings...');
  const chest = muscles.find((m) => m.name === 'Chest')!;
  const triceps = muscles.find((m) => m.name === 'Triceps')!;
  const frontDelts = muscles.find((m) => m.name === 'Front Delts')!;
  const lats = muscles.find((m) => m.name === 'Lats')!;
  const upperBack = muscles.find((m) => m.name === 'Upper Back')!;
  const biceps = muscles.find((m) => m.name === 'Biceps')!;
  const quads = muscles.find((m) => m.name === 'Quads')!;
  const hamstrings = muscles.find((m) => m.name === 'Hamstrings')!;
  const glutes = muscles.find((m) => m.name === 'Glutes')!;
  const lowerBack = muscles.find((m) => m.name === 'Lower Back')!;

  const mappings = [
    // Bench Press: Chest (1.0), Triceps (0.5), Front Delts (0.5)
    {
      exerciseId: 'bench-press',
      muscleId: chest.id,
      weight: 1.0,
    },
    {
      exerciseId: 'bench-press',
      muscleId: triceps.id,
      weight: 0.5,
    },
    {
      exerciseId: 'bench-press',
      muscleId: frontDelts.id,
      weight: 0.5,
    },
    // Overhead Press: Front Delts (1.0), Side Delts (0.7), Triceps (0.5)
    {
      exerciseId: 'overhead-press',
      muscleId: frontDelts.id,
      weight: 1.0,
    },
    {
      exerciseId: 'overhead-press',
      muscleId: muscles.find((m) => m.name === 'Side Delts')!.id,
      weight: 0.7,
    },
    {
      exerciseId: 'overhead-press',
      muscleId: triceps.id,
      weight: 0.5,
    },
    // Dips: Triceps (1.0), Chest (0.5), Front Delts (0.3)
    {
      exerciseId: 'dips',
      muscleId: triceps.id,
      weight: 1.0,
    },
    {
      exerciseId: 'dips',
      muscleId: chest.id,
      weight: 0.5,
    },
    {
      exerciseId: 'dips',
      muscleId: frontDelts.id,
      weight: 0.3,
    },
    // Pull-ups: Lats (1.0), Biceps (0.7), Upper Back (0.5)
    {
      exerciseId: 'pull-ups',
      muscleId: lats.id,
      weight: 1.0,
    },
    {
      exerciseId: 'pull-ups',
      muscleId: biceps.id,
      weight: 0.7,
    },
    {
      exerciseId: 'pull-ups',
      muscleId: upperBack.id,
      weight: 0.5,
    },
    // Barbell Rows: Upper Back (1.0), Lats (0.7), Biceps (0.5)
    {
      exerciseId: 'barbell-rows',
      muscleId: upperBack.id,
      weight: 1.0,
    },
    {
      exerciseId: 'barbell-rows',
      muscleId: lats.id,
      weight: 0.7,
    },
    {
      exerciseId: 'barbell-rows',
      muscleId: biceps.id,
      weight: 0.5,
    },
    // Lat Pulldown: Lats (1.0), Biceps (0.6), Upper Back (0.4)
    {
      exerciseId: 'lat-pulldown',
      muscleId: lats.id,
      weight: 1.0,
    },
    {
      exerciseId: 'lat-pulldown',
      muscleId: biceps.id,
      weight: 0.6,
    },
    {
      exerciseId: 'lat-pulldown',
      muscleId: upperBack.id,
      weight: 0.4,
    },
    // Squat: Quads (1.0), Glutes (0.8), Lower Back (0.3)
    {
      exerciseId: 'squat',
      muscleId: quads.id,
      weight: 1.0,
    },
    {
      exerciseId: 'squat',
      muscleId: glutes.id,
      weight: 0.8,
    },
    {
      exerciseId: 'squat',
      muscleId: lowerBack.id,
      weight: 0.3,
    },
    // Deadlift: Hamstrings (1.0), Glutes (0.9), Lower Back (0.8)
    {
      exerciseId: 'deadlift',
      muscleId: hamstrings.id,
      weight: 1.0,
    },
    {
      exerciseId: 'deadlift',
      muscleId: glutes.id,
      weight: 0.9,
    },
    {
      exerciseId: 'deadlift',
      muscleId: lowerBack.id,
      weight: 0.8,
    },
    // Leg Press: Quads (1.0), Glutes (0.5)
    {
      exerciseId: 'leg-press',
      muscleId: quads.id,
      weight: 1.0,
    },
    {
      exerciseId: 'leg-press',
      muscleId: glutes.id,
      weight: 0.5,
    },
    // Leg Curls: Hamstrings (1.0)
    {
      exerciseId: 'leg-curls',
      muscleId: hamstrings.id,
      weight: 1.0,
    },
  ];

  for (const mapping of mappings) {
    await prisma.exerciseMuscleMap.upsert({
      where: {
        exerciseId_muscleId: {
          exerciseId: mapping.exerciseId,
          muscleId: mapping.muscleId,
        },
      },
      update: { weight: mapping.weight },
      create: mapping,
    });
  }

  console.log(`✅ Created ${mappings.length} exercise-muscle mappings`);

  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


