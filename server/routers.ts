import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  getLiveEvents,
  createLiveEvent,
  updateLiveEvent,
  deleteLiveEvent,
  getDiscography,
  createDiscography,
  updateDiscography,
  deleteDiscography,
  getAdminSetting,
  setAdminSetting,
} from "./db";

// Admin-only middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "管理者権限が必要です" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- Live Events ----
  liveEvents: router({
    list: publicProcedure.query(async () => {
      return await getLiveEvents(true);
    }),
    listAll: adminProcedure.query(async () => {
      return await getLiveEvents(false);
    }),
    create: adminProcedure
      .input(z.object({
        eventDate: z.string().min(1),
        venueName: z.string().min(1),
        venueCity: z.string().optional(),
        eventTitle: z.string().optional(),
        ticketUrl: z.string().optional(),
        detailUrl: z.string().optional(),
        flyerImageUrl: z.string().optional(),
        flyerImageKey: z.string().optional(),
        isPublished: z.boolean().default(true),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await createLiveEvent(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        eventDate: z.string().optional(),
        venueName: z.string().optional(),
        venueCity: z.string().optional(),
        eventTitle: z.string().optional(),
        ticketUrl: z.string().optional(),
        detailUrl: z.string().optional(),
        flyerImageUrl: z.string().optional(),
        flyerImageKey: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateLiveEvent(id, data);
        return { success: true };
      }),
    uploadFlyer: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileBase64: z.string(), // base64 encoded file
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { fileName, fileBase64, mimeType } = input;
        const buffer = Buffer.from(fileBase64, "base64");
        const suffix = Date.now().toString(36);
        const ext = fileName.split(".").pop() ?? "jpg";
        const key = `live-flyers/${suffix}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { url } = await storagePut(key, buffer, mimeType);
        return { key, url };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLiveEvent(input.id);
        return { success: true };
      }),
  }),

  // ---- Discography ----
  discography: router({
    list: publicProcedure.query(async () => {
      return await getDiscography(true);
    }),
    listAll: adminProcedure.query(async () => {
      return await getDiscography(false);
    }),
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        releaseYear: z.number(),
        releaseDate: z.string().optional(),
        type: z.enum(["single", "ep", "album", "mini_album"]).default("single"),
        streamingUrl: z.string().optional(),
        downloadUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        description: z.string().optional(),
        isPublished: z.boolean().default(true),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await createDiscography(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        releaseYear: z.number().optional(),
        releaseDate: z.string().optional(),
        type: z.enum(["single", "ep", "album", "mini_album"]).optional(),
        streamingUrl: z.string().optional(),
        downloadUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        description: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateDiscography(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteDiscography(input.id);
        return { success: true };
      }),
  }),

  // ---- Admin settings ----
  admin: router({
    verifyPassword: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        const storedPassword = await getAdminSetting("admin_password");
        if (!storedPassword) {
          return { success: input.password === "sod2024admin" };
        }
        return { success: input.password === storedPassword };
      }),
    changePassword: adminProcedure
      .input(z.object({ newPassword: z.string().min(6) }))
      .mutation(async ({ input }) => {
        await setAdminSetting("admin_password", input.newPassword);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
