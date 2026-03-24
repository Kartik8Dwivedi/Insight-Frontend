"use client";

import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { DifficultyHeatmap } from "@/components/dashboard/DifficultyHeatmap";
import { ChapterWeightageChart } from "@/components/dashboard/ChapterWeightageChart";
import { YearTrendChart } from "@/components/dashboard/YearTrendChart";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { FeedbackModal } from "@/components/dashboard/FeedbackModal";
import { FilterState } from "@/types";
import { defaultFilters, filterData, computeStats } from "@/lib/analysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useTracker } from "@/hooks/useTracker";
import { AlertCircle } from "lucide-react";

const DashboardPage = () => {
  const { allData, loading, error } = useAnalyticsData();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { trackFilterUsed, trackAISearch, trackFeedbackOpened } =
    useTracker("dashboard");

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

  // Sum of all history[] lengths = actual question appearances (15,645), not topic records (305)
  const totalOccurrences = useMemo(
    () => allData.reduce((sum, q) => sum + q.history.length, 0),
    [allData],
  );

  const handleFilterChange = useCallback(
    (next: FilterState) => {
      // Track which filter changed
      const changed = (Object.keys(next) as (keyof FilterState)[]).find((k) => {
        const a = JSON.stringify(next[k]);
        const b = JSON.stringify(filters[k]);
        return a !== b;
      });
      if (changed)
        trackFilterUsed(changed, JSON.stringify(next[changed]).slice(0, 60));
      setFilters(next);
    },
    [filters, trackFilterUsed],
  );

  const handleAIFilters = useCallback((aiFilters: FilterState) => {
    setFilters(aiFilters);
  }, []);

  const handleOpenFeedback = useCallback(() => {
    trackFeedbackOpened();
    setFeedbackOpen(true);
  }, [trackFeedbackOpened]);

  return (
    <div className="h-screen bg-background overflow-y-hidden flex flex-col relative w-full">
      <Header 
        onApplyFilters={handleAIFilters} 
        currentFilters={filters} 
        onToggleMobileFilters={() => setIsMobileFiltersOpen(true)}
      />
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* Mobile Filter Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileFiltersOpen(false)} 
          />
          {/* Panel */}
          <div className="relative w-[300px] max-w-[85vw] bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold tracking-tight">Filters</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)} className="h-8 w-8 rounded-full">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <FilterPanel
                chapters={chapters}
                topics={topics}
                filters={filters}
                onFilterChange={handleFilterChange}
                className="w-full h-full border-r-0"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden w-full">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-4 bg-muted/5 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <Loader className="animate-spin text-primary relative z-10" size={32} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-foreground font-bold tracking-tight">Gathering exam insights...</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Processing 15,000+ data points</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex justify-center items-center bg-muted/5 p-6 animate-in fade-in">
            <div className="text-center p-8 max-w-md bg-card border border-destructive/20 rounded-2xl shadow-xl shadow-destructive/5">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-destructive" size={32} />
              </div>
              <h2 className="font-bold text-lg text-foreground mb-2">Connection Error</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                We couldn't load the analytics data. This might be due to a temporary network issue.
                <br /><span className="text-xs italic mt-2 block opacity-70">({error})</span>
              </p>
              <Button 
                variant="default"
                className="w-full h-11 rounded-xl font-bold transition-all hover:translate-y-[-2px] active:translate-y-[1px]" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Filter Panel */}
            <div className="hidden md:block shrink-0">
              <FilterPanel
                chapters={chapters}
                topics={topics}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <ScrollArea className="h-[calc(100vh-80px)] flex-1 min-w-0">
              <main className="p-6 space-y-6">
                <SummaryPanel
                  data={filteredData}
                  stats={stats}
                  totalQuestions={totalOccurrences}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategoryDistributionChart data={filteredData} stats={stats} />
                  <DifficultyHeatmap data={filteredData} stats={stats} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChapterWeightageChart data={filteredData} stats={stats} />
                  <YearTrendChart data={filteredData} stats={stats} />
                </div>
                <div className="text-center py-8 border-t border-border/50">
                  <p className="text-sm text-muted-foreground font-medium">
                    Data based on JEE Main pattern analysis (2002–2025) •{" "}
                    <span className="font-mono text-foreground font-bold">
                      {stats.totalQuestions.toLocaleString()}
                    </span>{" "}
                    of{" "}
                    <span className="font-mono text-foreground font-bold">
                      {totalOccurrences.toLocaleString()}
                    </span>{" "}
                    questions selected
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
                    This dashboard provides strategic insights only. It is designed to help you 
                    prioritize your preparation based on historical data. No actual questions 
                    or solutions are displayed.
                  </p>
                </div>
              </main>
              <GoToFeedbackLink onOpenFeedback={handleOpenFeedback} />
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;



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

function GoToFeedbackLink({ onOpenFeedback }: { onOpenFeedback: () => void }) {
  return (
    <div className="w-fit max-w-[95%] mb-5 mx-auto p-4 flex flex-col items-center border-2 border-ei-accent rounded-2xl ">
      <h4 className="font-medium">Help us improve your experience.</h4>
      <p className="text-sm font-medium text-neutral-500 mb-3 text-center">
        Found a bug? Have a suggestion or Feature Request? Share your thoughts
        with us.
      </p>
      <button
        onClick={onOpenFeedback}
        className="group bg-ei-accent text-white border-none py-[7px] px-[20px] rounded-full text-sm font-semibold cursor-pointer inline-flex items-center gap-2 transition-all duration-200 ease-linear shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5"
      >
        Give Feedback
        <ArrowIcon />
      </button>
    </div>
  );
}
