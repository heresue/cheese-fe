'use client';

import { useState } from 'react';

import ProfileImage from '@/components/common/ProfileImage';
import { Button } from '@/components/common/Button';
import CategoryTabs, { type CategoryTabItem } from '@/components/common/CategoryTabs';

import PersonalProfiles from './_components/Profiles/PersonalProfiles';
import CompanyProfiles from './_components/Profiles/CompanyProfiles';
import AccountSettings from './_components/Profiles/AccountSettings';
import MypageModalRenderer from './_components/Modal/MypageModalRenderer';
import { useMypageModal } from './_components/Modal/useMypageModal';
import ConfirmModal from './_components/Modal/ConfirmModal';

import { useCurrentUser } from '@/queries/auth/useCurrentUser';
import { useMypage } from '@/queries/mypage/useMypage';
import { useUpdatePersonalProfile } from '@/queries/mypage/useUpdatePersonalProfile';
import { useUpdateCompanyProfile } from '@/queries/mypage/useUpdateCompanyProfile';
import { useUpdateActiveProfileType } from '@/queries/mypage/useUpdateActiveProfileType';
import { useUploadFile } from '@/queries/files/useUploadFile';

import { CompanyIcon, PersonalIcon } from '@/assets/icons/settings';

import type { ContactSettings, ProfileDocument, ProfileType } from '@/types/profile';
import type { MypageItemField, MypageItemSection } from './_components/Modal/types';

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
  const { data: user } = useCurrentUser();
  const { data: mypage, isPending, isError } = useMypage(user?.id);
  const { mutateAsync: updateActiveProfileType } = useUpdateActiveProfileType();
  const { mutateAsync: updatePersonalProfile } = useUpdatePersonalProfile();
  const { mutateAsync: updateCompanyProfile } = useUpdateCompanyProfile();
  const { mutateAsync: uploadFile } = useUploadFile();

  const [pendingProfileType, setPendingProfileType] = useState<ProfileType | null>(null);

  const { editingItem, openModal, closeModal } = useMypageModal();

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (isError || !mypage) {
    return <div>마이페이지 정보를 불러오지 못했습니다.</div>;
  }

  // TODO: 사이드바 프로필 정보를 activeProfileType 변경과 동기화
  const activeProfileType = mypage.activeProfileType;
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

  const handleConfirmProfileChange = async () => {
    if (!pendingProfileType || !user?.id) return;

    try {
      await updateActiveProfileType({
        userId: user.id,
        activeProfileType: pendingProfileType,
      });

      setPendingProfileType(null);
    } catch (error) {
      console.error('Failed to update active profile type:', error);
    }
  };

  const handleCancelProfileChange = () => {
    setPendingProfileType(null);
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !user?.id) return;

    try {
      const uploadedFile = await uploadFile({
        userId: user.id,
        file,
      });

      if (isPersonalProfile) {
        const personalProfileData = {
          nickname: mypage.personalProfile.nickname,
          email: mypage.personalProfile.email,
          profileImageUrl: uploadedFile.url,
          interestedJob: mypage.personalProfile.interestedJob,
          coverLetter: mypage.personalProfile.coverLetter,
          additionalDocument: mypage.personalProfile.additionalDocument,
          skills: mypage.personalProfile.skills,
          interests: mypage.personalProfile.interests,
          contactMethod: mypage.personalProfile.contactMethod,
          contactUrl: mypage.personalProfile.contactUrl,
        };

        await updatePersonalProfile({
          userId: user.id,
          data: personalProfileData,
        });
      } else {
        const companyProfileData = {
          companyName: mypage.companyProfile.companyName,
          email: mypage.companyProfile.email,
          profileImageUrl: uploadedFile.url,
          representativeName: mypage.companyProfile.representativeName,
          companyType: mypage.companyProfile.companyType,
          resumeTemplate: mypage.companyProfile.resumeTemplate,
          industryType: mypage.companyProfile.industryType,
          employeeCount: mypage.companyProfile.employeeCount,
          foundedAt: mypage.companyProfile.foundedAt,
          contactMethod: mypage.companyProfile.contactMethod,
          contactUrl: mypage.companyProfile.contactUrl,
        };

        await updateCompanyProfile({
          userId: user.id,
          data: companyProfileData,
        });
      }
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

  const handleSaveMypageItem = async (
    section: MypageItemSection,
    field: MypageItemField,
    value: string | ProfileDocument | ContactSettings,
  ) => {
    if (section === 'accountAction') return;

    try {
      if (section === 'personalProfile') {
        if (!user?.id) return;

        let nextValue: unknown = value;

        if ((field === 'skills' || field === 'interests') && typeof value === 'string') {
          nextValue = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        }

        const personalProfileData = {
          nickname: mypage.personalProfile.nickname,
          email: mypage.personalProfile.email,
          profileImageUrl: mypage.personalProfile.profileImageUrl,
          interestedJob: mypage.personalProfile.interestedJob,
          coverLetter: mypage.personalProfile.coverLetter,
          additionalDocument: mypage.personalProfile.additionalDocument,
          skills: mypage.personalProfile.skills,
          interests: mypage.personalProfile.interests,
          contactMethod: mypage.personalProfile.contactMethod,
          contactUrl: mypage.personalProfile.contactUrl,
        };

        await updatePersonalProfile({
          userId: user.id,
          data: { ...personalProfileData, [field]: nextValue },
        });

        closeModal();
      }

      if (section === 'companyProfile') {
        if (!user?.id) return;

        let nextValue: unknown = value;

        if (field === 'industryType' && typeof value === 'string') {
          nextValue = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        }

        if (field === 'employeeCount' && typeof value === 'string') {
          nextValue = Number(value);
        }

        const companyProfileData = {
          companyName: mypage.companyProfile.companyName,
          email: mypage.companyProfile.email,
          profileImageUrl: mypage.companyProfile.profileImageUrl,
          representativeName: mypage.companyProfile.representativeName,
          companyType: mypage.companyProfile.companyType,
          resumeTemplate: mypage.companyProfile.resumeTemplate,
          industryType: mypage.companyProfile.industryType,
          employeeCount: mypage.companyProfile.employeeCount,
          foundedAt: mypage.companyProfile.foundedAt,
          contactMethod: mypage.companyProfile.contactMethod,
          contactUrl: mypage.companyProfile.contactUrl,
        };

        await updateCompanyProfile({
          userId: user.id,
          data: { ...companyProfileData, [field]: nextValue },
        });

        closeModal();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
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

          <label className="cursor-pointer">
            <Button asChild variant="outlineLightGray" size={38} paddingX={8}>
              <span>프로필 사진 변경</span>
            </Button>

            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleProfileImageChange}
            />
          </label>
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

          <MypageModalRenderer
            editingItem={editingItem}
            onClose={closeModal}
            onSave={handleSaveMypageItem}
          />
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
