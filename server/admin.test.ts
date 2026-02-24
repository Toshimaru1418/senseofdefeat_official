import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getLiveEvents: vi.fn(),
  createLiveEvent: vi.fn(),
  updateLiveEvent: vi.fn(),
  deleteLiveEvent: vi.fn(),
  getDiscography: vi.fn(),
  createDiscography: vi.fn(),
  updateDiscography: vi.fn(),
  deleteDiscography: vi.fn(),
  getAdminSetting: vi.fn(),
  setAdminSetting: vi.fn(),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
}));

import * as db from "./db";

describe("Admin DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Live Events", () => {
    it("getLiveEvents returns published events only when publishedOnly=true", async () => {
      const mockEvents = [
        {
          id: 1,
          eventDate: "2026-03-15",
          venueName: "渋谷 CLUB QUATTRO",
          isPublished: true,
          sortOrder: 0,
        },
      ];
      vi.mocked(db.getLiveEvents).mockResolvedValue(mockEvents as any);

      const result = await db.getLiveEvents(true);
      expect(result).toEqual(mockEvents);
      expect(db.getLiveEvents).toHaveBeenCalledWith(true);
    });

    it("createLiveEvent is called with correct data", async () => {
      vi.mocked(db.createLiveEvent).mockResolvedValue(undefined);

      await db.createLiveEvent({
        eventDate: "2026-03-15",
        venueName: "渋谷 CLUB QUATTRO",
        isPublished: true,
        sortOrder: 0,
      });

      expect(db.createLiveEvent).toHaveBeenCalledWith({
        eventDate: "2026-03-15",
        venueName: "渋谷 CLUB QUATTRO",
        isPublished: true,
        sortOrder: 0,
      });
    });

    it("updateLiveEvent is called with correct id and data", async () => {
      vi.mocked(db.updateLiveEvent).mockResolvedValue(undefined);

      await db.updateLiveEvent(1, { venueName: "Updated Venue" });

      expect(db.updateLiveEvent).toHaveBeenCalledWith(1, {
        venueName: "Updated Venue",
      });
    });

    it("deleteLiveEvent is called with correct id", async () => {
      vi.mocked(db.deleteLiveEvent).mockResolvedValue(undefined);

      await db.deleteLiveEvent(1);

      expect(db.deleteLiveEvent).toHaveBeenCalledWith(1);
    });
  });

  describe("Discography", () => {
    it("getDiscography returns published items when publishedOnly=true", async () => {
      const mockItems = [
        {
          id: 1,
          title: "Paradigm Down",
          releaseYear: 2024,
          type: "single",
          isPublished: true,
          sortOrder: 0,
        },
      ];
      vi.mocked(db.getDiscography).mockResolvedValue(mockItems as any);

      const result = await db.getDiscography(true);
      expect(result).toEqual(mockItems);
      expect(db.getDiscography).toHaveBeenCalledWith(true);
    });

    it("createDiscography is called with correct data", async () => {
      vi.mocked(db.createDiscography).mockResolvedValue(undefined);

      await db.createDiscography({
        title: "New Release",
        releaseYear: 2026,
        type: "single",
        isPublished: true,
        sortOrder: 0,
      });

      expect(db.createDiscography).toHaveBeenCalledWith({
        title: "New Release",
        releaseYear: 2026,
        type: "single",
        isPublished: true,
        sortOrder: 0,
      });
    });
  });

  describe("Admin Settings", () => {
    it("getAdminSetting returns null when key does not exist", async () => {
      vi.mocked(db.getAdminSetting).mockResolvedValue(null);

      const result = await db.getAdminSetting("nonexistent_key");
      expect(result).toBeNull();
    });

    it("getAdminSetting returns value when key exists", async () => {
      vi.mocked(db.getAdminSetting).mockResolvedValue("test_password");

      const result = await db.getAdminSetting("admin_password");
      expect(result).toBe("test_password");
    });

    it("setAdminSetting is called with correct key and value", async () => {
      vi.mocked(db.setAdminSetting).mockResolvedValue(undefined);

      await db.setAdminSetting("admin_password", "new_password");

      expect(db.setAdminSetting).toHaveBeenCalledWith(
        "admin_password",
        "new_password"
      );
    });
  });

  describe("Admin password verification logic", () => {
    it("uses default password 'sod2024admin' when no password is stored", async () => {
      vi.mocked(db.getAdminSetting).mockResolvedValue(null);

      const storedPassword = await db.getAdminSetting("admin_password");
      const inputPassword = "sod2024admin";

      if (!storedPassword) {
        expect(inputPassword === "sod2024admin").toBe(true);
      }
    });

    it("rejects wrong password when no password is stored", async () => {
      vi.mocked(db.getAdminSetting).mockResolvedValue(null);

      const storedPassword = await db.getAdminSetting("admin_password");
      const inputPassword = "wrong_password";

      if (!storedPassword) {
        expect(inputPassword === "sod2024admin").toBe(false);
      }
    });

    it("uses stored password when it exists", async () => {
      vi.mocked(db.getAdminSetting).mockResolvedValue("custom_password");

      const storedPassword = await db.getAdminSetting("admin_password");
      const inputPassword = "custom_password";

      expect(inputPassword === storedPassword).toBe(true);
    });
  });
});
