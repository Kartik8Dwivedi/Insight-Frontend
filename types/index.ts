export interface QuestionOccurrence {
  year: number;
  shift: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Fact" | "Formula" | "Conceptual";
}

// Shape coming from /api/analytics (export-analytics.js output)
export interface QuestionData {
  id: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  chapter: string;
  topic: string;
  repeatCount: number;
  history: QuestionOccurrence[];
  averageDifficulty: "Easy" | "Medium" | "Hard";
  mainCategory: "Fact" | "Formula" | "Conceptual";

  // Derived/virtual fields — computed in normalizeQuestion(), used by charts & filters
  domain: "Physics" | "Chemistry" | "Maths"; // subject with "Mathematics" → "Maths"
  difficulty: "Easy" | "Medium" | "Hard"; // = averageDifficulty
  category: "Fact" | "Formula" | "Conceptual"; // = mainCategory
  year: number; // latest year in history[]
  yearMin: number; // earliest year in history[]
  yearMax: number; // latest year in history[]
}

export interface FilterState {
  domains: string[];
  chapters: string[];
  topics: string[];
  categories: string[];
  difficulties: string[];
  yearRange: [number, number];
}

// Pre-computed stats shape returned by computeStats()
export interface ComputedStats {
  totalQuestions: number;
  categoryDistribution: Array<{ _id: string; count: number }>;
  difficultyDistribution: Array<{ _id: string; count: number }>;
  chapterWeightage: Array<{
    _id: { chapter: string; domain: string };
    count: number;
  }>;
  categoryDifficultyDist: Array<{
    _id: { category: string; difficulty: string };
    count: number;
  }>;
  yearTrend: Array<{ _id: { year: number; category: string }; count: number }>;
}
