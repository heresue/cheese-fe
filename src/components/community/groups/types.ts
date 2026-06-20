import { Author } from '@/components/community/types';

export type GroupPost = {
  id: number;

  field: 'FE' | 'BE';
  title: string;

  recruitCount: number;
  expectedPeriod: string;
  progressType: '온라인' | '오프라인' | '온/오프라인';

  skills: string[];
  applyMethod: string;

  applicantCount: number;

  author: Author;

  deadline: string | null;
  createdAt: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;

  imageUrl?: string;
  content: string;

  isLiked: boolean;
  isApplied: boolean;
};
