"use client";

import SizeMeter from "./SizeMeter";

export default function ResultCard({ originalFile, result, preview, onReset }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Compression complete
        </span>
      </div>

      <div className="overflow-hidden rounded-xl bg-zinc-50 dark:bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Compressed preview" className="max-h-72 w-full object-contain" />
      </div>

      <SizeMeter originalBytes={originalFile.size} compressedBytes={result.blob.size} />

      {result.flattened && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          Animated GIFs can&apos;t be re-encoded in the browser, so this was flattened to a single compressed PNG frame.
        </p>
      )}

      <div className="flex gap-2">
        <a
          href={preview}
          download={buildFileName(originalFile.name, result.extension)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition-colors hover:bg-indigo-700"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16" />
          </svg>
          Download
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Compress another
        </button>
      </div>
    </div>
  );
}

function buildFileName(originalName, extension) {
  const base = originalName.replace(/\.[^/.]+$/, "");
  return `${base}-compressed.${extension}`;
}
