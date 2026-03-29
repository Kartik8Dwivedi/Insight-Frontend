import { BarChart3, Info, Menu, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onToggleMobileFilters?: () => void;
}

export const Header = ({ onApplyFilters, currentFilters, onToggleMobileFilters }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 shrink-0">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Logo + title */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {onToggleMobileFilters && (
            <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={onToggleMobileFilters}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="p-1 md:p-1.5 bg-background border border-border rounded-xl shrink-0 overflow-hidden shadow-sm">
            <img src="/logo.png" alt="ExamsOrbit" className="h-7 w-7 md:h-8 md:w-8 object-contain rounded-lg" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold tracking-tight line-clamp-1">
              ExamsOrbit Intelligence Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 font-medium">
              Decoding How JEE Asks Questions
            </p>
          </div>
        </div>

        {/* Right side: AI search + badges */}
        <div className="flex items-center gap-3">
          <Link href="/blog" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <BookOpen className="h-4 w-4" />
            Intelligence Blog
          </Link>

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
