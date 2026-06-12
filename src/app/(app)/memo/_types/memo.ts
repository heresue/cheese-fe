export type MemoColor = 'pink' | 'gray' | 'orange' | 'green' | 'blue' | 'purple';

export type Memo = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageSrc?: string;
  color?: MemoColor;
  pinned?: boolean;
  selected?: boolean;
  deleted?: boolean;
};
