"use client"

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart';
import { DifficultyHeatmap } from '@/components/dashboard/DifficultyHeatmap';
import { ChapterWeightageChart } from '@/components/dashboard/ChapterWeightageChart';
import { YearTrendChart } from '@/components/dashboard/YearTrendChart';
import { SummaryPanel } from '@/components/dashboard/SummaryPanel';
import { FilterState, QuestionData } from '@/types';
import { defaultFilters } from '@/lib/analysis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  mockData: QuestionData[];
  chapters: Record<string, string[]>;
  topics: Record<string, string[]>;
}

const DashboardPage = ({
  mockData,
  chapters,
  topics,

}: DashboardProps) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filteredData, setFilteredData] = useState<QuestionData[]>(mockData);
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams();
      if (filters.domains.length) query.set("domains", filters.domains.join(","));
      if (filters.chapters.length) query.set("chapters", filters.chapters.join(","));
      if (filters.topics.length) query.set("topics", filters.topics.join(","));
      if (filters.categories.length) query.set("categories", filters.categories.join(","));
      if (filters.difficulties.length) query.set("difficulties", filters.difficulties.join(","));
      if (filters.yearRange[0]) query.set("yearStart", filters.yearRange[0].toString());
      if (filters.yearRange[1]) query.set("yearEnd", filters.yearRange[1].toString());
      const response = await fetch(`/api/data?${query.toString()}`);
      const data = await response.json();
      setFilteredData(data.filteredData);
      setStats(data.stats);
    };
    fetchData();
  }, [filters]);

  return (
    <div className="h-screen bg-background overflow-y-hidden flex flex-col">
      <Header />
      <MobileOverlayForDesktopSiteSuggestion />
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        <FilterPanel
          chapters={chapters}
          topics={topics}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Main Content */}
        <ScrollArea className="h-[calc(100vh-80px)] flex-1">
          <main className="p-6 space-y-6">
            {/* Summary Panel */}
            <SummaryPanel data={filteredData} stats={stats} totalQuestions={mockData.length} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryDistributionChart data={filteredData} stats={stats} />
              <DifficultyHeatmap data={filteredData} stats={stats} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChapterWeightageChart data={filteredData} stats={stats} />
              <YearTrendChart data={filteredData} stats={stats} />
            </div>

            {/* Footer Info */}
            <div className="text-center py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Data based on JEE Main pattern analysis (2019-2024) •
                <span className="font-mono ml-1">{stats ? stats.totalQuestions : mockData.length}</span> questions analyzed
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This dashboard provides strategic insights only. No actual questions or solutions are displayed.
              </p>
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DashboardPage;


function MobileOverlayForDesktopSiteSuggestion() {
  const isMobile = useIsMobile()
  const [isContinueAnyway, setIsContinueAnyway] = useState(false);
  if (!isMobile || isContinueAnyway) return null;
  return (
    <section className='fixed inset-0 bg-black/30 z-50 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-3 items-center'>
        <h1 className='text-xl font-semibold tracking-tight'>Best Viewed on Desktop</h1>
        <p className=' text-center text-[15px] text-neutral-700' >
          If you are using a mobile device, please switch to <span className='font-semibold text-neutral-800'>Desktop Site</span> in your browser for the best experience.
        </p>
        <p className='text-sm text-neutral-600 my-4'>Mobile responsiveness is coming soon!</p>
        <Button className='w-full bg-ei-accent rounded-full text-white hover:bg-ei-accent-mid hover:-translate-y-[2px] transition-all duration-200' onClick={() => setIsContinueAnyway(true)}>Continue Anyway</Button>
      </div>
    </section>
  )
}