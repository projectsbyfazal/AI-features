"use client";

const MAX_LENGTH = 3000;

export default function GrammarInput({ value, onChange, disabled }) {
  const count = value.length;
  const nearLimit = count > MAX_LENGTH * 0.9;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="grammar-input"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Your text
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-600 disabled:opacity-50 dark:hover:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>

      <textarea
        id="grammar-input"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        disabled={disabled}
        placeholder="Paste or type the text you'd like to correct…"
        rows={12}
        className="w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
      />

      <div className="flex items-center justify-end">
        <span
          className={`text-xs tabular-nums ${nearLimit
            ? "text-amber-600 dark:text-amber-400"
            : "text-zinc-400 dark:text-zinc-500"
            }`}
        >
          {count.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
