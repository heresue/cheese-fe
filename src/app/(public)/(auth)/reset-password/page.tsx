'use client';

import { useState } from 'react';
import EmailStep from './_components/EmailStep';
import VerifyStep from './_components/VerifyStep';
import NewPasswordStep from './_components/NewPasswordStep';
import DoneModal from './_components/DoneModal';

type Step = 'EMAIL' | 'VERIFY' | 'NEW_PASSWORD';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const [step, setStep] = useState<Step>('EMAIL');
  const [isDoneOpen, setIsDoneOpen] = useState(false);

  return (
    <>
      {step === 'EMAIL' && (
        <EmailStep email={email} onEmailChange={setEmail} onNext={() => setStep('VERIFY')} />
      )}

      {step === 'VERIFY' && (
        <VerifyStep
          initialEmail={email}
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
