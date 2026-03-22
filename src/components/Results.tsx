"use client";

import { useState } from "react";
import type { CompareResponse } from "@/lib/types";

interface ResultsProps {
  data: CompareResponse;
  file1Name: string;
  file2Name: string;
  onReset: () => void;
}

export default function Results({ data, file1Name, file2Name, onReset }: ResultsProps) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(data.ghCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = data.ghCommand;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Summary</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">{file1Name}</code>
          <span>and</span>
          <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">{file2Name}</code>
        </div>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>

      {/* Differences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Differences ({data.differences.length})
          </h2>
        </div>
        <ol className="space-y-3">
          {data.differences.map((diff, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-700 text-sm leading-relaxed">{diff}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* GitHub CLI Command */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              GitHub CLI Command
            </h2>
          </div>
          <button
            onClick={copyCommand}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <code className="text-sm text-green-400 whitespace-pre-wrap break-all font-mono">
            {data.ghCommand}
          </code>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Run this command in your repository directory with the{" "}
          <a href="https://cli.github.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            GitHub CLI
          </a>{" "}
          installed and authenticated.
        </p>
      </div>

      {/* Reset */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start over
        </button>
      </div>
    </div>
  );
}
