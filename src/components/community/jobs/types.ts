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
  applicantCount: number;

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

  content: string;
  imageUrl?: string;

  apply: ApplyInfo;

  isLiked: boolean;
  isApplied: boolean;
};
