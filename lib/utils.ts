import { QuestionData } from "@/data/mockData";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChaptersAndTopics(mockData: QuestionData[]) {
  const chapters: Record<string, string[]> = {};
  const topics: Record<string, string[]> = {};

  mockData.forEach((item) => {
    const domain = item.domain || item.subject || 'Unknown';
    if (!chapters[domain]) chapters[domain] = [];
    if (!chapters[domain].includes(item.chapter)) {
      chapters[domain].push(item.chapter);
    }

    if (!topics[item.chapter]) topics[item.chapter] = [];
    if (!topics[item.chapter].includes(item.topic)) {
      topics[item.chapter].push(item.topic);
    }
  });

  return { chapters, topics };
}
