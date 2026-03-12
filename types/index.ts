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
  domain: 'Physics' | 'Chemistry' | 'Mathematics';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Fact' | 'Formula' | 'Conceptual';
  year: number;
}

export interface FilterState {
  domains: string[];
  chapters: string[];
  topics: string[];
  categories: string[];
  difficulties: string[];
  yearRange: [number, number];
}
