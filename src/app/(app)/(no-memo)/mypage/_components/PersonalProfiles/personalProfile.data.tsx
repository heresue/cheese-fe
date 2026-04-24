import NicknameIcon from '@/assets/icons/common/user.svg';
import InterestedJobIcon from '@/assets/icons/common/star.svg';
import CoverLetterIcon from '@/assets/icons/common/cover-letter.svg';
import ResumeIcon from '@/assets/icons/common/company.svg';
import SkillsIcon from '@/assets/icons/common/skills.svg';
import InterestsIcon from '@/assets/icons/common/like.svg';

import ContactIcon from '@/assets/icons/common/contact.svg';
import EmailIcon from '@/assets/icons/common/email.svg';
import PasswordIcon from '@/assets/icons/common/password.svg';
import AddressIcon from '@/assets/icons/common/location.svg';
import LogoutIcon from '@/assets/icons/action/logout.svg';
import DeleteIcon from '@/assets/icons/action/delete.svg';

import EditIcon from '@/assets/icons/ui/edit.svg';
import PlusIcon from '@/assets/icons/ui/plus.svg';

import type { ReactNode } from 'react';

export type PersonalProfile = {
  nickname: string;
  interestedJob: string;
  coverLetterFileName: string;
  resumeFileName: string;
  skills: string[];
  interests: string[];
  contact: string;
  email: string;
  passwordUpdatedAt: string;
  address: string;
};

type ProfileItemData = {
  label: string;
  value: string;
  icon: ReactNode;
  buttonIcon: ReactNode;
  buttonText: string;
  danger?: boolean;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
}

export function getProfileItems(profile: PersonalProfile): ProfileItemData[] {
  return [
    {
      label: '닉네임',
      value: profile.nickname,
      icon: <NicknameIcon className="w-6" />,
      buttonIcon: <EditIcon />,
      buttonText: '변경',
    },
    {
      label: '관심직무',
      value: profile.interestedJob,
      icon: <InterestedJobIcon className="w-6" />,
      buttonIcon: <EditIcon />,
      buttonText: '변경',
    },
    {
      label: '자기소개서',
      value: profile.coverLetterFileName || '첨부된 파일 없음',
      icon: <CoverLetterIcon className="h-6" />,
      buttonIcon: <PlusIcon />,
      buttonText: '추가',
    },
    {
      label: '이력서 및 기타문서',
      value: profile.resumeFileName || '첨부된 파일 없음',
      icon: <ResumeIcon className="h-6" />,
      buttonIcon: <PlusIcon />,
      buttonText: '추가',
    },
    {
      label: '내 스킬',
      value: profile.skills.join(', '),
      icon: <SkillsIcon className="w-6" />,
      buttonIcon: <PlusIcon />,
      buttonText: '추가',
    },
    {
      label: '내 관심분야',
      value: profile.interests.join(', '),
      icon: <InterestsIcon className="w-6" />,
      buttonIcon: <PlusIcon />,
      buttonText: '추가',
    },
  ];
}

export function getAccountItems(profile: PersonalProfile): ProfileItemData[] {
  return [
    {
      label: '선호하는 연락방식',
      value: profile.contact,
      icon: <ContactIcon className="w-6" />,
      buttonIcon: <EditIcon />,
      buttonText: '변경',
    },
    {
      label: '이메일',
      value: profile.email,
      icon: <EmailIcon className="w-6" />,
      buttonIcon: <EditIcon />,
      buttonText: '변경',
    },
    {
      label: '비밀번호',
      value: `마지막 변경일: ${formatDate(profile.passwordUpdatedAt)}`,
      icon: <PasswordIcon className="h-6" />,
      buttonIcon: <EditIcon />,
      buttonText: '변경',
    },
    {
      label: '주소',
      value: profile.address,
      icon: <AddressIcon className="h-6" />,
      buttonIcon: <EditIcon />,
      buttonText: '변경',
    },
    {
      label: '로그아웃',
      value: '모든 기기에서 로그아웃 됩니다',
      icon: <LogoutIcon className="h-6" />,
      buttonIcon: <LogoutIcon />,
      buttonText: '로그아웃',
    },
    {
      label: '내 계정 삭제',
      value: '계정을 영구적으로 삭제하고 지금 까지의 활동기록을 모두 제거 합니다',
      icon: <DeleteIcon className="h-6" />,
      buttonIcon: <DeleteIcon />,
      buttonText: '계정삭제',
      danger: true,
    },
  ];
}
