"use client";

import { useEffect, useState } from "react";
import GrammarInput from "@/components/grammar/GrammarInput";
import ToneSelector, { TONES } from "@/components/grammar/ToneSelector";
import OutputBox from "@/components/grammar/OutputBox";

export default function GrammarPage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState(TONES[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [lastReqtext, setlastReqtext] = useState(null);

  const canSubmit = text.trim().length > 0 && !loading;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setResult(await res.json());
      setlastReqtext(text)
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <GrammarInput value={text} onChange={setText} disabled={loading} />
            <ToneSelector value={tone} onChange={setTone} disabled={loading} />

            <button
              type="submit"
              disabled={!canSubmit || lastReqtext === text}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                  </svg>
                  Correcting…
                </>
              ) : (
                "Correct my text"
              )}
            </button>
          </div>

          <OutputBox loading={loading} error={error} result={result} />
        </div>
      </form>
    </div>
  );
}
