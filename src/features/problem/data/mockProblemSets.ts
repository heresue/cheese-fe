import type { ProblemSet } from '../types/problem';

const baseProblemSets: Omit<ProblemSet, 'id' | 'createdAt' | 'solvedCount'>[] = [
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'frontend',
    subCategory: 'html-css',
    badge: 'FE',
    thumbnailType: 'css',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'frontend',
    subCategory: 'javascript',
    badge: 'FE',
    thumbnailType: 'js',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'frontend',
    subCategory: 'react',
    badge: 'FE',
    thumbnailType: 'css',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'frontend',
    subCategory: 'typescript',
    badge: 'FE',
    thumbnailType: 'js',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'frontend',
    subCategory: 'nextjs',
    badge: 'FE',
    thumbnailType: 'css',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'backend',
    subCategory: 'java',
    badge: 'BE',
    thumbnailType: 'html',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'backend',
    subCategory: 'mysql',
    badge: 'BE',
    thumbnailType: 'html',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'backend',
    subCategory: 'python',
    badge: 'BE',
    thumbnailType: 'js',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'backend',
    subCategory: 'nodejs',
    badge: 'BE',
    thumbnailType: 'js',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'cs',
    subCategory: 'network',
    badge: 'CS',
    thumbnailType: 'css',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'cs',
    subCategory: 'os',
    badge: 'CS',
    thumbnailType: 'html',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
  {
    title: 'CSS : 실무 신입 개발자가 알아야할 C언어',
    category: 'cs',
    subCategory: 'database',
    badge: 'CS',
    thumbnailType: 'css',
    lastProgressDate: '2026.01.20',
    totalCount: 20,
  },
];

export const mockProblemSets: ProblemSet[] = Array.from({ length: 48 }, (_, index) => {
  const baseProblemSet = baseProblemSets[index % baseProblemSets.length];
  const date = String(20 - (index % 10)).padStart(2, '0');

  return {
    ...baseProblemSet,
    id: `${baseProblemSet.category}-${baseProblemSet.subCategory}-${index + 1}`,
    createdAt: `2026.01.${date}`,
    solvedCount: index % 7 === 0 ? 9 : 20,
  };
});
