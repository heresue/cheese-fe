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

export type MemoSavePayload = Omit<
  Memo,
  'id' | 'createdAt' | 'updatedAt' | 'contentText' | 'imageFileId' | 'deletedAt'
> &
  Partial<Pick<Memo, 'id' | 'createdAt'>> & {
    imageFile?: File;
    imageFileId?: string | null;
  };
