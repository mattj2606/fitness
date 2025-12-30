import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(100),
  category: z.enum(['push', 'pull', 'legs', 'cardio', 'pt'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  equipment: z.string().max(50).optional(),
  instructions: z.string().max(1000).optional(),
});

export const exerciseUpdateSchema = exerciseSchema.partial();

export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type ExerciseUpdateInput = z.infer<typeof exerciseUpdateSchema>;


