"use client";

const PROMPTS = [
  "Explain streaming responses like I'm new to APIs",
  "Write a haiku about shipping fast",
  "Give me 3 ideas for a weekend project",
  "What's the difference between SSE and WebSockets?",
];

export default function ChatEmptyState({ onPrompt }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
        </svg>
      </span>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Streaming Chat
        </h2>
        <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Responses stream in token-by-token. Try a prompt below to see it in action.
        </p>
      </div>
      <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPrompt(prompt)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5 dark:hover:text-zinc-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
