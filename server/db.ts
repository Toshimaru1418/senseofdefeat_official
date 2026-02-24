import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertDiscography,
  InsertLiveEvent,
  discography,
  liveEvents,
  adminSettings,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ---- Live Events ----

export async function getLiveEvents(publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(liveEvents);
  if (publishedOnly) {
    return await db
      .select()
      .from(liveEvents)
      .where(eq(liveEvents.isPublished, true))
      .orderBy(asc(liveEvents.eventDate), asc(liveEvents.sortOrder));
  }
  return await db
    .select()
    .from(liveEvents)
    .orderBy(asc(liveEvents.eventDate), asc(liveEvents.sortOrder));
}

export async function getLiveEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(liveEvents)
    .where(eq(liveEvents.id, id))
    .limit(1);
  return result[0];
}

export async function createLiveEvent(data: InsertLiveEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(liveEvents).values(data);
}

export async function updateLiveEvent(
  id: number,
  data: Partial<InsertLiveEvent>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(liveEvents).set(data).where(eq(liveEvents.id, id));
}

export async function deleteLiveEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(liveEvents).where(eq(liveEvents.id, id));
}

// ---- Discography ----

export async function getDiscography(publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return await db
      .select()
      .from(discography)
      .where(eq(discography.isPublished, true))
      .orderBy(desc(discography.releaseYear), asc(discography.sortOrder));
  }
  return await db
    .select()
    .from(discography)
    .orderBy(desc(discography.releaseYear), asc(discography.sortOrder));
}

export async function getDiscographyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(discography)
    .where(eq(discography.id, id))
    .limit(1);
  return result[0];
}

export async function createDiscography(data: InsertDiscography) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(discography).values(data);
}

export async function updateDiscography(
  id: number,
  data: Partial<InsertDiscography>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(discography).set(data).where(eq(discography.id, id));
}

export async function deleteDiscography(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(discography).where(eq(discography.id, id));
}

// ---- Admin Settings ----

export async function getAdminSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.settingKey, key))
    .limit(1);
  return result[0]?.settingValue ?? null;
}

export async function setAdminSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .insert(adminSettings)
    .values({ settingKey: key, settingValue: value })
    .onDuplicateKeyUpdate({ set: { settingValue: value } });
}
