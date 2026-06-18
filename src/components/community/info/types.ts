import { Author } from '@/components/community/types';

export type InfoPost = {
  id: number;
  author: Author;
  thumbnailUrl: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};
