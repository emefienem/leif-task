import { prisma } from "../lib/prisma";
import haversine from "haversine-distance";
import { subDays } from "date-fns";

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
  // Query: {
  //   me: async (_parent: unknown, _args: unknown, ctx: Context) => ctx.user,
  //   getHistory: async (_parent: unknown, _args: unknown, ctx: Context) =>
  //     prisma.shift.findMany({ where: { userId: ctx.user.id } }),
  //   managerClockedIn: async (_parent: unknown, _args: unknown, ctx: Context) =>
  //     prisma.user.findMany({
  //       where: {
  //         role: "CARE_WORKER",
  //         shifts: {
  //           some: { clockOutAt: null },
  //         },
  //       },
  //     }),
  //   getShiftsByUser: async (_parent: unknown, args: ArgsWithUserId) =>
  //     prisma.shift.findMany({ where: { userId: args.userId } }),
  //   getDashboardStats: async (
  //     _parent: unknown,
  //     _args: unknown,
  //     ctx: Context
  //   ) => {
  //     const managerId = ctx.user.id;
  //     // Find all care workers assigned to this manager
  //     const careWorkers = await prisma.user.findMany({
  //       where: { managerId, role: "CARE_WORKER" },
  //       select: { id: true },
  //     });
  //     const careWorkerIds = careWorkers.map((cw) => cw.id);
  //     if (careWorkerIds.length === 0) {
  //       return {
  //         avgHoursPerDay: 0,
  //         dailyCount: 0,
  //         totalHoursLastWeek: 0,
  //       };
  //     }
  //     const today = new Date();
  //     const last7DaysDate = subDays(today, 7);
  //     // Get shifts for care workers in the last 7 days
  //     const shifts = await prisma.shift.findMany({
  //       where: {
  //         userId: { in: careWorkerIds },
  //         clockInAt: { gte: last7DaysDate },
  //         clockOutAt: { not: null },
  //       },
  //       select: {
  //         clockInAt: true,
  //         clockOutAt: true,
  //         userId: true,
  //       },
  //     });
  //     if (shifts.length === 0) {
  //       return {
  //         avgHoursPerDay: 0,
  //         dailyCount: 0,
  //         totalHoursLastWeek: 0,
  //       };
  //     }
  //     // Calculate total hours worked last week
  //     let totalHours = 0;
  //     // Count unique days with clock-ins for dailyCount
  //     const daysWithClockIns = new Set<string>();
  //     shifts.forEach(({ clockInAt, clockOutAt }) => {
  //       const start = clockInAt.getTime();
  //       const end = clockOutAt!.getTime();
  //       const hours = (end - start) / (1000 * 60 * 60);
  //       totalHours += hours;
  //       const day = clockInAt.toISOString().slice(0, 10);
  //       daysWithClockIns.add(day);
  //     });
  //     // Average hours per day = total hours / 7 (days)
  //     const avgHoursPerDay = totalHours / 7;
  //     // Daily count = average clock-ins per day (total clock-ins / 7)
  //     const dailyCount = shifts.length / 7;
  //     return {
  //       avgHoursPerDay: Number(avgHoursPerDay.toFixed(2)),
  //       dailyCount: Number(dailyCount.toFixed(2)),
  //       totalHoursLastWeek: Number(totalHours.toFixed(2)),
  //     };
  //   },
  //   getGeoFence: (_parent: unknown, _args: unknown, ctx: Context) =>
  //     prisma.geoFence.findUnique({ where: { managerId: ctx.user.id } }),
  // },
  // Mutation: {
  //   upsertGeoFence: (
  //     _parent: unknown,
  //     args: UpsertGeoFenceArgs,
  //     ctx: Context
  //   ) =>
  //     prisma.geoFence.upsert({
  //       where: { managerId: ctx.user.id },
  //       create: {
  //         managerId: ctx.user.id,
  //         lat: args.lat,
  //         lng: args.lng,
  //         radiusKm: args.radiusKm,
  //       },
  //       update: {
  //         lat: args.lat,
  //         lng: args.lng,
  //         radiusKm: args.radiusKm,
  //       },
  //     }),
  //   clockIn: async (_parent: unknown, args: ClockArgs, ctx: Context) => {
  //     const user = await prisma.user.findUnique({
  //       where: { id: ctx.user.id },
  //       select: { role: true, managerId: true },
  //     });
  //     if (!user) throw new Error("User not found");
  //     if (user.role !== "CARE_WORKER") {
  //       throw new Error("Only care workers can clock in");
  //     }
  //     if (!user.managerId) {
  //       throw new Error("No manager assigned to this care worker");
  //     }
  //     const geoFence = await prisma.geoFence.findUnique({
  //       where: { managerId: user.managerId },
  //     });
  //     if (!geoFence) throw new Error("No geofence found for manager");
  //     const distanceKm =
  //       haversine(
  //         { lat: args.lat, lng: args.lng },
  //         { lat: geoFence.lat, lng: geoFence.lng }
  //       ) / 1000;
  //     if (distanceKm > geoFence.radiusKm) {
  //       throw new Error("Outside perimeter — cannot clock in");
  //     }
  //     const activeShift = await prisma.shift.findFirst({
  //       where: { userId: ctx.user.id, clockOutAt: null },
  //     });
  //     if (activeShift) {
  //       throw new Error("You are already clocked in");
  //     }
  //     return prisma.shift.create({
  //       data: {
  //         userId: ctx.user.id,
  //         clockInAt: new Date(),
  //         clockInLat: args.lat,
  //         clockInLng: args.lng,
  //         clockInNote: args.note,
  //       },
  //     });
  //   },
  //   clockOut: async (_parent: unknown, args: ClockArgs, ctx: Context) => {
  //     const user = await prisma.user.findUnique({
  //       where: { id: ctx.user.id },
  //       select: { role: true },
  //     });
  //     if (!user) throw new Error("User not found");
  //     if (user.role !== "CARE_WORKER") {
  //       throw new Error("Only care workers can clock out");
  //     }
  //     const shift = await prisma.shift.findFirst({
  //       where: { userId: ctx.user.id, clockOutAt: null },
  //       orderBy: { clockInAt: "desc" },
  //     });
  //     if (!shift) throw new Error("No active shift found");
  //     return prisma.shift.update({
  //       where: { id: shift.id },
  //       data: {
  //         clockOutAt: new Date(),
  //         clockOutLat: args.lat,
  //         clockOutLng: args.lng,
  //         clockOutNote: args.note,
  //       },
  //     });
  //   },
  // },
};
