import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Live events table - managed via admin panel
 */
export const liveEvents = mysqlTable("live_events", {
  id: int("id").autoincrement().primaryKey(),
  eventDate: varchar("eventDate", { length: 20 }).notNull(), // "2024-12-31" format
  venueName: varchar("venueName", { length: 255 }).notNull(),
  venueCity: varchar("venueCity", { length: 100 }),
  eventTitle: varchar("eventTitle", { length: 255 }),
  ticketUrl: text("ticketUrl"),
  detailUrl: text("detailUrl"),
  flyerImageUrl: text("flyerImageUrl"),
  flyerImageKey: text("flyerImageKey"),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LiveEvent = typeof liveEvents.$inferSelect;
export type InsertLiveEvent = typeof liveEvents.$inferInsert;

/**
 * Discography table - managed via admin panel
 */
export const discography = mysqlTable("discography", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  releaseYear: int("releaseYear").notNull(),
  releaseDate: varchar("releaseDate", { length: 20 }),
  type: mysqlEnum("type", ["single", "ep", "album", "mini_album"])
    .default("single")
    .notNull(),
  streamingUrl: text("streamingUrl"),
  downloadUrl: text("downloadUrl"),
  coverImageUrl: text("coverImageUrl"),
  description: text("description"),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Discography = typeof discography.$inferSelect;
export type InsertDiscography = typeof discography.$inferInsert;

/**
 * Admin settings table - for simple password-based admin access
 */
export const adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
