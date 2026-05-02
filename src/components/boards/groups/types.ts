export type GroupPost = {
  id: number;
  field: string;
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
