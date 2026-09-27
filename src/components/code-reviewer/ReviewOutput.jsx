"use client";

import CopyButton from "@/components/ui/CopyButton";

const SEVERITY = {
  critical: {
    label: "Critical",
    badge: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-500",
  },
  warning: {
    label: "Warning",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  suggestion: {
    label: "Suggestion",
    badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    dot: "bg-indigo-500",
  },
  praise: {
    label: "Nice",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

function severityInfo(severity) {
  return SEVERITY[severity] ?? SEVERITY.suggestion;
}

function scoreColor(score) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 p-5">
      <div className="h-3.5 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3.5 w-10/12 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2 h-16 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-16 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6-6 6 6 6m6-12 6 6-6 6" />
        </svg>
      </span>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Your review will appear here
      </p>
    </div>
  );
}

export default function ReviewOutput({ loading, error, result }) {
  const reviewText = result
    ? `Score: ${result.score}/100\n\n${result.summary}\n\n${(result.issues || [])
        .map(
          (issue, i) =>
            `${i + 1}. [${severityInfo(issue.severity).label}]${
              issue.line ? ` (line ${issue.line})` : ""
            } ${issue.title}\n${issue.description}${
              issue.suggestion ? `\nSuggestion: ${issue.suggestion}` : ""
            }`
        )
        .join("\n\n")}`
    : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Review
        </span>
        <CopyButton text={reviewText} disabled={loading || !result} label="Copy review" />
      </div>

      <div className="min-h-[420px] rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <p className="p-5 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : result ? (
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="flex items-center gap-4 px-5 py-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-zinc-100 text-lg font-bold tabular-nums dark:border-zinc-800 ${scoreColor(
                  result.score
                )}`}
              >
                {result.score}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Overall score
                </p>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {result.summary}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Findings ({result.issues?.length || 0})
              </span>

              {result.issues?.length ? (
                <ul className="flex flex-col gap-2.5">
                  {result.issues.map((issue, i) => {
                    const info = severityInfo(issue.severity);
                    return (
                      <li
                        key={i}
                        className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${info.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
                            {info.label}
                          </span>
                          {issue.line != null && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              Line {issue.line}
                            </span>
                          )}
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {issue.title}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {issue.description}
                        </p>
                        {issue.suggestion && (
                          <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm leading-relaxed text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                            <span className="font-medium text-zinc-500 dark:text-zinc-400">
                              Suggestion:{" "}
                            </span>
                            {issue.suggestion}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No issues found — nice work!
                </p>
              )}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
