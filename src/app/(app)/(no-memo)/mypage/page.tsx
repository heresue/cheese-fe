import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Tab, TabList, TabPanel, Tabs } from '@/components/common/Tabs';

import PersonalIcon from '@/assets/icons/common/personal.svg';
import CompanyIcon from '@/assets/icons/common/company.svg';
import ProfileMockImage from 'public/profile_default.png';
import PersonalProfiles from './_components/PersonalProfiles';

const mockProfile = {
  nickname: '김치즈',
  interestedJob: 'FE (프론트엔드)',
  coverLetterFileName: '',
  resumeFileName: '',
  skills: ['HTML5', 'CSS3', 'JavaScript'],
  interests: ['Redux', 'Zustand', 'Recoil', 'Context API'],
  contact: '이메일/오픈카카오톡',
  email: 'test@test.com',
  passwordUpdatedAt: '2026-01-30',
  address: '서울특별시',
};

export default function MyPage() {
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

        <Tabs defaultValue="personal">
          <TabList>
            <Tab value="personal">
              <PersonalIcon width={14} height={14} />
              개인 프로필
            </Tab>
            <Tab value="company">
              <CompanyIcon width={14} height={14} />
              기업 프로필
            </Tab>
          </TabList>

          <TabPanel value="personal">
            <PersonalProfiles profile={mockProfile} />
          </TabPanel>

          <TabPanel value="company">기업 프로필 영역</TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
