import { useMemo } from 'react';
import { TrendingUp, Target, Zap, BookOpen, AlertTriangle, Award } from 'lucide-react';
import { QuestionData } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface SummaryPanelProps {
  data: QuestionData[];
  totalQuestions: number;
  stats?: any;
}

interface InsightCard {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  type: 'info' | 'success' | 'warning';
}

export const SummaryPanel = ({ data, totalQuestions, stats }: SummaryPanelProps) => {
  const insights = useMemo((): InsightCard[] => {
    if (data.length === 0 && (!stats || stats.totalQuestions === 0)) {
      return [{
        icon: <AlertTriangle className="h-5 w-5" />,
        title: 'No Data',
        value: '0 questions',
        description: 'Adjust filters to see insights',
        type: 'warning',
      }];
    }

    let topCategory = ['N/A', 0];
    let topDifficulty = ['Medium', 0];
    let topChapter = ['N/A', 0];
    let totalQs = data.length || 1;
    let highROIChapters: string[] = [];
    let conceptualHardPercentage = 0;

    if (stats) {
      totalQs = stats.totalQuestions || 1;
      // Get Top Category
      if (stats.categoryDistribution?.length) {
        const sortedCats = [...stats.categoryDistribution].sort((a: any, b: any) => b.count - a.count);
        topCategory = [sortedCats[0]._id || 'Conceptual', sortedCats[0].count];
      }
      // Get Top Difficulty
      if (stats.difficultyDistribution?.length) {
        const sortedDiffs = [...stats.difficultyDistribution].sort((a: any, b: any) => b.count - a.count);
        topDifficulty = [sortedDiffs[0]._id || 'Medium', sortedDiffs[0].count];
      }
      // Get Top Chapter
      if (stats.chapterWeightage?.length) {
        topChapter = [stats.chapterWeightage[0]._id.chapter, stats.chapterWeightage[0].count];
        highROIChapters = stats.chapterWeightage
          .filter((ch: any) => (ch.count / totalQs) * 100 > 8)
          .map((ch: any) => ch._id.chapter);
      }
      // Get Conceptual + Hard
      if (stats.categoryDifficultyDist?.length) {
        const hardConcept = stats.categoryDifficultyDist.find(
          (d: any) => d._id.category === 'Conceptual' && d._id.difficulty === 'Hard'
        );
        conceptualHardPercentage = Math.round(((hardConcept?.count || 0) / totalQs) * 100);
      }
    } else {
      // Fallback local calculations
      const localCategoryCount = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const localDifficultyCount = data.reduce((acc, item) => {
        acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const localChapterCount = data.reduce((acc, item) => {
        acc[item.chapter] = (acc[item.chapter] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      topCategory = Object.entries(localCategoryCount).sort((a, b) => b[1] - a[1])[0] || topCategory;
      topDifficulty = Object.entries(localDifficultyCount).sort((a, b) => b[1] - a[1])[0] || topDifficulty;
      topChapter = Object.entries(localChapterCount).sort((a, b) => b[1] - a[1])[0] || topChapter;

      const conceptualHardCount = data.filter(
        d => d.category === 'Conceptual' && d.difficulty === 'Hard'
      ).length;
      conceptualHardPercentage = Math.round((conceptualHardCount / data.length) * 100);

      highROIChapters = Object.entries(localChapterCount)
        .filter(([_, count]: [string, unknown]) => ((count as number) / data.length) * 100 > 8)
        .map(([name]) => name);
    }

    const results: InsightCard[] = [
      {
        icon: <TrendingUp className="h-5 w-5" />,
        title: 'Dominant Category',
        value: `${topCategory[0]}`,
        description: `${Math.round((Number(topCategory[1]) / totalQs) * 100)}% of questions are ${String(topCategory[0]).toLowerCase()}`,
        type: 'info',
      },
      {
        icon: <Target className="h-5 w-5" />,
        title: 'Difficulty Profile',
        value: `${topDifficulty[0]} Level`,
        description: `${Math.round((Number(topDifficulty[1]) / totalQs) * 100)}% questions at ${String(topDifficulty[0]).toLowerCase()} difficulty`,
        type: topDifficulty[0] === 'Hard' ? 'warning' : 'success',
      },
      {
        icon: <BookOpen className="h-5 w-5" />,
        title: 'Top Chapter',
        value: String(topChapter[0]),
        description: `${Math.round((Number(topChapter[1]) / totalQs) * 100)}% weightage - prioritize this chapter`,
        type: 'success',
      },
      {
        icon: <Zap className="h-5 w-5" />,
        title: 'Conceptual + Hard',
        value: `${conceptualHardPercentage}%`,
        description: conceptualHardPercentage > 15 
          ? 'High focus on deep understanding required'
          : 'Moderate conceptual difficulty',
        type: conceptualHardPercentage > 20 ? 'warning' : 'info',
      },
    ];

    if (highROIChapters.length > 0) {
      results.push({
        icon: <Award className="h-5 w-5" />,
        title: 'High ROI Chapters',
        value: `${highROIChapters.length} chapters`,
        description: highROIChapters.slice(0, 2).join(', ') + (highROIChapters.length > 2 ? '...' : ''),
        type: 'success',
      });
    }

    return results;
  }, [data, stats]);

  const typeStyles = {
    info: 'bg-accent border-accent text-accent-foreground',
    success: 'bg-chart-easy/10 border-chart-easy/20 text-chart-easy',
    warning: 'bg-chart-medium/10 border-chart-medium/20 text-chart-hard',
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
          {data.length} / {totalQuestions} questions
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
