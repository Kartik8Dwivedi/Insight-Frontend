import { useMemo } from "react";
import {
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  AlertTriangle,
  Award,
} from "lucide-react";
import { QuestionData, ComputedStats } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SummaryPanelProps {
  data: QuestionData[];
  totalQuestions: number;
  stats: ComputedStats;
}

interface InsightCard {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  type: "info" | "success" | "warning";
}

export const SummaryPanel = ({
  data,
  totalQuestions,
  stats,
}: SummaryPanelProps) => {
  const insights = useMemo((): InsightCard[] => {
    if (stats.totalQuestions === 0) {
      return [
        {
          icon: <AlertTriangle className="h-5 w-5" />,
          title: "No Data",
          value: "0 questions",
          description: "Adjust filters to see insights",
          type: "warning",
        },
      ];
    }

    const totalQs = stats.totalQuestions;

    const sortedCats = [...stats.categoryDistribution].sort(
      (a, b) => b.count - a.count,
    );
    const topCategory = sortedCats[0] ?? { _id: "Conceptual", count: 0 };

    const sortedDiffs = [...stats.difficultyDistribution].sort(
      (a, b) => b.count - a.count,
    );
    const topDifficulty = sortedDiffs[0] ?? { _id: "Medium", count: 0 };

    const topChapter = stats.chapterWeightage[0] ?? {
      _id: { chapter: "N/A" },
      count: 0,
    };

    const highROIChapters = stats.chapterWeightage
      .filter((ch) => (ch.count / totalQs) * 100 > 8)
      .map((ch) => ch._id.chapter);

    const hardConcept = stats.categoryDifficultyDist.find(
      (d) => d._id.category === "Conceptual" && d._id.difficulty === "Hard",
    );
    const conceptualHardPercentage = Math.round(
      ((hardConcept?.count ?? 0) / totalQs) * 100,
    );

    const results: InsightCard[] = [
      {
        icon: <TrendingUp className="h-5 w-5" />,
        title: "Dominant Category",
        value: topCategory._id,
        description: `${Math.round((topCategory.count / totalQs) * 100)}% of questions are ${topCategory._id.toLowerCase()}`,
        type: "info",
      },
      {
        icon: <Target className="h-5 w-5" />,
        title: "Difficulty Profile",
        value: `${topDifficulty._id} Level`,
        description: `${Math.round((topDifficulty.count / totalQs) * 100)}% questions at ${topDifficulty._id.toLowerCase()} difficulty`,
        type: topDifficulty._id === "Hard" ? "warning" : "success",
      },
      {
        icon: <BookOpen className="h-5 w-5" />,
        title: "Top Chapter",
        value: topChapter._id.chapter,
        description: `${Math.round((topChapter.count / totalQs) * 100)}% weightage — prioritize this chapter`,
        type: "success",
      },
      {
        icon: <Zap className="h-5 w-5" />,
        title: "Conceptual + Hard",
        value: `${conceptualHardPercentage}%`,
        description:
          conceptualHardPercentage > 15
            ? "High focus on deep understanding required"
            : "Moderate conceptual difficulty",
        type: conceptualHardPercentage > 20 ? "warning" : "info",
      },
    ];

    if (highROIChapters.length > 0) {
      results.push({
        icon: <Award className="h-5 w-5" />,
        title: "High ROI Chapters",
        value: `${highROIChapters.length} chapters`,
        description:
          highROIChapters.slice(0, 2).join(", ") +
          (highROIChapters.length > 2 ? "…" : ""),
        type: "success",
      });
    }

    return results;
  }, [stats]);

  const typeStyles = {
    info: "bg-accent border-accent text-accent-foreground",
    success: "bg-chart-easy/10 border-chart-easy/20 text-chart-easy",
    warning: "bg-chart-medium/10 border-chart-medium/20 text-chart-hard",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Key Insights</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strategic takeaways from current selection
          </p>
        </div>
        <Badge variant="secondary" className="font-mono">
          {stats.totalQuestions} / {totalQuestions} questions
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`stat-card border ${typeStyles[insight.type]} animate-slide-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  {insight.title}
                </p>
                <p className="font-semibold text-foreground mt-0.5 truncate">
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
