"use client";

import Editor from "react-simple-code-editor";
import { highlightCode } from "@/lib/code-highlight";
import { LANGUAGES } from "@/lib/code-languages";

const MAX_LENGTH = 8000;

export default function CodeInput({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  disabled,
}) {
  const count = code.length;
  const nearLimit = count > MAX_LENGTH * 0.9;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Your code
        </label>
        {code && (
          <button
            type="button"
            onClick={() => onCodeChange("")}
            disabled={disabled}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-600 disabled:opacity-50 dark:hover:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => {
          const active = language === lang.value;
          return (
            <button
              key={lang.value}
              type="button"
              disabled={disabled}
              onClick={() => onLanguageChange(lang.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                active
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white outline-none transition-colors focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-500/10">
        <Editor
          value={code}
          onValueChange={(value) => onCodeChange(value.slice(0, MAX_LENGTH))}
          highlight={(value) => highlightCode(value)}
          disabled={disabled}
          padding={16}
          textareaId="code-review-input"
          placeholder="Paste the code you'd like reviewed…"
          style={{
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: 13.5,
            lineHeight: 1.6,
            minHeight: 260,
          }}
          className="text-zinc-900 dark:text-zinc-50"
          textareaClassName="outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center justify-end">
        <span
          className={`text-xs tabular-nums ${
            nearLimit
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
