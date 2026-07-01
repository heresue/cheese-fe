export type UserSummary = {
  id: number;
  type: 'personal' | 'company';
  nickname: string;
  email: string;
  profileImageUrl?: string;
};

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

  author: UserSummary;

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

export type InfoPost = {
  id: number;

  author: UserSummary;

  createdAt: string;

  thumbnailUrl: string;

  category: '질문글' | '정보글' | '자료공유';
  title: string;

  content: string;

  tags: string[];

  attachmentFileName?: string;
  attachmentUrl?: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;

  isLiked: boolean;
};

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

  author: UserSummary;

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
