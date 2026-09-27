"use client";

import { formatBytes } from "@/lib/image-compression";

export default function SizeMeter({ originalBytes, compressedBytes }) {
  const reduction = Math.max(0, Math.round((1 - compressedBytes / originalBytes) * 100));
  const fillPct = Math.min(100, Math.max(3, (compressedBytes / originalBytes) * 100));

  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
          -{reduction}%
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">smaller</span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950/50">
        <div
          className="h-full rounded-full bg-indigo-500 transition-[width] duration-500 ease-out dark:bg-indigo-400"
          style={{ width: `${fillPct}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>Compressed: {formatBytes(compressedBytes)}</span>
        <span>Original: {formatBytes(originalBytes)}</span>
      </div>
    </div>
  );
}
