"use client";
import { useState, useEffect } from "react";
import { QuestionData } from "@/types";
import { normalizeQuestion } from "@/lib/analysis";

const SESSION_KEY = "jee-analytics-v3"; // bump version to bust old cached shape

export function useAnalyticsData() {
  const [allData, setAllData] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try sessionStorage first — avoids re-fetching on navigation
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as QuestionData[];
        setAllData(parsed);
        setLoading(false);
        return;
      }
    } catch {
      // sessionStorage unavailable or corrupted — fall through to fetch
      sessionStorage.removeItem(SESSION_KEY);
    }

    fetch("/api/analytics")
      .then((r) => {
        if (!r.ok) throw new Error(`API returned ${r.status}`);
        return r.json();
      })
      .then((raw: any[]) => {
        const normalized = raw.map(normalizeQuestion);
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
        } catch {
          // sessionStorage quota exceeded (e.g. very large dataset) — skip caching
        }
        setAllData(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("useAnalyticsData fetch error:", err);
        setError(err.message ?? "Failed to load analytics data");
        setLoading(false);
      });
  }, []);

  return { allData, loading, error };
}