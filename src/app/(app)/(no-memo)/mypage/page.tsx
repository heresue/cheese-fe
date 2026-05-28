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

import { mockAccountSettings, mockCompanyProfile, mockPersonalProfile } from './data';
import { useMypageModal } from '@/app/(app)/(no-memo)/mypage/_components/Modal/useMypageModal';
import TextEditModal from '@/app/(app)/(no-memo)/mypage/_components/Modal/TextEditModal';
import DocumentEditModal from '@/app/(app)/(no-memo)/mypage/_components/Modal/DocumentEditModal';
import ConfirmModal from '@/app/(app)/(no-memo)/mypage/_components/Modal/ConfirmModal';
import SelectEditModal from '@/app/(app)/(no-memo)/mypage/_components/Modal/SelectEditModal';

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
  const profileImage = ProfileMockImage;
  const [mypageTabs, setMypageTabs] = useState<MypageCategoryTabValue>(
    MYPAGE_PROFILE_CATEGORY_TABS[0].value,
  );

  const { editingItem, openModal, closeModal } = useMypageModal();

  const isTextModal = editingItem?.modalType === 'text';
  const isDocumentModal = editingItem?.modalType === 'document';
  const isSelectModal = editingItem?.modalType === 'select';
  const isConfirmModal = editingItem?.modalType === 'confirm';

  const hasOpenKakaoInput = editingItem?.label === '선호하는 연락방식';
  const isLogout = isConfirmModal && editingItem.label === '로그아웃';
  const isDeleteAccount = isConfirmModal && editingItem.label === '내 계정 삭제';

  const confirmModalTitle = isLogout
    ? '계정에서 로그아웃 하시겠습니까?'
    : '정말 계정을 삭제하시겠습니까?';

  const confirmModalDescription = isLogout
    ? '접속한 기기에서 로그아웃 됩니다'
    : `계정을 영구적으로 삭제하고 지금까지의 활동기록을 모두 제거합니다.
    계정을 삭제하면 되돌릴 수 없습니다`;

  const confirmButtonClassName = isLogout ? 'bg-tag-red-100 text-error' : 'bg-error text-gray-50';

  const confirmTitleClassName = isDeleteAccount ? 'text-error' : '';

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

        {mypageTabs === 'personal' && (
          <PersonalProfiles profile={mockPersonalProfile} onOpenModal={openModal} />
        )}

        {mypageTabs === 'company' && (
          <CompanyProfiles profile={mockCompanyProfile} onOpenModal={openModal} />
        )}

        <AccountSettings profile={mockAccountSettings} onOpenModal={openModal} />

        {isTextModal && (
          <TextEditModal
            isOpen
            title={`${editingItem.label} ${editingItem.buttonText}`}
            inputLabel={editingItem.label}
            value={editingItem.value}
            description={
              editingItem.label === '내 스킬' || editingItem.label === '내 관심분야'
                ? 'ex) HTML, CSS3, Java ...'
                : undefined
            }
            onClose={closeModal}
          />
        )}

        {isDocumentModal && (
          <DocumentEditModal
            isOpen
            title={`${editingItem.label} 추가`}
            inputLabel={editingItem.label}
            document={editingItem.document}
            onClose={closeModal}
          />
        )}

        {isSelectModal && (
          <SelectEditModal
            isOpen
            title={`${editingItem.label} ${editingItem.buttonText}`}
            inputLabel={editingItem.label}
            value={editingItem.value}
            options={editingItem.options ?? []}
            hasOpenKakaoInput={hasOpenKakaoInput}
            onClose={closeModal}
          />
        )}

        {isConfirmModal && (
          <ConfirmModal
            isOpen
            title={confirmModalTitle}
            titleClassName={confirmTitleClassName}
            description={confirmModalDescription}
            buttonText={editingItem.label}
            buttonClassName={confirmButtonClassName}
            onClose={closeModal}
            onConfirm={() => {
              if (editingItem.label === '로그아웃') {
                // TODO: 로그아웃
              }

              if (editingItem.label === '내 계정 삭제') {
                // TODO: 계정 삭제
              }

              closeModal();
            }}
          />
        )}
      </div>
    </div>
  );
}
