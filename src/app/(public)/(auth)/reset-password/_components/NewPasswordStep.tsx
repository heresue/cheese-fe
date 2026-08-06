import { useState } from 'react';

import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

import { validatePassword, validatePasswordConfirmation } from '@/lib/validation';

type NewPasswordStepProps = {
  onComplete: () => void;
};

export default function NewPasswordStep({ onComplete }: NewPasswordStepProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [passwordError, setPasswordError] = useState<string>();
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<string>();

  const passwordValidationError = validatePassword(password);
  const confirmationValidationError = validatePasswordConfirmation(password, passwordConfirmation);

  const isPasswordMatched =
    !passwordValidationError && !confirmationValidationError && passwordConfirmation.length > 0;

  const handleSetPasswordComplete = () => {
    setPasswordError(undefined);
    setPasswordConfirmationError(undefined);

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (confirmationValidationError) {
      setPasswordConfirmationError(confirmationValidationError);
      return;
    }

    // TODO: 비밀번호 변경 API
    onComplete();
  };

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-[20px] font-bold">비밀번호 변경</h2>

      <div className="flex flex-col gap-5">
        <Input
          label="새로운 비밀번호"
          name="newPassword"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError(undefined);
            setPasswordConfirmationError(undefined);
          }}
          placeholder="새로운 비밀번호 (영문,숫자,특수문자 포함 8자)"
          errorMessage={passwordError}
          className="h-10 px-2 font-medium tracking-normal"
        />
        <Input
          label="새로운 비밀번호 확인"
          name="newPasswordConfirm"
          type="password"
          value={passwordConfirmation}
          onChange={(event) => {
            setPasswordConfirmation(event.target.value);
            setPasswordConfirmationError(undefined);
          }}
          placeholder="비밀번호 재입력"
          errorMessage={passwordConfirmationError}
          successMessage={isPasswordMatched ? '비밀번호가 일치합니다.' : undefined}
          className="h-10 px-2 font-medium tracking-normal"
        />
      </div>

      <Button
        variant="light"
        type="button"
        onClick={handleSetPasswordComplete}
        className="text-[16px]"
      >
        비밀번호 변경
      </Button>
    </div>
  );
}
