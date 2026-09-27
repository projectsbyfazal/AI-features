"use client";

import EmailPurposeSelector from "./EmailPurposeSelector";
import SegmentedControl from "@/components/ui/SegmentedControl";

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "apologetic", label: "Apologetic" },
  { value: "confident", label: "Confident" },
];

const LENGTHS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export default function EmailForm({ fields, onChange, disabled }) {
  const set = (key) => (value) => onChange({ ...fields, [key]: value });

  return (
    <div className="flex flex-col gap-5">
      <EmailPurposeSelector
        value={fields.purpose}
        onChange={set("purpose")}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="recipient" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Recipient <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            id="recipient"
            type="text"
            value={fields.recipient}
            onChange={(e) => set("recipient")(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Priya, Hiring Manager"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="sender" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Your name <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            id="sender"
            type="text"
            value={fields.sender}
            onChange={(e) => set("sender")(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Rikita"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="key-points" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Key points to include
        </label>
        <textarea
          id="key-points"
          value={fields.keyPoints}
          onChange={(e) => set("keyPoints")(e.target.value)}
          disabled={disabled}
          placeholder={"One point per line, e.g.\nRequest a 30 min call next week\nMention the Q3 proposal\nThank them for their time"}
          rows={6}
          className="w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
        />
      </div>

      <SegmentedControl label="Tone" options={TONES} value={fields.tone} onChange={set("tone")} disabled={disabled} />
      <SegmentedControl label="Length" options={LENGTHS} value={fields.length} onChange={set("length")} disabled={disabled} />
    </div>
  );
}
