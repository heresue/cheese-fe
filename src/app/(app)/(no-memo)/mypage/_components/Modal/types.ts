export type MypageModalType = 'text' | 'document' | 'tag' | 'confirm' | 'select';

export type MypageModalItem = {
  label: string;
  value?: string;
  modalType: MypageModalType;
};
