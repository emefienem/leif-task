import { prisma } from "../lib/prisma";
import haversine from "haversine-distance";

type Context = {
  user: {
    id: string;
    email?: string;
    name?: string;
    [key: string]: unknown;
  };
};

type ArgsWithUserId = {
  userId: string;
};

type UpsertGeoFenceArgs = {
  lat: number;
  lng: number;
  radiusKm: number;
};

type ClockArgs = {
  lat: number;
  lng: number;
  note?: string;
};

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: Context) => ctx.user,

    getHistory: async (_parent: unknown, _args: unknown, ctx: Context) =>
      prisma.shift.findMany({ where: { userId: ctx.user.id } }),

    managerClockedIn: async (_parent: unknown, _args: unknown, ctx: Context) =>
      prisma.user.findMany({
        where: {
          role: "CARE_WORKER",
          shifts: {
            some: { clockOutAt: null },
          },
        },
      }),

    getShiftsByUser: async (_parent: unknown, args: ArgsWithUserId) =>
      prisma.shift.findMany({ where: { userId: args.userId } }),

    getDashboardStats: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context
    ) => {
      // This is mocked, implement real aggregation logic
      return {
        avgHoursPerDay: 8,
        dailyCount: 5,
        totalHoursLastWeek: 40,
      };
    },

    getGeoFence: (_parent: unknown, _args: unknown, ctx: Context) =>
      prisma.geoFence.findUnique({ where: { managerId: ctx.user.id } }),
  },

  Mutation: {
    upsertGeoFence: (
      _parent: unknown,
      args: UpsertGeoFenceArgs,
      ctx: Context
    ) =>
      prisma.geoFence.upsert({
        where: { managerId: ctx.user.id },
        create: {
          managerId: ctx.user.id,
          lat: args.lat,
          lng: args.lng,
          radiusKm: args.radiusKm,
        },
        update: {
          lat: args.lat,
          lng: args.lng,
          radiusKm: args.radiusKm,
        },
      }),

    clockIn: async (_parent: unknown, args: ClockArgs, ctx: Context) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { role: true, managerId: true },
      });

      if (!user) throw new Error("User not found");
      if (user.role !== "CARE_WORKER") {
        throw new Error("Only care workers can clock in");
      }
      if (!user.managerId) {
        throw new Error("No manager assigned to this care worker");
      }

      const geoFence = await prisma.geoFence.findUnique({
        where: { managerId: user.managerId },
      });

      if (!geoFence) throw new Error("No geofence found for manager");

      const distanceKm =
        haversine(
          { lat: args.lat, lng: args.lng },
          { lat: geoFence.lat, lng: geoFence.lng }
        ) / 1000;

      if (distanceKm > geoFence.radiusKm) {
        throw new Error("Outside perimeter — cannot clock in");
      }

      const activeShift = await prisma.shift.findFirst({
        where: { userId: ctx.user.id, clockOutAt: null },
      });
      if (activeShift) {
        throw new Error("You are already clocked in");
      }

      return prisma.shift.create({
        data: {
          userId: ctx.user.id,
          clockInAt: new Date(),
          clockInLat: args.lat,
          clockInLng: args.lng,
          clockInNote: args.note,
        },
      });
    },

    clockOut: async (_parent: unknown, args: ClockArgs, ctx: Context) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { role: true },
      });

      if (!user) throw new Error("User not found");
      if (user.role !== "CARE_WORKER") {
        throw new Error("Only care workers can clock out");
      }

      const shift = await prisma.shift.findFirst({
        where: { userId: ctx.user.id, clockOutAt: null },
        orderBy: { clockInAt: "desc" },
      });

      if (!shift) throw new Error("No active shift found");

      return prisma.shift.update({
        where: { id: shift.id },
        data: {
          clockOutAt: new Date(),
          clockOutLat: args.lat,
          clockOutLng: args.lng,
          clockOutNote: args.note,
        },
      });
    },
  },
};
