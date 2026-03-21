import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { QuestionData, ComputedStats } from '@/types';
import { generateInsight } from '@/lib/analysis';
import { Badge } from '@/components/ui/badge';

interface ChapterWeightageChartProps {
  data: QuestionData[];
  stats: ComputedStats;
}

const DOMAIN_COLORS: Record<string, string> = {
  Physics: 'hsl(220, 80%, 55%)',
  Chemistry: 'hsl(150, 60%, 45%)',
  Maths: 'hsl(280, 70%, 55%)',
  Mathematics: 'hsl(280, 70%, 55%)',
};

export const ChapterWeightageChart = ({ data, stats }: ChapterWeightageChartProps) => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const chartData = useMemo(() => {
    const total = stats.totalQuestions || 1;
    return stats.chapterWeightage.slice(0, 10).map((item) => ({
      name: item._id.chapter,
      value: item.count,
      percentage: Math.round((item.count / total) * 100),
      domain: item._id.domain,
      color: DOMAIN_COLORS[item._id.domain] || 'hsl(192, 75%, 50%)',
    }));
  }, [stats]);

  // Topic drill-down: filter from full data array for the selected chapter
  const topicData = useMemo(() => {
    if (!selectedChapter) return [];
    const chapterSlice = data.filter((item) => item.chapter === selectedChapter);
    const counts = chapterSlice.reduce((acc, item) => {
      acc[item.topic] = (acc[item.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / chapterSlice.length) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, selectedChapter]);

  const insight = useMemo(() => generateInsight(data, 'chapter'), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{d.name}</p>
          <p className="text-sm text-muted-foreground">
            {d.value} questions ({d.percentage}%)
          </p>
          {d.domain && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {d.domain}
            </Badge>
          )}
        </div>
      );
    }
    return null;
  };

  const displayData = selectedChapter ? topicData : chartData;

  return (
    <div className="chart-container animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">
            {selectedChapter ? (
              <button
                onClick={() => setSelectedChapter(null)}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                ← Topic Breakdown: {selectedChapter}
              </button>
            ) : (
              'Chapter-wise Weightage'
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {selectedChapter
              ? 'Distribution across topics (click to go back)'
              : 'Click a bar to see topic breakdown'}
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Top {displayData.length}
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              cursor={selectedChapter ? 'default' : 'pointer'}
              onClick={(entry) => {
                if (!selectedChapter) setSelectedChapter(entry.name);
              }}
            >
              {displayData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    selectedChapter
                      ? 'hsl(192, 75%, 50%)'
                      : (entry as any).color || 'hsl(192, 75%, 50%)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!selectedChapter && chartData.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {chartData.slice(0, 3).map((item) => (
            <Badge
              key={item.name}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setSelectedChapter(item.name)}
            >
              {item.name}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-accent/50 rounded-lg border border-accent">
        <div className="flex gap-2">
          <Lightbulb className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-accent-foreground leading-relaxed">{insight}</p>
        </div>
      </div>
    </div>
  );
};
