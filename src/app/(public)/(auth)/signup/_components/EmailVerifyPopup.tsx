import Image from 'next/image';
import { useState } from 'react';
import { BasePopup } from '@/components/common/Popup';
import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

type EmailVerifyPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EmailVerifyPopup({ isOpen, onClose }: EmailVerifyPopupProps) {
  const [isSent, setIsSent] = useState(false);

  return (
    <BasePopup isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[457px] flex-col gap-10 rounded-[25px] bg-gray-50 px-14 py-10">
        <div>
          <Image src="/brands/cheese-logo.svg" alt="CHEESE" width={125} height={34} priority />
        </div>

        <h2 className="text-[20px] font-bold">아이디(이메일) 입력</h2>

        <form className="flex flex-col gap-5">
          <Input
            label="아이디"
            placeholder="아이디 (이메일) 입력"
            type="email"
            name="email"
            disabled={isSent}
            rightAddon={
              <InputActionButton onClick={() => setIsSent(true)}>
                {isSent ? '재발송' : '메일발송'}
              </InputActionButton>
            }
            errorMessage={'이메일이 올바르지 않습니다'}
          />
          <Input
            label="아이디 인증번호"
            placeholder="인증번호 입력"
            type="text"
            inputMode="numeric"
            name="verificationCode"
            disabled={!isSent}
            rightAddon={<InputActionButton disabled={!isSent}>인증하기</InputActionButton>}
            errorMessage={'인증번호가 일치하지 않습니다'}
            successMessage={'인증번호가 일치합니다'}
          />

          <Button aria-label="다음" onClick={onClose}>
            다음
          </Button>
        </form>
      </div>
    </BasePopup>
  );
}
