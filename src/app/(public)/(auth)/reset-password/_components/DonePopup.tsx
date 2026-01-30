'use client';

import ConfirmPopup from '@/components/common/Popup/ConfirmPopup';
import { useRouter } from 'next/navigation';

type DonePopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DonePopup({ isOpen, onClose }: DonePopupProps) {
  const router = useRouter();

  return (
    <ConfirmPopup
      isOpen={isOpen}
      onClose={onClose}
      title="비밀번호 변경 완료"
      description="비밀번호가 변경되었습니다"
      primaryText="로그인하러 가기"
      onPrimaryClick={() => {
        onClose();
        router.push('/login');
      }}
    />
  );
}
