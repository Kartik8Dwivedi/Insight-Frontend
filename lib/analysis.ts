import { QuestionData, FilterState, ComputedStats } from "@/types";

export const defaultFilters: FilterState = {
  domains: [],
  chapters: [],
  topics: [],
  categories: [],
  difficulties: [],
  yearRange: [2002, 2025],
};

/**
 * Normalize a raw topic record from analytics.json into QuestionData.
 * One record = one unique topic, with history[] = all individual appearances.
 */
export function normalizeQuestion(raw: any): QuestionData {
  const years = (raw.history || []).map((h: any) => h.year).filter(Boolean);
  const yearMin = years.length ? Math.min(...years) : 2002;
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
    domain: raw.subject === "Mathematics" ? "Maths" : raw.subject,
    difficulty: raw.averageDifficulty ?? "Medium",
    category: raw.mainCategory ?? "Conceptual",
    year: yearMax,
    yearMin,
    yearMax,
  };
}

function mostCommon(arr: string[]): string {
  if (!arr.length) return "";
  const freq: Record<string, number> = {};
  for (const v of arr) freq[v] = (freq[v] ?? 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Filter topic records AND trim their history[] to only matching occurrences.
 *
 * The analytics.json has 305 topic records, each with a history[] of individual
 * question appearances (total 15,645). Filtering works at the history[] level:
 * - domain/chapter/topic filter the whole topic record
 * - category/difficulty/year filter individual history entries
 * This ensures all counts reflect real question appearances, not topic counts.
 */
export function filterData(
  data: QuestionData[],
  filters: FilterState,
): QuestionData[] {
  const hasYearFilter =
    filters.yearRange[0] !== defaultFilters.yearRange[0] ||
    filters.yearRange[1] !== defaultFilters.yearRange[1];

  const hasCategoryFilter = filters.categories.length > 0;
  const hasDifficultyFilter = filters.difficulties.length > 0;
  const needsHistoryFilter =
    hasYearFilter || hasCategoryFilter || hasDifficultyFilter;

  const result: QuestionData[] = [];

  for (const item of data) {
    // Domain/chapter/topic are topic-level — filter entire record
    if (filters.domains.length > 0 && !filters.domains.includes(item.domain))
      continue;
    if (filters.chapters.length > 0 && !filters.chapters.includes(item.chapter))
      continue;
    if (filters.topics.length > 0 && !filters.topics.includes(item.topic))
      continue;

    if (!needsHistoryFilter) {
      result.push(item);
      continue;
    }

    // Filter individual history entries
    const filteredHistory = item.history.filter((h) => {
      if (
        hasYearFilter &&
        (h.year < filters.yearRange[0] || h.year > filters.yearRange[1])
      )
        return false;
      if (hasCategoryFilter && !filters.categories.includes(h.category))
        return false;
      if (hasDifficultyFilter && !filters.difficulties.includes(h.difficulty))
        return false;
      return true;
    });

    if (filteredHistory.length === 0) continue;

    // Recalculate derived fields from filtered history
    const cats = filteredHistory.map((h) => h.category);
    const diffs = filteredHistory.map((h) => h.difficulty);

    result.push({
      ...item,
      history: filteredHistory,
      repeatCount: filteredHistory.length,
      mainCategory: mostCommon(cats) as QuestionData["mainCategory"],
      averageDifficulty: mostCommon(diffs) as QuestionData["averageDifficulty"],
      category: mostCommon(cats) as QuestionData["category"],
      difficulty: mostCommon(diffs) as QuestionData["difficulty"],
    });
  }

  return result;
}

/**
 * Compute all chart stats from filtered topic records.
 * ALL counts iterate history[] entries so n = 15,645 (real question appearances),
 * not 305 (topic records).
 */
export function computeStats(data: QuestionData[]): ComputedStats {
  const categoryMap: Record<string, number> = {};
  const difficultyMap: Record<string, number> = {};
  const chapterMap: Record<string, { count: number; domain: string }> = {};
  const catDiffMap: Record<string, number> = {};
  const yearCatMap: Record<string, number> = {};
  let totalOccurrences = 0;

  for (const q of data) {
    for (const h of q.history) {
      if (!h.year) continue;
      totalOccurrences++;

      categoryMap[h.category] = (categoryMap[h.category] ?? 0) + 1;
      difficultyMap[h.difficulty] = (difficultyMap[h.difficulty] ?? 0) + 1;

      if (!chapterMap[q.chapter])
        chapterMap[q.chapter] = { count: 0, domain: q.domain };
      chapterMap[q.chapter].count++;

      const cdKey = `${h.category}|${h.difficulty}`;
      catDiffMap[cdKey] = (catDiffMap[cdKey] ?? 0) + 1;

      const trendKey = `${h.year}|${h.category}`;
      yearCatMap[trendKey] = (yearCatMap[trendKey] ?? 0) + 1;
    }
  }

  const chapterWeightage = Object.entries(chapterMap)
    .map(([chapter, { count, domain }]) => ({
      _id: { chapter, domain },
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    totalQuestions: totalOccurrences,
    categoryDistribution: Object.entries(categoryMap).map(([_id, count]) => ({
      _id,
      count,
    })),
    difficultyDistribution: Object.entries(difficultyMap).map(
      ([_id, count]) => ({ _id, count }),
    ),
    chapterWeightage,
    categoryDifficultyDist: Object.entries(catDiffMap).map(([key, count]) => {
      const [category, difficulty] = key.split("|");
      return { _id: { category, difficulty }, count };
    }),
    yearTrend: Object.entries(yearCatMap)
      .map(([key, count]) => {
        const [yearStr, category] = key.split("|");
        return { _id: { year: Number(yearStr), category }, count };
      })
      .sort((a, b) => a._id.year - b._id.year),
  };
}

export function generateInsight(data: QuestionData[], type: string): string {
  const total = data.reduce((sum, q) => sum + q.history.length, 0);
  if (total === 0) return "No data available for the selected filters.";

  const categoryCount: Record<string, number> = {};
  const difficultyCount: Record<string, number> = {};
  for (const q of data) {
    for (const h of q.history) {
      categoryCount[h.category] = (categoryCount[h.category] ?? 0) + 1;
      difficultyCount[h.difficulty] = (difficultyCount[h.difficulty] ?? 0) + 1;
    }
  }

  const topCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const topDifficulty = Object.entries(difficultyCount).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const insights: Record<string, string> = {
    category: `${topCategory?.[0] || "Conceptual"} questions dominate (${Math.round(((topCategory?.[1] || 0) / total) * 100)}%), indicating emphasis on ${topCategory?.[0] === "Conceptual" ? "deep understanding" : topCategory?.[0] === "Formula" ? "application skills" : "factual knowledge"}.`,
    difficulty: `Most questions are ${topDifficulty?.[0]?.toLowerCase() || "medium"} level (${Math.round(((topDifficulty?.[1] || 0) / total) * 100)}%), suggesting ${topDifficulty?.[0] === "Hard" ? "advanced preparation needed" : topDifficulty?.[0] === "Medium" ? "balanced preparation approach" : "focus on fundamentals first"}.`,
    heatmap: `The data reveals that ${topCategory?.[0] || "Conceptual"} questions at ${topDifficulty?.[0]?.toLowerCase() || "medium"} difficulty are most common. Focus your preparation on building strong conceptual foundations.`,
    trend: `Over the years, JEE has shown a gradual shift towards more conceptual and application-based questions, reducing purely fact-based recall items.`,
    chapter: `High-weightage chapters deserve focused attention. Prioritize chapters with 8%+ weightage for maximum ROI in your preparation.`,
  };

  return insights[type] || insights.category;
}
