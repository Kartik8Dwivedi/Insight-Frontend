import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Lightbulb } from "lucide-react";
import { QuestionData, ComputedStats } from "@/types";
import { generateInsight } from "@/lib/analysis";

interface YearTrendChartProps {
  data: QuestionData[];
  stats: ComputedStats;
}

const CATEGORY_COLORS = {
  Fact: "hsl(192, 75%, 50%)",
  Formula: "hsl(260, 65%, 55%)",
  Conceptual: "hsl(330, 70%, 55%)",
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

    // Collect all years present in trend data
    for (const entry of stats.yearTrend) {
      const yr = entry._id.year;
      if (!yearlyData[yr])
        yearlyData[yr] = { Fact: 0, Formula: 0, Conceptual: 0, total: 0 };
      const cat = entry._id.category || "Conceptual";
      yearlyData[yr][cat] = (yearlyData[yr][cat] ?? 0) + entry.count;
      yearlyData[yr].total += entry.count;
    }

    return Object.entries(yearlyData)
      .map(([yearStr, counts]) => {
        const total = counts.total || 1;
        return {
          year: yearStr,
          Fact: Math.round((counts.Fact / total) * 100),
          Formula: Math.round((counts.Formula / total) * 100),
          Conceptual: Math.round((counts.Conceptual / total) * 100),
          total: counts.total,
        };
      })
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [stats]);

  const insight = useMemo(() => generateInsight(data, "trend"), [data]);

  const yearRange = chartData.length
    ? `${chartData[0].year}–${chartData[chartData.length - 1].year}`
    : "—";

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
          {yearRange}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
            {(["Fact", "Formula", "Conceptual"] as const).map((cat) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={CATEGORY_COLORS[cat]}
                strokeWidth={2}
                dot={{ r: 4, fill: CATEGORY_COLORS[cat] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-accent/50 rounded-lg border border-accent">
        <div className="flex gap-2">
          <Lightbulb className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-accent-foreground leading-relaxed">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
};
