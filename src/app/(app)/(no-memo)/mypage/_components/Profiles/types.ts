import type { ReactNode } from 'react';

import type { MypageModalItem, MypageModalType } from '../Modal/types';

export type ProfileDocument = {
  fileName: string;
  fileUrl?: string;
  url: string;
  urlLabel?: string;
};

export type SettingItemData = {
  label: string;
  value?: string;
  document?: ProfileDocument;
  icon: ReactNode;
  buttonIcon: ReactNode;
  buttonText: string;
  modalType?: MypageModalType;
  options?: string[];
  danger?: boolean;
};

export type PersonalProfilesProps = {
  profile: PersonalProfile;
  onOpenModal: (item: MypageModalItem) => void;
};

export type PersonalProfile = {
  nickname: string;
  interestedJob: string;
  coverLetter: ProfileDocument;
  resume: ProfileDocument;
  skills: string[];
  interests: string[];
};

export type CompanyProfilesProps = {
  profile: CompanyProfile;
  onOpenModal: (item: MypageModalItem) => void;
};

export type CompanyProfile = {
  nickname: string;
  representativeName: string;
  companyType: string;
  resumeTemplate: ProfileDocument;
  industryType: string[];
  employeeCount: number;
  foundedAt: string;
};

export type AccountSettingsProps = {
  profile: AccountSettings;
  onOpenModal: (item: MypageModalItem) => void;
};

export type AccountSettings = {
  contact: string;
  email: string;
  passwordUpdatedAt: string;
  address: string;
};
