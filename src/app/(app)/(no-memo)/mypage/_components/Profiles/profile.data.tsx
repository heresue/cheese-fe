import { ProfileItemData, PersonalProfile, CompanyProfile, AccountSettings } from './types';

import NicknameIcon from '@/assets/icons/settings/user.svg';
import StarIcon from '@/assets/icons/settings/star.svg';
import DocumentIcon from '@/assets/icons/settings/documents.svg';
import CompanyIcon from '@/assets/icons/settings/company.svg';
import SkillsIcon from '@/assets/icons/settings/skills.svg';
import InterestsIcon from '@/assets/icons/like-outline.svg';

import IndustryIcon from '@/assets/icons/settings/industry.svg';
import EmployeeIcon from '@/assets/icons/settings/users.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';

import ContactIcon from '@/assets/icons/contact.svg';
import EmailIcon from '@/assets/icons/settings/email.svg';
import PasswordIcon from '@/assets/icons/settings/password.svg';
import AddressIcon from '@/assets/icons/settings/location.svg';

import LogoutIcon from '@/assets/icons/settings/logout.svg';
import DeleteIcon from '@/assets/icons/delete.svg';

import EditIcon from '@/assets/icons/edit.svg';
import PlusIcon from '@/assets/icons/plus.svg';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
}

export function getPersonalProfileItems(profile: PersonalProfile): ProfileItemData[] {
  return [
    {
      label: '닉네임',
      value: profile.nickname,
      icon: <NicknameIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '관심직무',
      value: profile.interestedJob,
      icon: <StarIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '자기소개서',
      value: profile.coverLetterFileName || '첨부된 파일 없음',
      icon: <DocumentIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '이력서 및 기타문서',
      value: profile.resumeFileName || '첨부된 파일 없음',
      icon: <CompanyIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '내 스킬',
      value: profile.skills.join(', '),
      icon: <SkillsIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '내 관심분야',
      value: profile.interests.join(', '),
      icon: <InterestsIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
  ];
}

export function getCompanyProfileItems(profile: CompanyProfile): ProfileItemData[] {
  return [
    {
      label: '기업명',
      value: profile.nickname,
      icon: <NicknameIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '대표자명',
      value: profile.representativeName,
      icon: <StarIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '기업구분',
      value: profile.companyType,
      icon: <DocumentIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '이력서 양식 및 기업 홈페이지',
      // TODO: 파일 첨부 및 URL 등록 기능 구현 시 링크 UI로 분리
      value: [
        profile.resumeTemplateFileName || '첨부된 양식 없음',
        profile.companyWebsiteUrl || '등록된 홈페이지 없음',
      ].join(' / '),
      icon: <CompanyIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '산업구분',
      value: profile.industryType.join(', '),
      icon: <IndustryIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '사원수',
      value: `${profile.employeeCount}명`,
      icon: <EmployeeIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
    {
      label: '설립일',
      value: formatDate(profile.foundedAt),
      icon: <CalendarIcon className="h-6" />,
      buttonIcon: <PlusIcon className="h-3" />,
      buttonText: '추가',
    },
  ];
}

export function getAccountItems(profile: AccountSettings): ProfileItemData[] {
  return [
    {
      label: '선호하는 연락방식',
      value: profile.contact,
      icon: <ContactIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '이메일',
      value: profile.email,
      icon: <EmailIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '비밀번호',
      value: `마지막 변경일: ${formatDate(profile.passwordUpdatedAt)}`,
      icon: <PasswordIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '주소',
      value: profile.address,
      icon: <AddressIcon className="h-6" />,
      buttonIcon: <EditIcon className="h-[14px]" />,
      buttonText: '변경',
    },
    {
      label: '로그아웃',
      value: '모든 기기에서 로그아웃 됩니다',
      icon: <LogoutIcon className="h-6" />,
      buttonIcon: <LogoutIcon className="h-[14px]" />,
      buttonText: '로그아웃',
    },
    {
      label: '내 계정 삭제',
      value: '계정을 영구적으로 삭제하고 지금 까지의 활동기록을 모두 제거 합니다',
      icon: <DeleteIcon className="h-6" />,
      buttonIcon: <DeleteIcon className="h-[14px]" />,
      buttonText: '계정삭제',
      danger: true,
    },
  ];
}
