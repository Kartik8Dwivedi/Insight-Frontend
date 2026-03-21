import { BarChart3, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AISearchBar } from "@/components/dashboard/AISearchBar";
import { FilterState } from "@/types";

interface HeaderProps {
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export const Header = ({ onApplyFilters, currentFilters }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Logo + title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              JEE Exam Intelligence Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Decoding How JEE Asks Questions
            </p>
          </div>
        </div>

        {/* Right side: AI search + badges */}
        <div className="flex items-center gap-3">
          <AISearchBar
            onApplyFilters={onApplyFilters}
            currentFilters={currentFilters}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs cursor-help">
                <span className="w-2 h-2 rounded-full bg-chart-easy mr-1.5 animate-pulse-subtle" />
                Beta
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                This dashboard shows aggregated analytics only. Actual questions
                and solutions are not displayed.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                Use filters on the left or AI Search (⌘K) to explore question
                patterns.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
