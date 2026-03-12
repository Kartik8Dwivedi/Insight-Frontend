import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Lightbulb } from 'lucide-react';
import { QuestionData } from '@/types';
import { generateInsight } from '@/lib/analysis';

interface YearTrendChartProps {
  data: QuestionData[];
  stats?: any;
}

const CATEGORY_COLORS = {
  Fact: 'hsl(192, 75%, 50%)',
  Formula: 'hsl(260, 65%, 55%)',
  Conceptual: 'hsl(330, 70%, 55%)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">JEE Main {label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="font-mono">{item.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const YearTrendChart = ({ data, stats }: YearTrendChartProps) => {
  const chartData = useMemo(() => {
    const yearlyData: Record<number, Record<string, number>> = {};
    let years: number[] = [];
    
    // Fallback if data is empty or partial
    years.push((new Date()).getFullYear()); 

    if (stats?.yearTrend) {
      years = Array.from(new Set(stats.yearTrend.map((d: any) => d._id.year))).sort((a: any, b: any) => a - b) as number[];
    } else if (data.length > 0) {
      years = Array.from(new Set(data.map(d => d.year || 2024))).sort((a, b) => a - b);
    }
    
    // Initialize
    years.forEach(year => {
      yearlyData[year] = { Fact: 0, Formula: 0, Conceptual: 0, total: 0 };
    });

    if (stats?.yearTrend) {
      stats.yearTrend.forEach((item: any) => {
        const yr = item._id.year;
        const cat = item._id.category || 'Conceptual';
        if (yearlyData[yr]) {
           yearlyData[yr][cat] = (yearlyData[yr][cat] || 0) + item.count;
           yearlyData[yr].total += item.count;
        }
      });
    } else {
      // Count raw data
      data.forEach(item => {
        const yr = item.year || 2024;
        if (yearlyData[yr]) {
          yearlyData[yr][item.category || 'Conceptual']++;
          yearlyData[yr].total++;
        }
      });
    }

    // Convert to percentages
    return years.map(year => {
      const total = yearlyData[year].total || 1;
      return {
        year: year.toString(),
        Fact: Math.round((yearlyData[year].Fact / total) * 100),
        Formula: Math.round((yearlyData[year].Formula / total) * 100),
        Conceptual: Math.round((yearlyData[year].Conceptual / total) * 100),
        total: yearlyData[year].total,
      };
    });
  }, [data, stats]);

  const insight = useMemo(() => generateInsight(data, 'trend'), [data]);

  return (
    <div className="chart-container animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Year-wise Trend Analysis</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            How question patterns evolved over time
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          2019-2024
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="Fact"
              stroke={CATEGORY_COLORS.Fact}
              strokeWidth={2}
              dot={{ r: 4, fill: CATEGORY_COLORS.Fact }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Formula"
              stroke={CATEGORY_COLORS.Formula}
              strokeWidth={2}
              dot={{ r: 4, fill: CATEGORY_COLORS.Formula }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Conceptual"
              stroke={CATEGORY_COLORS.Conceptual}
              strokeWidth={2}
              dot={{ r: 4, fill: CATEGORY_COLORS.Conceptual }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-accent/50 rounded-lg border border-accent">
        <div className="flex gap-2">
          <Lightbulb className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-accent-foreground leading-relaxed">{insight}</p>
        </div>
      </div>
    </div>
  );
};
