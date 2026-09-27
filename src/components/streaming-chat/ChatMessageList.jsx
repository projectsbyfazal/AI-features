"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatEmptyState from "./ChatEmptyState";

const BOTTOM_THRESHOLD = 80;

export default function ChatMessageList({ messages, onPrompt, onRetry }) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isAtBottom) return;
    // Instant jump while tokens stream in — "smooth" scrolling here would
    // queue up and stutter since it fires on every chunk.
    el.scrollTop = el.scrollHeight;
  }, [messages, isAtBottom]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsAtBottom(distanceFromBottom < BOTTOM_THRESHOLD);
  }

  function scrollToBottom() {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setIsAtBottom(true);
  }

  if (messages.length === 0) {
    return <ChatEmptyState onPrompt={onPrompt} />;
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
           
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={message.status === "error" ? () => onRetry(message.id) : undefined}
              />
            ))} 
        </div>
      </div>

      {!isAtBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-md transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14m0 0 5-5m-5 5-5-5" />
          </svg>
          New messages
        </button>
      )}
    </div>
  );
}
