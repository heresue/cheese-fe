export type InfoPost = {
  id: number;
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
