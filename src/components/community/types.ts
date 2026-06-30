export type Author = {
  id: number;
  type: 'personal' | 'company';
  nickname: string;
  email: string;
  profileImageUrl?: string;
};
