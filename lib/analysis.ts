import { QuestionData, FilterState, ComputedStats } from "@/types";

export const defaultFilters: FilterState = {
  domains: [],
  chapters: [],
  topics: [],
  categories: [],
  difficulties: [],
  yearRange: [2021, 2025],
};

/**
 * Normalize a raw question from the API into the shape the app expects.
 * This is the single place that bridges the stripped JSON → QuestionData.
 */
export function normalizeQuestion(raw: any): QuestionData {
  const years = (raw.history || []).map((h: any) => h.year).filter(Boolean);
  const yearMin = years.length ? Math.min(...years) : 2021;
  const yearMax = years.length ? Math.max(...years) : 2025;

  return {
    id: raw.id ?? raw._id ?? "",
    subject: raw.subject,
    chapter: raw.chapter,
    topic: raw.topic,
    repeatCount: raw.repeatCount ?? 1,
    history: raw.history ?? [],
    averageDifficulty: raw.averageDifficulty ?? "Medium",
    mainCategory: raw.mainCategory ?? "Conceptual",

    // Derived fields used by legacy chart components
    domain: raw.subject === "Mathematics" ? "Maths" : raw.subject,
    difficulty: raw.averageDifficulty ?? "Medium",
    category: raw.mainCategory ?? "Conceptual",
    year: yearMax,
    yearMin,
    yearMax,
  };
}

/**
 * Filter the full dataset client-side. O(n) single pass.
 * Year filter checks if ANY occurrence in history[] falls in the range.
 */
export function filterData(
  data: QuestionData[],
  filters: FilterState,
): QuestionData[] {
  const hasYearFilter =
    filters.yearRange[0] !== defaultFilters.yearRange[0] ||
    filters.yearRange[1] !== defaultFilters.yearRange[1];

  return data.filter((item) => {
    if (filters.domains.length > 0 && !filters.domains.includes(item.domain))
      return false;
    if (filters.chapters.length > 0 && !filters.chapters.includes(item.chapter))
      return false;
    if (filters.topics.length > 0 && !filters.topics.includes(item.topic))
      return false;
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(item.category)
    )
      return false;
    if (
      filters.difficulties.length > 0 &&
      !filters.difficulties.includes(item.difficulty)
    )
      return false;

    // Year: question must have appeared at least once in the selected range
    if (hasYearFilter) {
      const appearedInRange = item.history.some(
        (h) => h.year >= filters.yearRange[0] && h.year <= filters.yearRange[1],
      );
      if (!appearedInRange) return false;
    }

    return true;
  });
}

/**
 * Compute all stats the charts need from a filtered array.
 * Replaces the old MongoDB $facet aggregation — runs in ~5ms for 9k records.
 */
export function computeStats(data: QuestionData[]): ComputedStats {
  const categoryMap: Record<string, number> = {};
  const difficultyMap: Record<string, number> = {};
  const chapterMap: Record<string, { count: number; domain: string }> = {};
  const catDiffMap: Record<string, number> = {};

  // year trend: keyed as "year|category"
  const yearCatMap: Record<string, number> = {};

  for (const q of data) {
    // category distribution
    categoryMap[q.category] = (categoryMap[q.category] ?? 0) + 1;

    // difficulty distribution
    difficultyMap[q.difficulty] = (difficultyMap[q.difficulty] ?? 0) + 1;

    // chapter weightage
    if (!chapterMap[q.chapter])
      chapterMap[q.chapter] = { count: 0, domain: q.domain };
    chapterMap[q.chapter].count++;

    // category × difficulty heatmap
    const cdKey = `${q.category}|${q.difficulty}`;
    catDiffMap[cdKey] = (catDiffMap[cdKey] ?? 0) + 1;

    // year trend — iterate history so multi-year questions count per year
    for (const h of q.history) {
      if (!h.year) continue;
      const key = `${h.year}|${q.category}`;
      yearCatMap[key] = (yearCatMap[key] ?? 0) + 1;
    }
  }

  // Sort chapters by count desc, keep top 15
  const chapterWeightage = Object.entries(chapterMap)
    .map(([chapter, { count, domain }]) => ({
      _id: { chapter, domain },
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const categoryDistribution = Object.entries(categoryMap).map(
    ([_id, count]) => ({ _id, count }),
  );
  const difficultyDistribution = Object.entries(difficultyMap).map(
    ([_id, count]) => ({ _id, count }),
  );

  const categoryDifficultyDist = Object.entries(catDiffMap).map(
    ([key, count]) => {
      const [category, difficulty] = key.split("|");
      return { _id: { category, difficulty }, count };
    },
  );

  const yearTrend = Object.entries(yearCatMap)
    .map(([key, count]) => {
      const [yearStr, category] = key.split("|");
      return { _id: { year: Number(yearStr), category }, count };
    })
    .sort((a, b) => a._id.year - b._id.year);

  return {
    totalQuestions: data.length,
    categoryDistribution,
    difficultyDistribution,
    chapterWeightage,
    categoryDifficultyDist,
    yearTrend,
  };
}

export function generateInsight(data: QuestionData[], type: string): string {
  if (data.length === 0) return "No data available for the selected filters.";

  const categoryCount = data.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const difficultyCount = data.reduce(
    (acc, item) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const topDifficulty = Object.entries(difficultyCount).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const insights: Record<string, string> = {
    category: `${topCategory?.[0] || "Conceptual"} questions dominate (${Math.round(((topCategory?.[1] || 0) / data.length) * 100)}%), indicating emphasis on ${topCategory?.[0] === "Conceptual" ? "deep understanding" : topCategory?.[0] === "Formula" ? "application skills" : "factual knowledge"}.`,
    difficulty: `Most questions are ${topDifficulty?.[0]?.toLowerCase() || "medium"} level (${Math.round(((topDifficulty?.[1] || 0) / data.length) * 100)}%), suggesting ${topDifficulty?.[0] === "Hard" ? "advanced preparation needed" : topDifficulty?.[0] === "Medium" ? "balanced preparation approach" : "focus on fundamentals first"}.`,
    heatmap: `The data reveals that ${topCategory?.[0] || "Conceptual"} questions at ${topDifficulty?.[0]?.toLowerCase() || "medium"} difficulty are most common. Focus your preparation on building strong conceptual foundations.`,
    trend: `Over the years, JEE has shown a gradual shift towards more conceptual and application-based questions, reducing purely fact-based recall items.`,
    chapter: `High-weightage chapters deserve focused attention. Prioritize chapters with 8%+ weightage for maximum ROI in your preparation.`,
  };

  return insights[type] || insights.category;
}
