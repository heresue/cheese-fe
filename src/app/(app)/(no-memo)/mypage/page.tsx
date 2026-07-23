'use client';

import { useState } from 'react';

import ProfileImage from '@/components/common/ProfileImage';
import { Button } from '@/components/common/Button';
import CategoryTabs, { type CategoryTabItem } from '@/components/common/CategoryTabs';

import PersonalProfiles from './_components/Profiles/PersonalProfiles';
import CompanyProfiles from './_components/Profiles/CompanyProfiles';
import AccountSettings from './_components/Profiles/AccountSettings';
import MypageModalRenderer from './_components/Profiles/MypageModalRenderer';
import { useMypageModal } from './_components/Modal/useMypageModal';
import ConfirmModal from './_components/Modal/ConfirmModal';

import { CompanyIcon, PersonalIcon } from '@/assets/icons/settings';

import type { ProfileType } from '@/types/profile';

import { mockMypage } from '@/mocks/profile/userProfiles';

const PROFILE_SWITCH_OPTIONS: CategoryTabItem<ProfileType>[] = [
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

export default function MyPage() {
  const [activeProfileType, setActiveProfileType] = useState<ProfileType>(
    mockMypage.activeProfileType,
  );
  const [pendingProfileType, setPendingProfileType] = useState<ProfileType | null>(null);

  const { editingItem, openModal, closeModal } = useMypageModal();

  const mypage = mockMypage;

  const isPersonalProfile = activeProfileType === 'personal';
  const nextProfileLabel = PROFILE_SWITCH_OPTIONS.find(
    (option) => option.value === pendingProfileType,
  )?.label;

  const profileHeader = isPersonalProfile
    ? {
        imageUrl: mypage.personalProfile.profileImageUrl,
        name: mypage.personalProfile.nickname,
        subText: mypage.personalProfile.interestedJob,
      }
    : {
        imageUrl: mypage.companyProfile.profileImageUrl,
        name: mypage.companyProfile.companyName,
        subText: mypage.companyProfile.companyType,
      };

  const handleChangeProfileType = (value: ProfileType) => {
    if (value === activeProfileType) return;

    setPendingProfileType(value);
  };

  const handleConfirmProfileChange = () => {
    if (!pendingProfileType) return;

    // TODO:
    // - 프로필 전환 API 호출
    // - activeProfileType 전역 상태 업데이트
    // - 사이드바 및 전체 서비스 프로필 동기화
    setActiveProfileType(pendingProfileType);
    setPendingProfileType(null);
  };

  const handleCancelProfileChange = () => {
    setPendingProfileType(null);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <ProfileImage src={profileHeader.imageUrl} />

            <div className="flex flex-col text-gray-700">
              <span className="text-[20px] font-bold">{profileHeader.name}</span>
              <span className="text-[14px]">{profileHeader.subText}</span>
            </div>
          </div>
          <Button variant="outlineLightGray" size={38} paddingX={8}>
            프로필 사진 변경
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-[20px] font-medium text-gray-700">프로필 설정</h2>

          <CategoryTabs
            items={PROFILE_SWITCH_OPTIONS}
            activeValue={activeProfileType}
            onChange={handleChangeProfileType}
            size="sm"
          />

          {isPersonalProfile ? (
            <PersonalProfiles profile={mypage.personalProfile} onOpenModal={openModal} />
          ) : (
            <CompanyProfiles profile={mypage.companyProfile} onOpenModal={openModal} />
          )}

          <AccountSettings profile={mypage.accountSettings} onOpenModal={openModal} />

          <MypageModalRenderer editingItem={editingItem} onClose={closeModal} />
        </div>
      </div>

      <ConfirmModal
        isOpen={pendingProfileType !== null}
        onClose={handleCancelProfileChange}
        onConfirm={handleConfirmProfileChange}
        title="프로필을 전환하시겠습니까?"
        description={`전환 후 ${nextProfileLabel}로 서비스가 이용됩니다.`}
        buttonText="전환하기"
      />
    </>
  );
}
