'use client';

import { useState } from 'react';
import EmailStep from './_components/EmailStep';
import VerifyStep from './_components/VerifyStep';
import NewPasswordStep from './_components/NewPasswordStep';
import DoneModal from './_components/DoneModal';

type Step = 'EMAIL' | 'VERIFY' | 'NEW_PASSWORD';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('EMAIL');
  const [isDoneOpen, setIsDoneOpen] = useState(false);

  // TODO: 비밀번호 재설정 API 호출 시 사용
  const [verifiedEmail, setVerifiedEmail] = useState('');

  return (
    <>
      {step === 'EMAIL' && <EmailStep onNext={() => setStep('VERIFY')} />}

      {step === 'VERIFY' && (
        <VerifyStep
          onNext={(email) => {
            setVerifiedEmail(email);
            setStep('NEW_PASSWORD');
          }}
        />
      )}

      {step === 'NEW_PASSWORD' && <NewPasswordStep onComplete={() => setIsDoneOpen(true)} />}

      <DoneModal isOpen={isDoneOpen} onClose={() => setIsDoneOpen(false)} />
    </>
  );
}
