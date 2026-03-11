import "fake-indexeddb/auto";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addMessage,
  createThread,
  db,
  setSetting,
} from "@/lib/db";

const { streamAIResponseMock, testAPIConnectionMock } = vi.hoisted(() => ({
  streamAIResponseMock: vi.fn(),
  testAPIConnectionMock: vi.fn(),
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    const MockDynamicComponent = () => null;
    return MockDynamicComponent;
  },
}));

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: vi.fn(() => undefined),
}));

vi.mock("@/lib/api", () => ({
  streamAIResponse: streamAIResponseMock,
  testAPIConnection: testAPIConnectionMock,
}));

vi.mock("@/lib/lifecycle", () => ({
  onAppStateChange: vi.fn(() => () => {}),
}));

vi.mock("@/lib/parser", () => ({
  parseFile: vi.fn(),
  formatFileContext: vi.fn(),
}));

vi.mock("@/components/Sidebar", () => ({
  Sidebar: () => null,
}));

vi.mock("@/components/SettingsSheet", () => ({
  SettingsSheet: () => null,
}));

vi.mock("@/components/ChatHeader", () => ({
  ChatHeader: () => null,
}));

vi.mock("@/components/ChatArea", () => ({
  ChatArea: ({
    threadId,
    sessionMessages,
    isTyping,
  }: {
    threadId: string | null;
    sessionMessages: Array<{ id: string; role: string; content: string }>;
    isTyping: boolean;
  }) => (
    <div>
      <div data-testid="thread-id">{threadId ?? "none"}</div>
      <div data-testid="is-typing">{String(isTyping)}</div>
      <ul data-testid="session-messages">
        {sessionMessages.map((message) => (
          <li key={message.id}>{`${message.role}:${message.content || "<empty>"}`}</li>
        ))}
      </ul>
    </div>
  ),
}));

vi.mock("@/components/ChatInput", () => ({
  ChatInput: ({
    onSubmit,
    onStop,
  }: {
    onSubmit: (message: string) => void;
    onStop: () => void;
  }) => (
    <div>
      <button type="button" onClick={() => onSubmit("hello")}>
        send
      </button>
      <button type="button" onClick={onStop}>
        stop
      </button>
    </div>
  ),
}));

vi.mock("@/components/Character/CharacterProfileSheet", () => ({
  CharacterProfileSheet: () => null,
}));

vi.mock("@/components/ConfirmDialog", () => ({
  ConfirmDialog: () => null,
  PromptDialog: () => null,
  SelectDialog: () => null,
}));

vi.mock("@/components/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import MineAIChat from "./page";

async function resetDatabase() {
  await db.delete();
  await db.open();
}

describe("MineAIChat recovery hardening", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
    testAPIConnectionMock.mockResolvedValue({ success: true });
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(async () => {
    cleanup();
    vi.restoreAllMocks();
    await db.delete();
  });

  it("keeps incognito conversation visible in-session without persisting new history", async () => {
    await setSetting("incognito_active", true);
    const thread = await createThread("Persisted shell", { persist: true });

    streamAIResponseMock.mockImplementation(
      async ({
        onChunk,
        onComplete,
      }: {
        onChunk: (chunk: string) => void;
        onComplete: () => void;
      }) => {
        onChunk("assistant reply");
        onComplete();
      },
    );

    render(<MineAIChat />);

    await waitFor(() => {
      expect(screen.getByTestId("thread-id").textContent).toBe(thread.id);
    });

    const threadCountBefore = await db.threads.count();
    const messageCountBefore = await db.messages.count();

    fireEvent.click(screen.getByRole("button", { name: "send" }));

    await waitFor(() => {
      expect(screen.getByText("user:hello")).toBeTruthy();
      expect(screen.getByText("ai:assistant reply")).toBeTruthy();
    });

    expect(await db.threads.count()).toBe(threadCountBefore);
    expect(await db.messages.count()).toBe(messageCountBefore);
    expect(await db.messages.where("threadId").equals(thread.id).count()).toBe(0);
  });

  it("removes the persisted empty assistant placeholder after a zero-token abort", async () => {
    await setSetting("incognito_active", false);
    const thread = await createThread("Abort me", { persist: true });

    streamAIResponseMock.mockImplementation(
      ({
        signal,
        onError,
      }: {
        signal: AbortSignal;
        onError: (error: Error) => void;
      }) =>
        new Promise<void>((resolve) => {
          const abort = () => {
            onError(new DOMException("Aborted", "AbortError"));
            resolve();
          };

          if (signal.aborted) {
            abort();
            return;
          }

          signal.addEventListener("abort", abort, { once: true });
        }),
    );

    render(<MineAIChat />);

    await waitFor(() => {
      expect(screen.getByTestId("thread-id").textContent).toBe(thread.id);
    });

    fireEvent.click(screen.getByRole("button", { name: "send" }));

    await waitFor(async () => {
      expect(await db.messages.count()).toBe(2);
    });

    fireEvent.click(screen.getByRole("button", { name: "stop" }));

    await waitFor(async () => {
      expect(await db.messages.count()).toBe(1);
    });

    const persistedMessages = await db.messages.where("threadId").equals(thread.id).sortBy("timestamp");
    expect(persistedMessages).toHaveLength(1);
    expect(persistedMessages[0]).toMatchObject({
      role: "user",
      content: "hello",
    });
  });

  it("cleans a pre-first-token assistant placeholder on the next load", async () => {
    const thread = await createThread("Reload me", { persist: true });
    await addMessage(thread.id, "user", "hello");
    await db.messages.add({
      id: "stale-empty-ai",
      threadId: thread.id,
      role: "ai",
      content: "",
      timestamp: new Date(),
    });

    render(<MineAIChat />);

    await waitFor(async () => {
      expect(await db.messages.get("stale-empty-ai")).toBeUndefined();
    });

    const persistedMessages = await db.messages.where("threadId").equals(thread.id).sortBy("timestamp");
    expect(persistedMessages.map((message) => message.role)).toEqual(["user"]);
  });
});
