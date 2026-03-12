import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { QuestionData, generateInsight, topics } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface ChapterWeightageChartProps {
  data: QuestionData[];
  stats?: any;
}

const DOMAIN_COLORS = {
  Physics: 'hsl(220, 80%, 55%)',
  Chemistry: 'hsl(150, 60%, 45%)',
  Maths: 'hsl(280, 70%, 55%)',
};

export const ChapterWeightageChart = ({ data, stats }: ChapterWeightageChartProps) => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const chartData = useMemo(() => {
    if (stats?.chapterWeightage) {
      const totalQs = stats.totalQuestions || 1;
      return stats.chapterWeightage.slice(0, 10).map((item: any) => ({
        name: item._id.chapter,
        value: item.count,
        percentage: Math.round((item.count / totalQs) * 100),
        domain: item._id.domain,
        color: DOMAIN_COLORS[item._id.domain as keyof typeof DOMAIN_COLORS] || 'hsl(192, 75%, 50%)',
      }));
    }

    const counts = data.reduce((acc, item) => {
      if (!acc[item.chapter]) {
        acc[item.chapter] = { count: 0, domain: item.domain };
      }
      acc[item.chapter].count++;
      return acc;
    }, {} as Record<string, { count: number; domain: string }>);

    return Object.entries(counts)
      .map(([name, { count, domain }]) => ({
        name,
        value: count,
        percentage: Math.round((count / data.length) * 100),
        domain,
        color: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] || 'hsl(192, 75%, 50%)',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data, stats]);

  const topicData = useMemo(() => {
    if (!selectedChapter) return [];
    
    const chapterData = data.filter(item => item.chapter === selectedChapter);
    const counts = chapterData.reduce((acc, item) => {
      acc[item.topic] = (acc[item.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / chapterData.length) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, selectedChapter]);

  const insight = useMemo(() => generateInsight(data, 'chapter'), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} questions ({data.percentage}%)
          </p>
          <Badge variant="secondary" className="mt-1 text-xs">
            {data.domain}
          </Badge>
        </div>
      );
    }
    return null;
  };

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
              : 'Click on a bar to see topic breakdown'}
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Top {selectedChapter ? topicData.length : Math.min(10, chartData.length)}
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={selectedChapter ? topicData : chartData}
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
              onClick={(data) => {
                if (!selectedChapter && topics[data.name]) {
                  setSelectedChapter(data.name);
                }
              }}
            >
              {(selectedChapter ? topicData : chartData).map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={selectedChapter ? 'hsl(192, 75%, 50%)' : entry.color || 'hsl(192, 75%, 50%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!selectedChapter && chartData.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {chartData.slice(0, 3).map((item: any) => (
            <Badge 
              key={item.name}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-muted transition-colors"
              onClick={() => topics[item.name] && setSelectedChapter(item.name)}
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
