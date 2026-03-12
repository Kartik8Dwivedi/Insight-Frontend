import { useState, useMemo } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterState } from '@/data/mockData';

interface FilterPanelProps {
  chapters: Record<string, string[]>;
  topics: Record<string, string[]>;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterSection = ({
  title,
  items,
  selected,
  onChange,
  colorMap,
}: {
  title: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  colorMap?: Record<string, string>;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="filter-section">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2 -mx-2">
        <span className="filter-label">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1.5 pt-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => handleToggle(item)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-sm">{item}</span>
            {colorMap && (
              <span
                className="w-2 h-2 rounded-full ml-auto"
                style={{ backgroundColor: colorMap[item] }}
              />
            )}
          </label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const FilterPanel = ({ chapters, topics, filters, onFilterChange }: FilterPanelProps) => {
  const domainColors: Record<string, string> = {
    Physics: 'hsl(220, 80%, 55%)',
    Chemistry: 'hsl(150, 60%, 45%)',
    Maths: 'hsl(280, 70%, 55%)',
  };

  const categoryColors: Record<string, string> = {
    Fact: 'hsl(192, 75%, 50%)',
    Formula: 'hsl(260, 65%, 55%)',
    Conceptual: 'hsl(330, 70%, 55%)',
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'hsl(150, 70%, 45%)',
    Medium: 'hsl(45, 90%, 50%)',
    Hard: 'hsl(0, 75%, 55%)',
  };

  const availableChapters = useMemo(() => {
    let list: string[] = [];
    if (filters.domains.length === 0) {
      list = Object.values(chapters).flat();
    } else {
      list = filters.domains.flatMap((domain) => chapters[domain] || []);
    }
    return Array.from(new Set(list)); // Deduplicate
  }, [filters.domains, chapters]);

  const availableTopics = useMemo(() => {
    let list: string[] = [];
    if (filters.chapters.length === 0) {
      list = Object.values(topics).flat();
    } else {
      list = filters.chapters.flatMap((chapter) => topics[chapter] || []);
    }
    return Array.from(new Set(list)); // Deduplicate
  }, [filters.chapters, topics]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.domains.length +
      filters.chapters.length +
      filters.topics.length +
      filters.categories.length +
      filters.difficulties.length +
      (filters.yearRange[0] !== 2019 || filters.yearRange[1] !== 2024 ? 1 : 0)
    );
  }, [filters]);

  const clearAllFilters = () => {
    onFilterChange({
      domains: [],
      chapters: [],
      topics: [],
      categories: [],
      difficulties: [],
      yearRange: [2019, 2024],
    });
  };

  return (
    <div className="w-72 sticky top-0 bg-card border-r border-border flex flex-col h-[calc(100vh-80px)] overflow-y-scroll">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Filters</h2>
          </div>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1.5" />
            Clear all filters
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 scrollbar-thin">
        <div className="space-y-6">
          <FilterSection
            title="Domain"
            items={['Physics', 'Chemistry', 'Maths']}
            selected={filters.domains}
            onChange={(domains) => onFilterChange({ ...filters, domains, chapters: [], topics: [] })}
            colorMap={domainColors}
          />

          <FilterSection
            title="Chapter"
            items={availableChapters}
            selected={filters.chapters}
            onChange={(chapters) => onFilterChange({ ...filters, chapters, topics: [] })}
          />

          {availableTopics.length > 0 && filters.chapters.length > 0 && (
            <FilterSection
              title="Topic"
              items={availableTopics}
              selected={filters.topics}
              onChange={(topics) => onFilterChange({ ...filters, topics })}
            />
          )}

          <FilterSection
            title="Category"
            items={['Fact', 'Formula', 'Conceptual']}
            selected={filters.categories}
            onChange={(categories) => onFilterChange({ ...filters, categories })}
            colorMap={categoryColors}
          />

          <FilterSection
            title="Difficulty"
            items={['Easy', 'Medium', 'Hard']}
            selected={filters.difficulties}
            onChange={(difficulties) => onFilterChange({ ...filters, difficulties })}
            colorMap={difficultyColors}
          />

          <div className="filter-section">
            <label className="filter-label block mb-3">Year Range</label>
            <div className="px-2">
              <Slider
                value={filters.yearRange}
                onValueChange={(value) =>
                  onFilterChange({ ...filters, yearRange: value as [number, number] })
                }
                min={2019}
                max={2024}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
