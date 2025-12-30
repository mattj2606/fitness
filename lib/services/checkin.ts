import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { CheckinInput, CheckinUpdateInput } from '@/lib/validations/checkin';

export async function getTodayCheckin(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.dailyCheckin.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });
}

export async function createCheckin(userId: string, data: CheckinInput) {
  const date = data.date ? new Date(data.date) : new Date();
  date.setHours(0, 0, 0, 0);

  return prisma.dailyCheckin.create({
    data: {
      userId,
      date,
      hoursSlept: data.hoursSlept ?? null,
      sleepQuality: data.sleepQuality ?? null,
      energyLevel: data.energyLevel ?? null,
      sorenessMap: data.sorenessMap ? (data.sorenessMap as Prisma.InputJsonValue) : Prisma.JsonNull,
      acutePain: data.acutePain ?? false,
      painNote: data.painNote ?? null,
      timeAvailable: data.timeAvailable ?? null,
    },
  });
}

export async function updateCheckin(
  checkinId: string,
  userId: string,
  data: CheckinUpdateInput
) {
  // Verify checkin belongs to user
  const checkin = await prisma.dailyCheckin.findUnique({
    where: { id: checkinId },
  });

  if (!checkin || checkin.userId !== userId) {
    throw new Error('Check-in not found or unauthorized');
  }

  return prisma.dailyCheckin.update({
    where: { id: checkinId },
    data: {
      ...(data.hoursSlept !== undefined && { hoursSlept: data.hoursSlept ?? null }),
      ...(data.sleepQuality !== undefined && { sleepQuality: data.sleepQuality ?? null }),
      ...(data.energyLevel !== undefined && { energyLevel: data.energyLevel ?? null }),
      ...(data.sorenessMap !== undefined && { sorenessMap: data.sorenessMap ? (data.sorenessMap as Prisma.InputJsonValue) : Prisma.JsonNull }),
      ...(data.acutePain !== undefined && { acutePain: data.acutePain }),
      ...(data.painNote !== undefined && { painNote: data.painNote ?? null }),
      ...(data.timeAvailable !== undefined && { timeAvailable: data.timeAvailable ?? null }),
    },
  });
}

export async function getCheckins(
  userId: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
) {
  const where: {
    userId: string;
    date?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    userId,
  };

  if (options?.startDate || options?.endDate) {
    where.date = {};
    if (options.startDate) {
      where.date.gte = options.startDate;
    }
    if (options.endDate) {
      where.date.lte = options.endDate;
    }
  }

  return prisma.dailyCheckin.findMany({
    where,
    orderBy: {
      date: 'desc',
    },
    take: options?.limit,
  });
}

