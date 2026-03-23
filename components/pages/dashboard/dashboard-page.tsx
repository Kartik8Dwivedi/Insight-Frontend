"use client";

import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { DifficultyHeatmap } from "@/components/dashboard/DifficultyHeatmap";
import { ChapterWeightageChart } from "@/components/dashboard/ChapterWeightageChart";
import { YearTrendChart } from "@/components/dashboard/YearTrendChart";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { FilterState } from "@/types";
import { defaultFilters, filterData, computeStats } from "@/lib/analysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { AlertCircle } from "lucide-react";

const DashboardPage = () => {
  const { allData, loading, error } = useAnalyticsData();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const { chapters, topics } = useMemo(() => {
    const chapters: Record<string, string[]> = {};
    const topics: Record<string, string[]> = {};
    for (const item of allData) {
      if (!chapters[item.domain]) chapters[item.domain] = [];
      if (!chapters[item.domain].includes(item.chapter))
        chapters[item.domain].push(item.chapter);
      if (!topics[item.chapter]) topics[item.chapter] = [];
      if (!topics[item.chapter].includes(item.topic))
        topics[item.chapter].push(item.topic);
    }
    return { chapters, topics };
  }, [allData]);

  const filteredData = useMemo(
    () => filterData(allData, filters),
    [allData, filters],
  );
  const stats = useMemo(() => computeStats(filteredData), [filteredData]);

  // Sum of all history[] lengths = 15,645 actual question appearances, not 305 topic records
  const totalOccurrences = useMemo(
    () => allData.reduce((sum, q) => sum + q.history.length, 0),
    [allData],
  );

  const handleFilterChange = useCallback(
    (next: FilterState) => setFilters(next),
    [],
  );
  const handleAIFilters = useCallback(
    (aiFilters: FilterState) => setFilters(aiFilters),
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center gap-2">
        <Loader className="animate-spin" size={20} />
        <p className="text-muted-foreground font-semibold">Loading data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="text-center p-8">
          <AlertCircle className="mx-auto mb-4 text-destructive" size={40} />
          <p className="font-semibold text-destructive">
            Failed to load analytics data
          </p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-y-hidden flex flex-col">
      <Header onApplyFilters={handleAIFilters} currentFilters={filters} />
      <MobileOverlay />
      <div className="flex flex-1 overflow-hidden">
        <FilterPanel
          chapters={chapters}
          topics={topics}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <ScrollArea className="h-[calc(100vh-80px)] flex-1">
          <main className="p-6 space-y-6">
            <SummaryPanel
              data={filteredData}
              stats={stats}
              totalQuestions={totalOccurrences}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryDistributionChart data={filteredData} stats={stats} />
              <DifficultyHeatmap data={filteredData} stats={stats} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChapterWeightageChart data={filteredData} stats={stats} />
              <YearTrendChart data={filteredData} stats={stats} />
            </div>
            <div className="text-center py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Data based on JEE Main pattern analysis (2002–2025) •{" "}
                <span className="font-mono">
                  {stats.totalQuestions.toLocaleString()}
                </span>{" "}
                of{" "}
                <span className="font-mono">
                  {totalOccurrences.toLocaleString()}
                </span>{" "}
                questions selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This dashboard provides strategic insights only. No actual
                questions or solutions are displayed.
              </p>
            </div>
          </main>
          <GoToFeedbackLink />
        </ScrollArea>
      </div>
    </div>
  );
};

export default DashboardPage;

function MobileOverlay() {
  const isMobile = useIsMobile();
  const [dismissed, setDismissed] = useState(false);
  if (!isMobile || dismissed) return null;
  return (
    <section className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-3 items-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Best Viewed on Desktop
        </h1>
        <p className="text-center text-[15px] text-neutral-700">
          Switch to{" "}
          <span className="font-semibold text-neutral-800">Desktop Site</span>{" "}
          in your browser for the best experience.
        </p>
        <p className="text-sm text-neutral-600 my-4">
          Mobile responsiveness is coming soon!
        </p>
        <Button
          className="w-full bg-ei-accent rounded-full text-white hover:bg-ei-accent-mid hover:-translate-y-[2px] transition-all duration-200"
          onClick={() => setDismissed(true)}
        >
          Continue Anyway
        </Button>
      </div>
    </section>
  );
}

const ArrowIcon = () => (
  <svg
    className="group-hover:translate-x-1 duration-200 transition-all"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

function GoToFeedbackLink() {
  return (
    <div className="w-fit max-w-[95%] mb-5 mx-auto p-4 flex flex-col items-center border-2 border-ei-accent rounded-2xl">
      <h4 className="font-medium">Help us improve your experience.</h4>
      <p className="text-sm font-medium text-neutral-500 mb-3 text-center">
        Found a bug? Have a suggestion or Feature Request? Share your thoughts
        with us.
      </p>
      <Link
        href={"/"}
        className="group bg-ei-accent text-white border-none py-[7px] px-[20px] rounded-full text-sm font-semibold cursor-pointer no-underline inline-flex items-center gap-2 transition-all duration-200 ease-linear shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5"
      >
        Give Feedback
        <ArrowIcon />
      </Link>
    </div>
  );
}

