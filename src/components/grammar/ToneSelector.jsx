"use client"; 

export const TONES = [
  { value: "neutral", label: "Neutral" },
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "confident", label: "Confident" },
];

export default function ToneSelector({ value, onChange, disabled }) {

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Tone
      </span>
      <div className="flex flex-wrap gap-1.5">
        {TONES.map((tone) => {
          const active = value === tone.value;
          return (
            <button
              key={tone.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(tone.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                active
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {tone.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
