export type MemoColor = 'gray' | 'pink' | 'orange' | 'green' | 'blue' | 'purple';

export type Memo = {
  id: string;
  title: string;
  content: string;
  contentText?: string;
  createdAt: string;
  updatedAt?: string;
  color?: MemoColor;
  pinned?: boolean;
  imageSrc?: string;
  imageFileId?: string;
  selected?: boolean;
  deleted?: boolean;
  deletedAt?: string;
};
