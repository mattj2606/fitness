import { z } from 'zod';

export const sorenessMapSchema = z.record(z.string(), z.number().min(0).max(5));

export const checkinSchema = z.object({
  date: z.string().optional(), // ISO date string, defaults to today
  hoursSlept: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().int().min(1).max(5).optional(),
  energyLevel: z.enum(['low', 'normal', 'high']).optional(),
  sorenessMap: sorenessMapSchema.optional(),
  acutePain: z.boolean().optional(),
  painNote: z.string().max(500).optional(),
  timeAvailable: z.enum(['short', 'normal', 'long']).optional(),
});

export const checkinUpdateSchema = checkinSchema.partial();

export type CheckinInput = z.infer<typeof checkinSchema>;
export type CheckinUpdateInput = z.infer<typeof checkinUpdateSchema>;



