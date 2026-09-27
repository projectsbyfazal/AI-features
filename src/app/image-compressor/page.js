"use client";

import { useEffect, useState } from "react";
import Dropzone from "@/components/image-compressor/Dropzone";
import CompressionControls from "@/components/image-compressor/CompressionControls";
import ProcessingOverlay, { PROCESSING_STEPS } from "@/components/image-compressor/ProcessingOverlay";
import ResultCard from "@/components/image-compressor/ResultCard";
import { compressImage } from "@/lib/image-compression";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withMinDuration(promise, ms) {
  const [value] = await Promise.all([promise, wait(ms)]);
  return value;
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(0.75);
  const [maxWidth, setMaxWidth] = useState(0);
  const [stage, setStage] = useState(null); // null = idle, number = processing step
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [resultPreview, setResultPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!result) {
      setResultPreview(null);
      return;
    }
    const url = URL.createObjectURL(result.blob);
    setResultPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [result]);

  function handleSelect(selected) {
    setFile(selected);
    setResult(null);
    setError(null);
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setError(null);
    setStage(null);
  }

  async function handleCompress() {
    if (!file) return;

    setError(null);
    setResult(null);
    setStage(0);

    try {
      await withMinDuration(Promise.resolve(), 350);
      setStage(1);

      const compressed = await withMinDuration(
        compressImage(file, { quality, maxWidth }),
        500
      );

      setStage(2);
      await withMinDuration(Promise.resolve(), 350);

      setResult(compressed);
    } catch (err) {
      setError(err.message || "Something went wrong while compressing this image.");
    } finally {
      setStage(null);
    }
  }

  const processing = stage !== null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="flex flex-col gap-5">
        <Dropzone
          file={file}
          preview={preview}
          onSelect={handleSelect}
          onClear={handleReset}
          disabled={processing}
        />

        {file && !result && !processing && (
          <>
            <CompressionControls
              fileType={file.type}
              quality={quality}
              onQualityChange={setQuality}
              maxWidth={maxWidth}
              onMaxWidthChange={setMaxWidth}
              disabled={processing}
            />

            <button
              type="button"
              onClick={handleCompress}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition-colors hover:bg-indigo-700"
            >
              Compress image
            </button>
          </>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {processing && <ProcessingOverlay stage={stage} steps={PROCESSING_STEPS} />}

        {result && !processing && (
          <ResultCard
            originalFile={file}
            result={result}
            preview={resultPreview}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
