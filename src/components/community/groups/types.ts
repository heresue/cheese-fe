export type GroupPost = {
  id: number;
  field: 'FE' | 'BE';
  title: string;
  recruitCount: number;
  expectedPeriod: string;
  author: {
    nickname: string;
    profileImageUrl: string;
  };
  deadline: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};
