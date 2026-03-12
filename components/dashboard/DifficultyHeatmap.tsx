"use client"
import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { QuestionData } from '@/types';
import { generateInsight } from '@/lib/analysis';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DifficultyHeatmapProps {
  data: QuestionData[];
  stats?: any;
}

export const DifficultyHeatmap = ({ data, stats }: DifficultyHeatmapProps) => {
  const heatmapData = useMemo(() => {
    const categories = ['Fact', 'Formula', 'Conceptual'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    const counts: Record<string, Record<string, number>> = {};
    categories.forEach(cat => {
      counts[cat] = {};
      difficulties.forEach(diff => {
        counts[cat][diff] = 0;
      });
    });

    if (stats?.categoryDifficultyDist) {
      stats.categoryDifficultyDist.forEach((item: any) => {
        const cat = item._id.category;
        const diff = item._id.difficulty;
        if (counts[cat] !== undefined && counts[cat][diff] !== undefined) {
           counts[cat][diff] = item.count;
        }
      });
    } else {
      data.forEach(item => {
        if (counts[item.category] !== undefined && counts[item.category][item.difficulty] !== undefined) {
           counts[item.category][item.difficulty]++;
        }
      });
    }

    // Find max for color scaling
    const maxCount = Math.max(
      ...categories.flatMap(cat => 
        difficulties.map(diff => (counts[cat] && counts[cat][diff]) ? counts[cat][diff] : 0)
      )
    );

    return { counts, categories, difficulties, maxCount };
  }, [data, stats]);

  const insight = useMemo(() => generateInsight(data, 'heatmap'), [data]);

  const getColor = (value: number) => {
    if (heatmapData.maxCount === 0) return 'hsl(192, 20%, 20%)';
    const intensity = value / heatmapData.maxCount;
    const lightness = 90 - (intensity * 60);
    return `hsl(192, 75%, ${lightness}%)`;
  };

  const getTextColor = (value: number) => {
    if (heatmapData.maxCount === 0) return 'hsl(192, 20%, 70%)';
    const intensity = value / heatmapData.maxCount;
    return intensity > 0.5 ? 'hsl(192, 10%, 95%)' : 'hsl(192, 30%, 25%)';
  };

  return (
    <div className="chart-container animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Category vs Difficulty</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Question concentration by type and level
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          n={stats?.totalQuestions || data.length}
        </span>
      </div>

      <div className="overflow-x-auto p-2">
        <div className="min-w-[300px]">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-1 mb-1">
            <div></div>
            {heatmapData.difficulties.map(diff => (
              <div 
                key={diff}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {diff}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {heatmapData.categories.map(category => (
            <div key={category} className="grid grid-cols-4 gap-1 mb-1">
              <div className="flex items-center text-sm font-medium pr-3">
                {category}
              </div>
              {heatmapData.difficulties.map(difficulty => {
                const value = heatmapData.counts[category][difficulty];
                const totalQs = stats?.totalQuestions || data.length;
                const percentage = totalQs > 0 
                  ? Math.round((value / totalQs) * 100) 
                  : 0;
                
                return (
                  <Tooltip key={difficulty}>
                    <TooltipTrigger asChild>
                      <div
                        className="aspect-square rounded-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                        style={{ 
                          backgroundColor: getColor(value),
                          color: getTextColor(value),
                        }}
                      >
                        <span className="font-mono text-sm font-medium">
                          {value}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{category} × {difficulty}</p>
                      <p className="text-sm text-muted-foreground">
                        {value} questions ({percentage}%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Low</span>
        <div className="flex gap-0.5">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
            <div
              key={i}
              className="w-6 h-3 rounded-sm"
              style={{ backgroundColor: `hsl(192, 75%, ${90 - intensity * 60}%)` }}
            />
          ))}
        </div>
        <span>High</span>
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
