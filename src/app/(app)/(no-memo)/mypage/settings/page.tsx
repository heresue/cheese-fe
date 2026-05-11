import ProfileItem from '@/app/(app)/(no-memo)/mypage/_components/Profiles/ProfileItem';

import ChevronIcon from '@/assets/icons/chevron.svg';
import ThemeIcon from '@/assets/icons/settings/theme.svg';

const SETTINGS = [
  {
    label: '테마',
    value: '사용하실 테마를 선택해주세요',
    icon: <ThemeIcon className="h-6" />,
    buttonIcon: <ChevronIcon className="h-[10px]" />,
    buttonText: '시스템 설정',
  },
];

export default function SettingsPage() {
  return (
    <div>
      <ProfileItem label="" />
    </div>
  );
}
