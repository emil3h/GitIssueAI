"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import SampleDropdown from "@/components/SampleDropdown";
import Results from "@/components/Results";
import type { FileData, CompareResponse } from "@/lib/types";

export default function Home() {
  const [file1, setFile1] = useState<FileData | null>(null);
  const [file2, setFile2] = useState<FileData | null>(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompareResponse | null>(null);

  const canCompare = file1 && file2 && !loading;

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file1Content: file1.content,
          file2Content: file2.content,
          file1Name: file1.name,
          file2Name: file2.name,
          instructions: instructions.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResults(data as CompareResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setInstructions("");
    setResults(null);
    setError(null);
  };

  const handleSampleSelect = (f1: FileData, f2: FileData) => {
    setFile1(f1);
    setFile2(f2);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <Header />

        {/* Upload Section */}
        {!results && (
          <div className="space-y-6">
            {/* Sample content button */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Upload or try sample content
              </h2>
              <SampleDropdown onSelect={handleSampleSelect} disabled={loading} />
            </div>

            {/* File uploads side-by-side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <FileUpload
                label="File 1 (original)"
                file={file1}
                onFile={setFile1}
                onError={setError}
                disabled={loading}
              />
              <FileUpload
                label="File 2 (modified)"
                file={file2}
                onFile={setFile2}
                onError={setError}
                disabled={loading}
              />
            </div>

            {/* Optional instructions */}
            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional instructions{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={loading}
                rows={2}
                placeholder="e.g. Focus on security changes, ignore formatting..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 transition-shadow"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="mt-0.5 text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Compare button */}
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className="w-full py-3 px-6 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing with AI…
                </span>
              ) : (
                "Analyze changes"
              )}
            </button>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <Results
            data={results}
            file1Name={file1?.name ?? ""}
            file2Name={file2?.name ?? ""}
            onReset={handleReset}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>
            GitIssueAI — Built with Next.js, Tailwind CSS, and OpenAI.{" "}
            <a
              href="https://github.com/emil3h/GitIssueAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
