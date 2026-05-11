'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import CategoryTabs from '@/components/common/CategoryTabs';

import PersonalProfiles from './_components/Profiles/PersonalProfiles';
import CompanyProfiles from './_components/Profiles/CompanyProfiles';
import AccountSettings from './_components/Profiles/AccountSettings';

import PersonalIcon from '@/assets/icons/settings/personal.svg';
import CompanyIcon from '@/assets/icons/settings/company.svg';

import ProfileMockImage from 'public/profile_default.png';

const mockPersonalProfile = {
  nickname: '김치즈',
  interestedJob: 'FE (프론트엔드)',
  coverLetterFileName: '',
  resumeFileName: '',
  skills: ['HTML5', 'CSS3', 'JavaScript'],
  interests: ['Redux', 'Zustand', 'Recoil', 'Context API'],
};

const mockCompanyProfile = {
  nickname: '치즈공장',
  representativeName: '변대환',
  companyType: '스타트업',
  resumeTemplateFileName: 'cheese_resume_template.pdf',
  companyWebsiteUrl: 'https://cheese-company.com',
  industryType: ['솔루션 SI', 'CRM', 'ERP'],
  employeeCount: 10,
  foundedAt: '2020-05-15',
};

const mockAccountSettings = {
  contact: '이메일/오픈카카오톡',
  email: 'test@test.com',
  passwordUpdatedAt: '2026-01-30',
  address: '서울특별시',
};

const MYPAGE_PROFILE_CATEGORY_TABS = [
  {
    label: '개인 프로필',
    value: 'personal',
    icon: PersonalIcon,
  },
  {
    label: '기업 프로필',
    value: 'company',
    icon: CompanyIcon,
  },
];

type MypageCategoryTabValue = (typeof MYPAGE_PROFILE_CATEGORY_TABS)[number]['value'];

export default function MyPage() {
  const [mypageTabs, setMypageTabs] = useState<MypageCategoryTabValue>(
    MYPAGE_PROFILE_CATEGORY_TABS[0].value,
  );
  const profileImage = ProfileMockImage;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <Image src={profileImage} alt="프로필 이미지" width={60} height={60} />
          <div className="flex flex-col text-gray-700">
            <span className="text-[20px] font-bold">김치즈</span>
            <span className="text-[14px]">FE (프론트엔드)</span>
          </div>
        </div>
        <Button variant="outlineLightGray" size={38} paddingX={8}>
          프로필 사진 변경
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-[20px] font-medium text-gray-700">프로필 설정</h2>

        <CategoryTabs
          items={MYPAGE_PROFILE_CATEGORY_TABS}
          activeValue={mypageTabs}
          onChange={setMypageTabs}
          className="[&>button]:h-[46px] [&>button]:px-3"
        />

        {mypageTabs === 'personal' && <PersonalProfiles profile={mockPersonalProfile} />}

        {mypageTabs === 'company' && <CompanyProfiles profile={mockCompanyProfile} />}

        <AccountSettings profile={mockAccountSettings} />
      </div>
    </div>
  );
}
