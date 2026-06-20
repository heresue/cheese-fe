import { Author } from '@/components/community/types';

export type InfoPost = {
  id: number;

  author: Author;

  createdAt: string;

  thumbnailUrl: string;

  category: '질문글' | '정보글' | '자료공유';
  title: string;

  content: string;

  tags: string[];

  viewCount: number;
  likeCount: number;
  commentCount: number;

  isLiked: boolean;
};
