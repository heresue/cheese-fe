export type ProblemMainCategory = 'all' | 'frontend' | 'backend' | 'cs';

export type ProblemSubCategory =
  | 'all'
  | 'html-css'
  | 'javascript'
  | 'react'
  | 'typescript'
  | 'nextjs'
  | 'java'
  | 'mysql'
  | 'python'
  | 'nodejs';

export type ProblemSortValue = 'latest' | 'progressDate' | 'name';

export type ProblemBadge = 'FE' | 'BE' | 'CS';

export type ProblemThumbnailType = 'css' | 'html' | 'js';

export type ProblemSet = {
  id: string;
  title: string;
  category: Exclude<ProblemMainCategory, 'all'>;
  subCategory: Exclude<ProblemSubCategory, 'all'>;
  badge: ProblemBadge;
  thumbnailType: ProblemThumbnailType;
  lastProgressDate: string;
  solvedCount: number;
  totalCount: number;
};
