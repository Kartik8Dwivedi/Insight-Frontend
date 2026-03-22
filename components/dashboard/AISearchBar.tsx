"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/types";
import { defaultFilters } from "@/lib/analysis";

interface AISearchResult {
  filters: FilterState;
  explanation: string;
  confidence: "high" | "medium" | "low";
  noMatch: boolean;
  noMatchMessage: string;
}

interface AISearchBarProps {
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

const EXAMPLE_QUERIES = [
  "What are the trends for Buffers in Chemistry?",
  "Show me hard Mechanics questions from 2024–2025",
  "Organic reactions, formula-based only",
  "Modern Physics last 2 years",
  "Conceptual questions in Calculus",
];

function FilterTag({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  if (!display || display === "2021–2025") return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
      style={{
        background: "var(--color-background-info)",
        color: "var(--color-text-info)",
      }}
    >
      <span style={{ color: "var(--color-text-tertiary)" }}>{label}:</span>{" "}
      {display}
    </span>
  );
}

export function AISearchBar({
  onApplyFilters,
  currentFilters,
}: AISearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Open on Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    if (!open) {
      setQuery("");
      setResult(null);
      setError(null);
    }
  }, [open]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data: AISearchResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleApply = () => {
    if (!result || result.noMatch) return;
    onApplyFilters(result.filters);
    setOpen(false);
  };

  const hasFilters =
    result &&
    !result.noMatch &&
    (result.filters.domains.length > 0 ||
      result.filters.chapters.length > 0 ||
      result.filters.topics.length > 0 ||
      result.filters.categories.length > 0 ||
      result.filters.difficulties.length > 0 ||
      result.filters.yearRange[0] !== 2021 ||
      result.filters.yearRange[1] !== 2025);

  const yearDisplay =
    result && !result.noMatch
      ? result.filters.yearRange[0] === 2021 &&
        result.filters.yearRange[1] === 2025
        ? null
        : `${result.filters.yearRange[0]}–${result.filters.yearRange[1]}`
      : null;

  return (
    <>
      {/* Trigger button in header */}
      <div className="aurora-glow-container">
        <div className="aurora-glow"></div>
        <button
          onClick={() => setOpen(true)}
          className="btn-aurora text-sm"
          style={{ color: "var(--ei-ink-soft)" }}
        >
          <Sparkles className="ai-icon-pulse text-[#6c47ff]" />
          <span className="hidden sm:inline">AI Search</span>
          <kbd
            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ml-1"
            style={{
              background: "rgba(0,0,0,0.04)",
              color: "var(--ei-ink-muted)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
          style={{ 
            background: "rgba(15, 17, 23, 0.6)", 
            backdropFilter: "blur(6px)",
            transition: "all 0.2s ease-out"
          }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-xl rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] overflow-hidden border animate-in fade-in zoom-in-95 duration-200"
            style={{
              background: "var(--ei-white)",
              borderColor: "var(--ei-border)",
            }}
          >
            {/* Search input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-5 py-4 border-b"
              style={{ borderColor: "var(--ei-border)" }}
            >
              <div className="flex-shrink-0">
                {loading ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: "var(--color-text-tertiary)" }}
                  />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary" />
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything — 'buffers in chemistry', 'hard mechanics 2024', …"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--color-text-primary)" }}
                disabled={loading}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setResult(null);
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <X
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--color-text-tertiary)" }}
                    />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                  style={{
                    background: "var(--color-background-info)",
                    color: "var(--color-text-info)",
                  }}
                >
                  <Search className="w-3 h-3" />
                  Search
                </button>
              </div>
            </form>

            {/* Result area */}
            <div className="max-h-[50vh] overflow-y-auto">
              {!result && !error && !loading && (
                <div className="p-4">
                  <p
                    className="text-xs font-medium mb-3"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Try asking
                  </p>
                  <div className="space-y-1">
                    {EXAMPLE_QUERIES.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(q);
                          runSearch(q);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-muted/50 group"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <ChevronRight
                          className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--color-text-tertiary)" }}
                        />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="flex items-center gap-2 p-4 text-sm"
                  style={{ color: "var(--color-text-danger)" }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {result && (
                <div className="p-4 space-y-4">
                  {result.noMatch ? (
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "var(--color-background-warning)" }}
                    >
                      <AlertCircle
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: "var(--color-text-warning)" }}
                      />
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-warning)" }}
                        >
                          No matching filters
                        </p>
                        <p
                          className="text-sm mt-0.5"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {result.noMatchMessage}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Explanation */}
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {result.explanation}
                        </p>
                      </div>

                      {/* Filter tags */}
                      {hasFilters && (
                        <div className="flex flex-wrap gap-1.5">
                          {result.filters.domains.length > 0 && (
                            <FilterTag
                              label="Subject"
                              value={result.filters.domains}
                            />
                          )}
                          {result.filters.chapters.length > 0 && (
                            <FilterTag
                              label="Chapter"
                              value={result.filters.chapters}
                            />
                          )}
                          {result.filters.topics.length > 0 && (
                            <FilterTag
                              label="Topic"
                              value={result.filters.topics}
                            />
                          )}
                          {result.filters.categories.length > 0 && (
                            <FilterTag
                              label="Category"
                              value={result.filters.categories}
                            />
                          )}
                          {result.filters.difficulties.length > 0 && (
                            <FilterTag
                              label="Difficulty"
                              value={result.filters.difficulties}
                            />
                          )}
                          {yearDisplay && (
                            <FilterTag label="Years" value={yearDisplay} />
                          )}
                        </div>
                      )}

                      {/* Confidence badge */}
                      {result.confidence === "low" && (
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          Low confidence match — you can adjust filters manually
                          after applying.
                        </p>
                      )}

                      {/* Apply button */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleApply}
                          className="flex-1 rounded-xl bg-ei-accent text-white hover:bg-ei-accent-mid hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-semibold"
                        >
                          <Sparkles className="w-4 h-4 mr-2 opacity-80" />
                          Apply filters to dashboard
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setResult(null);
                            setQuery("");
                            inputRef.current?.focus();
                          }}
                          className="rounded-xl border-ei-border hover:bg-muted/50 text-muted-foreground"
                        >
                          Clear
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
