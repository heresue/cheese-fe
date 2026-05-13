import type { ReactNode } from 'react';

export type ProfileItemData = {
  label: string;
  value: string;
  icon: ReactNode;
  buttonIcon: ReactNode;
  buttonText: string;
  danger?: boolean;
};

export type PersonalProfilesProps = {
  profile: PersonalProfile;
};

export type PersonalProfile = {
  nickname: string;
  interestedJob: string;
  coverLetterFileName: string;
  resumeFileName: string;
  skills: string[];
  interests: string[];
};

export type CompanyProfilesProps = {
  profile: CompanyProfile;
};

export type CompanyProfile = {
  nickname: string;
  representativeName: string;
  companyType: string;
  resumeTemplateFileName: string;
  companyWebsiteUrl: string;
  industryType: string[];
  employeeCount: number;
  foundedAt: string;
};

export type AccountSettingsProps = {
  profile: AccountSettings;
};

export type AccountSettings = {
  contact: string;
  email: string;
  passwordUpdatedAt: string;
  address: string;
};
