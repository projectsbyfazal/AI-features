"use client";

import TypingIndicator from "./TypingIndicator";
import ReactMarkdown from "react-markdown";

function Avatar({ role }) {
  if (role === "user") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
        You
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">
      AI
    </span>
  );
}

export default function ChatMessage({ message, onRetry }) {
  const isUser = message.role === "user";
  const waitingForFirstToken = message.status === "streaming" && message.content === "";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={message.role} />

      <div className={`flex max-w-[80%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${isUser
              ? "bg-indigo-600 text-white"
              : message.status === "error"
                ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                : "border border-zinc-200 bg-[#f2f2f2] text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            }`}
        >
          {message.status === "error" ? (
            <p>{message.error || "Something went wrong generating this reply."}</p>
          ) : waitingForFirstToken ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap">
              <ReactMarkdown >
                {message.content}
              </ReactMarkdown>
              {message.status === "streaming" && (
                <span className="ml-0.5 inline-block h-4 w-1.5 -translate-y-0.5 animate-pulse bg-indigo-500 align-middle dark:bg-indigo-400" />
              )}
            </div>
          )}
        </div>

        {message.status === "stopped" && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Stopped generating</span>
        )}
        {message.status === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
