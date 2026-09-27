"use client";

export const PURPOSES = [
  { value: "meeting-request", label: "Meeting request" },
  { value: "follow-up", label: "Follow-up" },
  { value: "introduction", label: "Introduction" },
  { value: "thank-you", label: "Thank you" },
  { value: "apology", label: "Apology" },
  { value: "job-application", label: "Job application" },
  { value: "sales-pitch", label: "Sales pitch" },
  { value: "custom", label: "Custom" },
];

export default function EmailPurposeSelector({ value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email-purpose" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Purpose
      </label>
      <select
        id="email-purpose"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full  rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
      >
        {PURPOSES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
