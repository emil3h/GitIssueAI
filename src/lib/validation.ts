import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_LABEL } from "./constants";

export function validateFileExtension(filename: string): string | null {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return `File "${filename}" has an unsupported type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }
  return null;
}

export function validateFileSize(size: number, filename: string): string | null {
  if (size > MAX_FILE_SIZE_BYTES) {
    return `File "${filename}" exceeds the ${MAX_FILE_SIZE_LABEL} size limit.`;
  }
  return null;
}
