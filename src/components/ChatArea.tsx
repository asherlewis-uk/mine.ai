import { useRef, useEffect, useLayoutEffect, useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeBanner } from "./WelcomeBanner";
import { DateDivider } from "./DateDivider";
import { ErrorBoundary } from "./ErrorBoundary";
import { db, type Message } from "@/lib/db";

interface ChatAreaProps {
  threadId: string | null;
  sessionMessages?: Message[];
  isInitialLoadPending?: boolean;
  isTyping: boolean;
  bubbleStyle?: "default" | "modern" | "compact";
  characterAvatar?: string; // Optional character avatar
  onSuggestionClick?: (text: string) => void;
  keyboardOffset?: number;
}

export function ChatArea({
  threadId,
  sessionMessages = [],
  isInitialLoadPending = false,
  isTyping,
  bubbleStyle = "default",
  characterAvatar,
  onSuggestionClick,
  keyboardOffset = 0,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const persistedMessages = useLiveQuery(
    async () => {
      if (!threadId) return [];
      return db.messages
        .where("threadId")
        .equals(threadId)
        .sortBy("timestamp");
    },
    [threadId]
  );

  const messages = useMemo(() => {
    const combined = [
      ...(persistedMessages ?? []),
      ...sessionMessages,
    ];

    return combined.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }, [persistedMessages, sessionMessages]);

  // Auto-scroll to bottom when messages change (including streaming content updates)
  // useLiveQuery re-fires on every Dexie update, so this catches streaming tokens too
  // Use "instant" during streaming to prevent stacking smooth scroll animations
  const isTypingRef = useRef(isTyping);
  isTypingRef.current = isTyping;

  useLayoutEffect(() => {
    if (messages.length === 0) return;
    // Small delay to let the DOM update with new content
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: isTypingRef.current ? "instant" : "smooth",
      });
    });
  }, [messages]);

  // Also scroll when typing indicator appears
  useEffect(() => {
    if (isTyping) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [isTyping]);

  const isMessagesLoading =
    threadId !== null &&
    persistedMessages === undefined &&
    sessionMessages.length === 0;
  const shouldShowLoading = isInitialLoadPending || isMessagesLoading;
  const shouldShowWelcome = !shouldShowLoading && messages.length === 0;

  // ═══ Ghost Loading Box Fix ═══
  // Only show the TypingIndicator bouncing dots when the AI hasn't started
  // streaming content yet. Once the AI message has content, the ChatBubble
  // itself renders the streaming text, so the TypingIndicator would be a
  // ghost duplicate. Also, delay hiding briefly after stream ends to prevent
  // premature flicker.
  const [showIndicator, setShowIndicator] = useState(false);
  
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastAiMessageHasContent = lastMessage?.role === "ai" && (lastMessage.content?.trim().length ?? 0) > 0;

  useEffect(() => {
    if (isTyping && !lastAiMessageHasContent) {
      // Show indicator: AI is typing but no non-whitespace content has arrived yet
      setShowIndicator(true);
    } else if (!isTyping && showIndicator) {
      // Stream finished — delay hiding to prevent flicker
      const timer = setTimeout(() => setShowIndicator(false), 150);
      return () => clearTimeout(timer);
    } else if (lastAiMessageHasContent) {
      // Content has started streaming — hide indicator immediately
      setShowIndicator(false);
    }
  }, [isTyping, lastAiMessageHasContent, showIndicator]);

  return (
    <div
      className="flex-1 overflow-y-auto overscroll-contain pt-[calc(60px+env(safe-area-inset-top))]"
      style={{ paddingBottom: keyboardOffset > 0 ? `${keyboardOffset + 70}px` : 'calc(110px + env(safe-area-inset-bottom))' }}
    >
      {shouldShowLoading ? (
        <div
          className="flex min-h-full items-center justify-center px-6 pb-8 text-sm text-zinc-500"
          aria-busy="true"
        >
          Loading conversation...
        </div>
      ) : shouldShowWelcome ? (
        <WelcomeBanner onSuggestionClick={onSuggestionClick} />
      ) : (
        <>
          <DateDivider date={messages[0]?.timestamp} />
          <div className="flex flex-col gap-1 pb-2">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <ErrorBoundary key={msg.id} name="ChatBubble" fallback={
                  <div className="px-4 py-2 text-xs text-zinc-500 italic">Failed to render message</div>
                }>
                  <ChatBubble message={msg} bubbleStyle={bubbleStyle} characterAvatar={characterAvatar} />
                </ErrorBoundary>
              ))}
            </AnimatePresence>
            {showIndicator && <TypingIndicator characterAvatar={characterAvatar} />}
          </div>
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
