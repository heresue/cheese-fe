import { useState } from 'react';
import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export type EmailVerifyBaseProps = {
  title?: string;
  description?: React.ReactNode;
  onNext?: () => void;
};

type EmailVerifyFormProps = EmailVerifyBaseProps;

export default function EmailVerifyForm({ title, description, onNext }: EmailVerifyFormProps) {
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div>
      {title && <h2 className="pb-10 text-[20px] font-bold">{title}</h2>}

      <form className="flex flex-col gap-5">
        <Input
          label="아이디"
          placeholder="아이디 (이메일) 입력"
          type="email"
          name="email"
          disabled={isSent}
          rightAddon={
            <InputActionButton type="button" onClick={() => setIsSent(true)}>
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
          rightAddon={
            <InputActionButton type="button" disabled={!isSent} onClick={() => setIsVerified(true)}>
              인증하기
            </InputActionButton>
          }
          errorMessage={'인증번호가 일치하지 않습니다'}
          successMessage={'인증번호가 일치합니다'}
        />

        {description && <div className="text-xs leading-relaxed text-gray-500">{description}</div>}

        <Button type="button" aria-label="다음" disabled={!isVerified} onClick={onNext}>
          다음
        </Button>
      </form>
    </div>
  );
}
