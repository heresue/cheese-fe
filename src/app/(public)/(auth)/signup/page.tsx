'use client';

import { useState } from 'react';
import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

import TermsModal from './_components/TermsModal';
import EmailVerifyModal from '../_components/EmailVerifyModal';

import { validateNickname, validatePassword, validatePasswordConfirmation } from '@/lib/validation';

import CheckIcon from '@/assets/icons/common/check.svg';
import ChevronIcon from '@/assets/icons/common/chevron.svg';

type NicknameStatus = 'idle' | 'checking' | 'available' | 'duplicated';

type SignupErrors = {
  nickname?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openVerify = () => setIsVerifyOpen(true);
  const closeVerify = () => setIsVerifyOpen(false);

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    setNicknameStatus('idle');

    setSignupErrors((prev) => ({
      ...prev,
      nickname: undefined,
    }));
  };

  const handleEmailVerified = (email: string) => {
    setVerifiedEmail(email);

    setSignupErrors((prev) => ({
      ...prev,
      email: undefined,
    }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    setSignupErrors((prev) => ({
      ...prev,
      password: undefined,
      passwordConfirmation: undefined,
    }));
  };

  const handlePasswordConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value);

    setSignupErrors((prev) => ({
      ...prev,
      passwordConfirmation: undefined,
    }));
  };

  const handleCheckNickname = async () => {
    const nicknameError = validateNickname(nickname);

    if (nicknameError) {
      setSignupErrors((prev) => ({
        ...prev,
        nickname: nicknameError,
      }));
      return;
    }

    setNicknameStatus('checking');

    try {
      // TODO: 닉네임 중복 확인 API 호출
      const isDuplicated = false; // 임시 확인코드

      setNicknameStatus(isDuplicated ? 'duplicated' : 'available');

      setSignupErrors((prev) => ({
        ...prev,
        nickname: isDuplicated ? '중복된 닉네임이 있습니다' : undefined,
      }));
    } catch {
      setNicknameStatus('idle');

      setSignupErrors((prev) => ({
        ...prev,
        nickname: '닉네임 중복 확인에 실패했습니다',
      }));
    }
  };

  const getNicknameError = () => {
    const validationError = validateNickname(nickname);

    if (validationError) {
      return validationError;
    }

    if (nicknameStatus === 'duplicated') {
      return '중복된 닉네임이 있습니다';
    }

    if (nicknameStatus !== 'available') {
      return '닉네임 중복확인을 완료해 주세요';
    }

    return undefined;
  };

  const isPasswordMatched =
    Boolean(passwordConfirmation) &&
    !validatePassword(password) &&
    !validatePasswordConfirmation(password, passwordConfirmation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: SignupErrors = {
      nickname: getNicknameError(),
      email: verifiedEmail ? undefined : '이메일 인증을 완료해 주세요',
      password: validatePassword(password),
      passwordConfirmation: validatePasswordConfirmation(password, passwordConfirmation),
    };

    setSignupErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);

    if (hasError) {
      return;
    }

    const signupData = {
      nickname: nickname.trim(),
      email: verifiedEmail,
      password,
      passwordConfirmation,
      termsAgreed,
    };

    // TODO: 회원가입 API 호출
  };

  return (
    <div className="flex flex-col gap-10">
      <h2 className="h-6 text-[20px] font-bold tracking-normal">회원가입</h2>

      <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <Input
            label="닉네임"
            name="nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임 입력"
            errorMessage={signupErrors.nickname}
            successMessage={
              nicknameStatus === 'available' ? '사용 가능한 닉네임 입니다' : undefined
            }
            rightAddon={
              <InputActionButton
                onClick={handleCheckNickname}
                disabled={!nickname.trim() || nicknameStatus === 'checking'}
              >
                중복확인
              </InputActionButton>
            }
            className="h-10 px-2 font-medium tracking-normal"
            showMessageSpace
          />
          <Input
            readOnly
            label="아이디"
            name="email"
            type="email"
            value={verifiedEmail}
            onClick={openVerify}
            placeholder="아이디 (이메일) 입력"
            errorMessage={signupErrors.email}
            successMessage={verifiedEmail ? '사용 가능' : undefined}
            rightAddon={
              <InputActionButton onClick={openVerify}>
                {verifiedEmail ? '변경하기' : '입력하기'}
              </InputActionButton>
            }
            className="h-10 px-2 font-medium tracking-normal"
            showMessageSpace
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호 입력"
            errorMessage={signupErrors.password}
            className="h-10 px-2 font-medium tracking-normal"
            showMessageSpace
          />
          <Input
            label="비밀번호 확인"
            name="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            placeholder="비밀번호 재입력"
            errorMessage={signupErrors.passwordConfirmation}
            successMessage={isPasswordMatched ? '비밀번호가 일치합니다' : undefined}
            className="h-10 px-2 font-medium tracking-normal"
            showMessageSpace
          />

          <div className="flex w-full items-center justify-between">
            <label className="flex flex-1 cursor-pointer items-center gap-1 select-none">
              <input
                required
                type="checkbox"
                name="termsAgreed"
                checked={termsAgreed}
                onChange={(event) => setTermsAgreed(event.target.checked)}
                className="peer sr-only"
              />

              <span className="border-primary-700 peer-checked:bg-secondary-400 relative inline-flex h-5 w-5 items-center justify-center rounded-xs border peer-checked:border-0 peer-focus-visible:outline-2 peer-checked:[&>svg]:opacity-100">
                <CheckIcon className="h-3 w-3 text-gray-50 opacity-0 transition-opacity" />
              </span>

              <span className="text-sm">치즈 이용약관 동의</span>
            </label>

            <button
              type="button"
              onClick={openTerms}
              aria-label="치즈 이용약관 보기"
              className="flex h-5 w-5 items-center justify-center"
            >
              <ChevronIcon className="h-3" />
            </button>
          </div>
        </div>

        <Button variant="light" type="submit" disabled={!termsAgreed} className="text-[16px]">
          회원가입
        </Button>
      </form>

      <EmailVerifyModal
        title="아이디 (이메일) 입력"
        isOpen={isVerifyOpen}
        onClose={closeVerify}
        onNext={handleEmailVerified}
      />
      <TermsModal isOpen={isTermsOpen} onClose={closeTerms} />
    </div>
  );
}
