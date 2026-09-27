"use client";

export const PROCESSING_STEPS = ["Reading image", "Compressing", "Finalizing"];

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProcessingOverlay({ stage }) {
  const pct = Math.round(((stage + 1) / PROCESSING_STEPS.length) * 100);
  const offset = CIRCUMFERENCE * (1 - (stage + 1) / PROCESSING_STEPS.length);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white px-6 py-10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r={RADIUS} fill="none" strokeWidth="6" className="stroke-indigo-100 dark:stroke-indigo-950/60" />
          <circle
            cx="32"
            cy="32"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="stroke-indigo-600 transition-[stroke-dashoffset] duration-500 ease-out dark:stroke-indigo-400"
          />
        </svg>
        <span className="absolute text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {pct}%
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {PROCESSING_STEPS.map((step, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <li key={step} className="flex items-center gap-2.5 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-200 text-transparent dark:bg-zinc-700"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : active ? (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                ) : null}
              </span>
              <span
                className={
                  done
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : active
                      ? "font-medium text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-400 dark:text-zinc-600"
                }
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}