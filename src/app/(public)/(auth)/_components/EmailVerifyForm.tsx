import { useState } from 'react';
import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export type EmailVerifyBaseProps = {
  title?: string;
  description?: React.ReactNode;
  onNext?: () => void;
};

export type EmailVerifyStatus =
  | 'IDLE'
  | 'SENDING'
  | 'SENT'
  | 'SEND_ERROR'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'VERIFY_ERROR';

type EmailVerifyFormProps = EmailVerifyBaseProps;

export default function EmailVerifyForm({ title, description, onNext }: EmailVerifyFormProps) {
  const [status, setStatus] = useState<EmailVerifyStatus>('IDLE');

  const isSent = status === 'SENT' || status === 'VERIFY_ERROR' || status === 'VERIFIED';
  const isVerified = status === 'VERIFIED';

  const handleSend = () => {
    // UI PR 단계: API/비동기 없이 "발송됨" 상태로만 전이
    setStatus('SENT');
  };

  const handleVerify = () => {
    // UI PR 단계: API/비동기 없이 "인증됨" 상태로만 전이
    setStatus('VERIFIED');
  };

  return (
    <div>
      {title && <h2 className="pb-10 text-[20px] font-bold tracking-normal">{title}</h2>}

      <form className="flex flex-col gap-5">
        <Input
          label="아이디"
          name="email"
          type="email"
          placeholder="아이디 (이메일) 입력"
          disabled={isSent}
          errorMessage={status === 'SEND_ERROR' ? '이메일 형식이 올바르지 않습니다' : undefined}
          rightAddon={
            <InputActionButton type="button" onClick={handleSend}>
              {status === 'IDLE' ? '메일발송' : '재발송'}
            </InputActionButton>
          }
          className="h-10 px-2 tracking-normal"
        />

        <Input
          label="아이디 인증번호"
          name="verificationCode"
          type="text"
          inputMode="numeric"
          placeholder="인증번호 입력"
          disabled={!isSent || isVerified}
          errorMessage={status === 'VERIFY_ERROR' ? '인증번호가 올바르지 않습니다' : undefined}
          successMessage={status === 'VERIFIED' ? '인증번호가 일치합니다' : undefined}
          rightAddon={
            <InputActionButton
              type="button"
              disabled={!isSent || isVerified}
              onClick={handleVerify}
            >
              인증하기
            </InputActionButton>
          }
          className="h-10 px-2 tracking-normal"
        />

        {description && (
          <div className="text-text-muted text-xs leading-relaxed">{description}</div>
        )}

        <Button
          type="button"
          aria-label="다음"
          disabled={!isVerified}
          onClick={onNext}
          className="tracking-normal"
        >
          다음
        </Button>
      </form>
    </div>
  );
}
