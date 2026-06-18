import { Author } from '@/components/community/types';

export type ApplyInfo =
  | {
      type: 'homepage';
      url: string;
    }
  | {
      type: 'direct';
    };

export type JobPost = {
  id: number;
  companyName: string;
  title: string;
  author: Author;

  skills: string[];
  career: string;
  education: string;
  location: string;
  employmentType: string;

  deadline: string | null;
  createdAt: string;
  viewCount: number;
  likeCount: number;

  apply: ApplyInfo;

  isLiked: boolean;
  isApplied: boolean;
};
