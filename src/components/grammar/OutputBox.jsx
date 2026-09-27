"use client";

import CopyButton from "@/components/ui/CopyButton";

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2.5">
      <div className="h-3.5 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3.5 w-10/12 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3.5 w-9/12 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4 4 16m0 0 5-12m-5 12h6M15 8l3 3m0 0 3-3m-3 3v9M4 20h4" />
        </svg>
      </span>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Your corrected text will appear here
      </p>
    </div>
  );
}

export default function OutputBox({ loading, error, result }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Corrected text
        </span>
        <CopyButton text={result?.correctedText} disabled={loading || !result} />
      </div>

      <div className="min-h-[260px] rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : result ? (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-50">
            {result.correctedText}
          </p>
        ) : (
          <EmptyState />
        )}
      </div>

      {result?.changes?.length > 0 && (
        <div className="mt-1 flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Suggestions ({result.changes.length})
          </span>
          <ul className="flex flex-col gap-2.5">
            {result.changes.map((change, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-red-600 line-through dark:bg-red-500/10 dark:text-red-400">
                  {change.before}
                </span>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {change.after}
                </span>
                {change.reason && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    — {change.reason}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
