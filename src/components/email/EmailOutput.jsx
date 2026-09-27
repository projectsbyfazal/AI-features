"use client";

import CopyButton from "@/components/ui/CopyButton";

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-2.5">
        <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-10/12 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-9/12 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18v12H3V6Zm0 0 9 7 9-7" />
        </svg>
      </span>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Your generated email will appear here
      </p>
    </div>
  );
}

export default function EmailOutput({ loading, error, result }) {
  const fullEmail = result
    ? `Subject: ${result.subject}\n\n${result.greeting ? result.greeting + "\n\n" : ""}${result.body}${result.signOff ? "\n\n" + result.signOff : ""
    }`
    : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Generated email
        </span>
        <CopyButton text={fullEmail} disabled={loading || !result} label="Copy email" />
      </div>

      <div className="min-h-[360px] rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="p-5">
            <Skeleton />
          </div>
        ) : error ? (
          <p className="p-5 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : result ? (
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Subject
                </p>
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {result.subject}
                </p>
              </div>
              <CopyButton text={result.subject} label="Copy" />
            </div>

            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Body
                </p>
                <CopyButton text={result.body} label="Copy" />
              </div>
              <div className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-50">
                {result.greeting && <p className="mb-3">{result.greeting}</p>}
                <p>{result.body}</p>
                {result.signOff && <p className="mt-3">{result.signOff}</p>}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}