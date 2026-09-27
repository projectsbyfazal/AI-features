"use client";

export default function SegmentedControl({ label, options, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${active
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
