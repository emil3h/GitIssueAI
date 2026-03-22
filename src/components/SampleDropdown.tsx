"use client";

import { useState, useRef, useEffect } from "react";
import { samplePairs } from "@/data/samples";
import type { SamplePair, FileData } from "@/lib/types";

interface SampleDropdownProps {
  onSelect: (file1: FileData, file2: FileData) => void;
  disabled?: boolean;
}

export default function SampleDropdown({ onSelect, disabled }: SampleDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (sample: SamplePair) => {
    onSelect(sample.file1, sample.file2);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        Try sample content
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Choose sample content to try the app
            </p>
          </div>
          <div className="py-1">
            {samplePairs.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelect(sample)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{sample.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sample.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
