export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
];

export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.gif,.svg";

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function validateImageFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a JPG, PNG, GIF or SVG image.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large. Max size is ${formatBytes(MAX_FILE_SIZE)}.`;
  }
  return null;
}

/**
 * Compresses an image entirely in the browser — the file never leaves the
 * device. SVGs are minified as text; raster formats are re-encoded via canvas.
 */
export async function compressImage(file, { quality = 0.75, maxWidth = 0 } = {}) {
  if (file.type === "image/svg+xml") {
    return compressSvg(file);
  }
  return compressRaster(file, { quality, maxWidth });
}

async function compressSvg(file) {
  const text = await file.text();
  const minified = text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    blob: new Blob([minified], { type: "image/svg+xml" }),
    outputType: "image/svg+xml",
    extension: "svg",
    flattened: false,
  };
}

async function compressRaster(file, { quality, maxWidth }) {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  // Canvas can't re-encode animated GIFs, so they're flattened to a single PNG frame.
  const flattened = file.type === "image/gif";
  const outputType = flattened ? "image/png" : file.type;
  const extension = outputType === "image/jpeg" ? "jpg" : outputType.split("/")[1];
  const encodeQuality = outputType === "image/jpeg" ? quality : undefined;

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not encode image"))),
      outputType,
      encodeQuality
    )
  );

  return { blob, outputType, extension, flattened };
}
