import { Author } from '@/components/community/types';

export type GroupPost = {
  id: number;
  field: 'FE' | 'BE';
  title: string;
  recruitCount: number;
  expectedPeriod: string;
  author: Author;
  deadline: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};
