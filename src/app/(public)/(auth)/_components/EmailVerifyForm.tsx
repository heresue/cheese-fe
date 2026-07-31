import { useState } from 'react';
import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

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

  const isSent = status === 'SENT' || status === 'VERIFY_ERROR' || status === 'VERIFIED';
  const isVerified = status === 'VERIFIED';

  const handleSend = () => {
    if (!email.trim()) {
      setStatus('SEND_ERROR');
      return;
    }

    // TODO: 이메일 인증번호 발송 API 호출
    setStatus('SENT');
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
          label="아이디"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="아이디 (이메일) 입력"
          disabled={isSent}
          errorMessage={status === 'SEND_ERROR' ? '이메일 형식이 올바르지 않습니다' : undefined}
          rightAddon={
            <InputActionButton onClick={handleSend}>
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
              onClick={handleVerify}
              disabled={!isSent || isVerified}
            >
              인증하기
            </InputActionButton>
          }
          className="h-10 px-2 tracking-normal"
        />

        {description && <div className="text-xs leading-[17px] text-gray-500">{description}</div>}

        <Button variant="light" aria-label="다음" onClick={handleNext} disabled={!isVerified}>
          다음
        </Button>
      </form>
    </div>
  );
}
