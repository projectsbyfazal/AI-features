"use client";

import { useRef, useState } from "react";
import { ACCEPTED_EXTENSIONS, formatBytes, validateImageFile } from "@/lib/image-compression";

export default function Dropzone({ file, preview, onSelect, onClear, disabled }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [dropError, setDropError] = useState(null);

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (!picked) return;

    const validationError = validateImageFile(picked);
    if (validationError) {
      setDropError(validationError);
      return;
    }

    setDropError(null);
    onSelect(picked);
  }

  if (file) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatBytes(file.size)} · {file.type.replace("image/", "").toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Remove image"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragActive
            ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:border-zinc-600"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Drag & drop an image, or click to browse
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            JPG, PNG, GIF or SVG — up to 15 MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />
      </div>
      {dropError && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{dropError}</p>
      )}
      <p className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s7-4.4 7-11V5l-7-3-7 3v6c0 6.6 7 11 7 11Z" />
        </svg>
        Processed entirely in your browser — your file is never uploaded anywhere
      </p>
    </div>
  );
}
