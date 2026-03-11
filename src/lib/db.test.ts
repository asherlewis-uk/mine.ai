import "fake-indexeddb/auto";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  addMessage,
  createCharacterThread,
  createThread,
  db,
  deleteEmptyAssistantMessages,
  setSetting,
} from "./db";

async function resetDatabase() {
  await db.delete();
  await db.open();
}

describe("db persistence hardening", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(async () => {
    await db.delete();
  });

  it("does not persist new thread records while incognito is active", async () => {
    await setSetting("incognito_active", true);

    const plainThread = await createThread("Incognito chat");
    const characterThread = await createCharacterThread(7, "Character chat");

    expect(plainThread.id).toMatch(/^thread_/);
    expect(characterThread.characterId).toBe(7);
    expect(await db.threads.count()).toBe(0);
  });

  it("removes only empty assistant placeholders during recovery cleanup", async () => {
    const thread = await createThread("Recover me", { persist: true });
    await addMessage(thread.id, "user", "hello");

    await db.messages.bulkAdd([
      {
        id: "empty-ai",
        threadId: thread.id,
        role: "ai",
        content: "",
        timestamp: new Date(),
      },
      {
        id: "whitespace-ai",
        threadId: thread.id,
        role: "ai",
        content: "   ",
        timestamp: new Date(),
      },
      {
        id: "real-ai",
        threadId: thread.id,
        role: "ai",
        content: "still here",
        timestamp: new Date(),
      },
    ]);

    await expect(deleteEmptyAssistantMessages()).resolves.toBe(2);

    expect(await db.messages.get("empty-ai")).toBeUndefined();
    expect(await db.messages.get("whitespace-ai")).toBeUndefined();
    expect(await db.messages.get("real-ai")).toMatchObject({
      content: "still here",
      role: "ai",
    });
  });
});
