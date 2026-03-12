export interface QuestionOccurrence {
  year: number;
  shift: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Fact' | 'Formula' | 'Conceptual';
  sourceFile: string;
}

export interface QuestionData {
  _id: string;
  questionHash: string;
  questionText: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  chapter: string;
  topic: string;
  repeatCount: number;
  history: QuestionOccurrence[];
  averageDifficulty: 'Easy' | 'Medium' | 'Hard';
  mainCategory: 'Fact' | 'Formula' | 'Conceptual';
  // Legacy fields for backward compatibility with existing charts
  domain?: 'Physics' | 'Chemistry' | 'Mathematics';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: 'Fact' | 'Formula' | 'Conceptual';
  year?: number;
}

export const chapters: Record<string, string[]> = {
  Physics: [
    'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 
    'Modern Physics', 'Waves & Sound', 'Fluid Mechanics'
  ],
  Chemistry: [
    'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry',
    'Coordination Compounds', 'Chemical Bonding', 'Electrochemistry'
  ],
  Maths: [
    'Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry',
    'Probability & Statistics', 'Vectors & 3D', 'Matrices & Determinants'
  ],
};

export const topics: Record<string, string[]> = {
  'Mechanics': ['Kinematics', 'Newton\'s Laws', 'Work-Energy', 'Rotational Motion', 'Gravitation'],
  'Thermodynamics': ['Heat Transfer', 'Laws of Thermodynamics', 'Kinetic Theory', 'Entropy'],
  'Electromagnetism': ['Electric Fields', 'Magnetic Fields', 'EM Induction', 'AC Circuits'],
  'Optics': ['Ray Optics', 'Wave Optics', 'Polarization', 'Interference'],
  'Modern Physics': ['Photoelectric Effect', 'Atomic Structure', 'Nuclear Physics', 'Semiconductors'],
  'Organic Chemistry': ['Hydrocarbons', 'Alcohols & Ethers', 'Carbonyl Compounds', 'Amines'],
  'Inorganic Chemistry': ['p-Block Elements', 'd-Block Elements', 'Metallurgy', 's-Block Elements'],
  'Physical Chemistry': ['Equilibrium', 'Solutions', 'Chemical Kinetics', 'Surface Chemistry'],
  'Calculus': ['Limits', 'Differentiation', 'Integration', 'Differential Equations'],
  'Algebra': ['Quadratic Equations', 'Sequences & Series', 'Complex Numbers', 'Permutations'],
  'Coordinate Geometry': ['Straight Lines', 'Circles', 'Parabola', 'Ellipse & Hyperbola'],
};

// Generate mock data
const generateMockData = (): QuestionData[] => {
  const data: QuestionData[] = [];
  const domains: ('Physics' | 'Chemistry' | 'Maths')[] = ['Physics', 'Chemistry', 'Maths'];
  const categories: ('Fact' | 'Formula' | 'Conceptual')[] = ['Fact', 'Formula', 'Conceptual'];
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
  const years = [2019, 2020, 2021, 2022, 2023, 2024];

  let id = 1;
  
  domains.forEach(domain => {
    const domainChapters = chapters[domain];
    domainChapters.forEach(chapter => {
      const chapterTopics = topics[chapter] || ['General'];
      chapterTopics.forEach(topic => {
        // Generate 3-8 questions per topic
        const questionCount = Math.floor(Math.random() * 6) + 3;
        for (let i = 0; i < questionCount; i++) {
          data.push({
            id: `Q${id++}`,
            domain,
            chapter,
            topic,
            category: categories[Math.floor(Math.random() * categories.length)],
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
            year: years[Math.floor(Math.random() * years.length)],
          });
        }
      });
    });
  });

  return data;
};

export const mockData = generateMockData();

export interface FilterState {
  domains: string[];
  chapters: string[];
  topics: string[];
  categories: string[];
  difficulties: string[];
  yearRange: [number, number];
}

export const defaultFilters: FilterState = {
  domains: [],
  chapters: [],
  topics: [],
  categories: [],
  difficulties: [],
  yearRange: [2019, 2024],
};

export const filterData = (data: QuestionData[], filters: FilterState): QuestionData[] => {
  return data.filter(item => {
    if (filters.domains.length > 0 && !filters.domains.includes(item.domain)) return false;
    if (filters.chapters.length > 0 && !filters.chapters.includes(item.chapter)) return false;
    if (filters.topics.length > 0 && !filters.topics.includes(item.topic)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) return false;
    if (filters.difficulties.length > 0 && !filters.difficulties.includes(item.difficulty)) return false;
    if (item.year < filters.yearRange[0] || item.year > filters.yearRange[1]) return false;
    return true;
  });
};

export const generateInsight = (data: QuestionData[], type: string): string => {
  if (data.length === 0) return "No data available for the selected filters.";
  
  const categoryCount = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const difficultyCount = data.reduce((acc, item) => {
    acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  const topDifficulty = Object.entries(difficultyCount).sort((a, b) => b[1] - a[1])[0];
  
  const insights: Record<string, string> = {
    category: `${topCategory?.[0] || 'Conceptual'} questions dominate (${Math.round((topCategory?.[1] || 0) / data.length * 100)}%), indicating emphasis on ${topCategory?.[0] === 'Conceptual' ? 'deep understanding' : topCategory?.[0] === 'Formula' ? 'application skills' : 'factual knowledge'}.`,
    difficulty: `Most questions are ${topDifficulty?.[0]?.toLowerCase() || 'medium'} level (${Math.round((topDifficulty?.[1] || 0) / data.length * 100)}%), suggesting ${topDifficulty?.[0] === 'Hard' ? 'advanced preparation needed' : topDifficulty?.[0] === 'Medium' ? 'balanced preparation approach' : 'focus on fundamentals first'}.`,
    heatmap: `The data reveals that ${topCategory?.[0] || 'Conceptual'} questions at ${topDifficulty?.[0]?.toLowerCase() || 'medium'} difficulty are most common. Focus your preparation on building strong conceptual foundations.`,
    trend: `Over the years, JEE has shown a gradual shift towards more conceptual and application-based questions, reducing purely fact-based recall items.`,
    chapter: `High-weightage chapters deserve focused attention. Prioritize chapters with 8%+ weightage for maximum ROI in your preparation.`,
  };
  
  return insights[type] || insights.category;
};
