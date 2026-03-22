"use client";

import { useCallback, useRef } from "react";
import type { FileData } from "@/lib/types";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_LABEL } from "@/lib/constants";
import { validateFileExtension, validateFileSize } from "@/lib/validation";

interface FileUploadProps {
  label: string;
  file: FileData | null;
  onFile: (file: FileData | null) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
}

export default function FileUpload({ label, file, onFile, onError, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (f: File) => {
      const extError = validateFileExtension(f.name);
      if (extError) {
        onError(extError);
        return;
      }
      const sizeError = validateFileSize(f.size, f.name);
      if (sizeError) {
        onError(sizeError);
        return;
      }
      try {
        const content = await f.text();
        onFile({ name: f.name, content });
      } catch {
        onError(`Failed to read "${f.name}". Make sure it's a text file.`);
      }
    },
    [onFile, onError]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clear = () => {
    onFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="border border-gray-200 rounded-xl bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-mono font-semibold">
                {file.name.slice(file.name.lastIndexOf("."))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.content.length / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              disabled={disabled}
              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 p-1"
              aria-label={`Remove ${file.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer p-8 text-center"
        >
          <svg className="w-8 h-8 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">
            Drop a file here or <span className="text-blue-600">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1.5">
            {ALLOWED_EXTENSIONS.join(", ")} — max {MAX_FILE_SIZE_LABEL}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
