"use client"

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart';
import { DifficultyHeatmap } from '@/components/dashboard/DifficultyHeatmap';
import { ChapterWeightageChart } from '@/components/dashboard/ChapterWeightageChart';
import { YearTrendChart } from '@/components/dashboard/YearTrendChart';
import { SummaryPanel } from '@/components/dashboard/SummaryPanel';
import { mockData, defaultFilters, filterData, FilterState, QuestionData } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from 'lucide-react';

interface DashboardProps{
  mockData:QuestionData[];
  chapters:Record<string,string[]>;
  topics:Record<string,string[]>;
}

const DashboardPage = ({
  mockData,
  chapters,
  topics,

}:DashboardProps) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filteredData,setFilteredData] = useState<QuestionData[]>(mockData); 
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
