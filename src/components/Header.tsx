"use client";

export default function Header() {
  return (
    <header className="pt-16 pb-10 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Git<span className="text-gray-900">Issue</span>AI
      </h1>
      <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
        Upload two files, compare them with AI, and generate a GitHub CLI command
        to create an issue with the differences.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Upload files
        </span>
        <span>→</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Analyze changes
        </span>
        <span>→</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Get GitHub issue
        </span>
      </div>
    </header>
  );
}
