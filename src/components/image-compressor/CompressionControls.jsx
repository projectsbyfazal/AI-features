"use client";

const MAX_WIDTH_OPTIONS = [
  { value: 0, label: "Original" },
  { value: 1920, label: "1920px" },
  { value: 1280, label: "1280px" },
  { value: 800, label: "800px" },
  { value: 500, label: "500px" },
];

export default function CompressionControls({ fileType, quality, onQualityChange, maxWidth, onMaxWidthChange, disabled }) {
  const isSvg = fileType === "image/svg+xml";
  const qualityApplies = fileType === "image/jpeg";

  if (isSvg) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
        SVGs are compressed by minifying their markup (comments, indentation and
        extra whitespace removed) — no quality settings needed.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="quality" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Quality
          </label>
          <span className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
            {qualityApplies ? `${Math.round(quality * 100)}%` : "Lossless"}
          </span>
        </div>
        <input
          id="quality"
          type="range"
          min={0.3}
          max={0.95}
          step={0.05}
          value={quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          disabled={disabled || !qualityApplies}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700"
        />
        {!qualityApplies && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            This format is lossless — use resize below to reduce size further.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Resize (max width)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {MAX_WIDTH_OPTIONS.map((opt) => {
            const active = maxWidth === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={disabled}
                onClick={() => onMaxWidthChange(opt.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
