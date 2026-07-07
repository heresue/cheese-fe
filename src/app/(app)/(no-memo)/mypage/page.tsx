'use client';

import { useState } from 'react';

import { ProfileImage } from '@/components/common/ProfileImage';
import { Button } from '@/components/common/Button';
import CategoryTabs from '@/components/common/CategoryTabs';

import PersonalProfiles from './_components/Profiles/PersonalProfiles';
import CompanyProfiles from './_components/Profiles/CompanyProfiles';
import AccountSettings from './_components/Profiles/AccountSettings';
import MypageModalRenderer from './_components/Profiles/MypageModalRenderer';
import { useMypageModal } from './_components/Modal/useMypageModal';

import { CompanyIcon, PersonalIcon } from '@/assets/icons/settings';

import { mockMypage } from '@/mocks/profile/userProfiles';

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

  const { editingItem, openModal, closeModal } = useMypageModal();

  const mypage = mockMypage;

  const isPersonalProfile = mypageTabs === 'personal';

  const activeProfile = isPersonalProfile ? mypage.personalProfile : mypage.companyProfile;

  const profileName = isPersonalProfile
    ? mypage.personalProfile.nickname
    : mypage.companyProfile.companyName;

  const profileSubText = isPersonalProfile
    ? mypage.personalProfile.interestedJob
    : mypage.companyProfile.companyType;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <ProfileImage src={activeProfile.profileImageUrl} />

          <div className="flex flex-col text-gray-700">
            <span className="text-[20px] font-bold">{profileName}</span>
            <span className="text-[14px]">{profileSubText}</span>
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

        {mypageTabs === 'personal' ? (
          <PersonalProfiles profile={mypage.personalProfile} onOpenModal={openModal} />
        ) : (
          <CompanyProfiles profile={mypage.companyProfile} onOpenModal={openModal} />
        )}

        <AccountSettings profile={mypage.accountSettings} onOpenModal={openModal} />

        <MypageModalRenderer editingItem={editingItem} onClose={closeModal} />
      </div>
    </div>
  );
}
