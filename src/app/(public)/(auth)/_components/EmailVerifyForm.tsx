import { useState } from 'react';

import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

import { validateEmail } from '@/lib/validation';

export type EmailVerifyBaseProps = {
  title?: string;
  description?: React.ReactNode;
  onNext: (email: string) => void;
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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<EmailVerifyStatus>('IDLE');
  const [emailError, setEmailError] = useState<string>();

  const isSent = status === 'SENT' || status === 'VERIFY_ERROR' || status === 'VERIFIED';
  const isVerified = status === 'VERIFIED';

  const handleSend = async () => {
    const validationError = validateEmail(email);

    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setEmailError(undefined);
    setStatus('SENDING');

    try {
      // TODO: 이메일 인증번호 발송 API 호출
      setStatus('SENT');
    } catch {
      setStatus('SEND_ERROR');
      setEmailError('인증 메일 발송에 실패했습니다');
    }
  };

  const handleVerify = () => {
    // TODO: 이메일 인증번호 확인 API 호출
    setStatus('VERIFIED');
  };

  const handleNext = () => {
    if (!isVerified) return;

    onNext(email);
  };

  return (
    <div>
      {title && <h2 className="pb-10 text-[20px] font-bold tracking-normal">{title}</h2>}

      <form className="flex flex-col gap-5">
        <Input
          autoFocus
          label="아이디(이메일)"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError(undefined);
          }}
          placeholder="아이디 (이메일) 입력"
          disabled={isSent}
          errorMessage={emailError}
          rightAddon={
            <InputActionButton onClick={handleSend} disabled={status === 'SENDING'}>
              {isSent ? '재발송' : '메일발송'}
            </InputActionButton>
          }
          className="h-10 px-2 tracking-normal"
          showMessageSpace
        />

        <Input
          label="아이디(이메일) 인증번호"
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
              onClick={handleVerify}
              disabled={!isSent || isVerified}
            >
              인증하기
            </InputActionButton>
          }
          className="h-10 px-2 tracking-normal"
          showMessageSpace
        />

        {description && <div className="text-xs leading-[17px] text-gray-500">{description}</div>}

        <Button variant="light" aria-label="다음" onClick={handleNext} disabled={!isVerified}>
          다음
        </Button>
      </form>
    </div>
  );
}
