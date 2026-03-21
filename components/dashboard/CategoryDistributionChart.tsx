import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Lightbulb } from "lucide-react";
import { QuestionData, ComputedStats } from "@/types";
import { generateInsight } from "@/lib/analysis";

interface CategoryDistributionChartProps {
  data: QuestionData[];
  stats: ComputedStats;
}

const COLORS = {
  Fact: "hsl(192, 75%, 50%)",
  Formula: "hsl(260, 65%, 55%)",
  Conceptual: "hsl(330, 70%, 55%)",
};

export const CategoryDistributionChart = ({
  data,
  stats,
}: CategoryDistributionChartProps) => {
  const chartData = useMemo(() => {
    const total = stats.totalQuestions || 1;
    return stats.categoryDistribution.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
      percentage: Math.round((item.count / total) * 100),
    }));
  }, [stats]);

  const insight = useMemo(() => generateInsight(data, "category"), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{d.name}</p>
          <p className="text-sm text-muted-foreground">
            {d.value} questions ({d.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Category Distribution</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Question types across selected filters
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          n={stats.totalQuestions}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[entry.name as keyof typeof COLORS] ||
                    COLORS.Conceptual
                  }
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
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
