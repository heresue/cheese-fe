'use client';

import { useState } from 'react';
import { Input, InputActionButton } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

import TermsModal from './_components/TermsModal';
import EmailVerifyModal from '../_components/EmailVerifyModal';

import CheckIcon from '@/assets/icons/common/check.svg';
import ChevronIcon from '@/assets/icons/common/chevron.svg';

export default function SignupPage() {
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openVerify = () => setIsVerifyOpen(true);
  const closeVerify = () => setIsVerifyOpen(false);

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO:
    // - 입력값 검증
    // - 이메일 인증 여부 확인
    // - 회원가입 API 호출

    if (!verifiedEmail) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const signupData = {
      nickname: String(formData.get('nickname') ?? ''),
      email: verifiedEmail,
      password: String(formData.get('password') ?? ''),
      passwordConfirmation: String(formData.get('passwordConfirmation') ?? ''),
      termsAgreed: formData.get('termsAgreed') === 'on',
    };
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
            placeholder="닉네임 입력"
            // errorMessage={'중복된 닉네임이 있습니다'}
            // successMessage={'사용가능한 닉네임 입니다'}
            rightAddon={<InputActionButton>중복확인</InputActionButton>}
            className="h-10 px-2 tracking-normal"
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
            successMessage={verifiedEmail ? '사용가능' : undefined}
            rightAddon={
              <InputActionButton onClick={openVerify}>
                {verifiedEmail ? '변경하기' : '입력하기'}
              </InputActionButton>
            }
            className="h-10 px-2 tracking-normal"
            showMessageSpace
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호 입력"
            // errorMessage={'영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다'}
            className="h-10 px-2 tracking-normal"
            showMessageSpace
          />
          <Input
            label="비밀번호 확인"
            name="passwordConfirmation"
            type="password"
            placeholder="비밀번호 재입력"
            // errorMessage="비밀번호가 일치하지 않습니다"
            // successMessage={'비밀번호가 일치합니다.'}
            className="h-10 px-2 tracking-normal"
            showMessageSpace
          />

          <div className="flex w-full items-center justify-between">
            <label className="flex flex-1 cursor-pointer items-center gap-1 select-none">
              <input required type="checkbox" name="termsAgreed" className="peer sr-only" />

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

        <Button variant="light" type="submit">
          회원가입
        </Button>
      </form>

      <EmailVerifyModal
        title="아이디 (이메일) 입력"
        isOpen={isVerifyOpen}
        onClose={closeVerify}
        onNext={setVerifiedEmail}
      />
      <TermsModal isOpen={isTermsOpen} onClose={closeTerms} />
    </div>
  );
}
