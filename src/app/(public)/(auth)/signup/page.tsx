import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input, InputActionButton } from '@/components/common/Input';
import Chevron from '@/assets/icons/chevron.svg';

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-[20px] font-bold">회원가입</h2>

      <form className="flex flex-col gap-10">
        <div className="flex flex-col gap-10">
          <Input
            label="닉네임"
            placeholder="닉네임 입력"
            type="text"
            name="nickname"
            rightAddon={<InputActionButton>중복확인</InputActionButton>}
            errorMessage={'중복된 닉네임이 있습니다'}
            successMessage={'사용 가능한 닉네임 입니다'}
          />
          <Input
            label="아이디"
            placeholder="아이디 (이메일) 입력"
            type="email"
            name="email"
            rightAddon={<InputActionButton>입력하기</InputActionButton>}
          />
          <Input
            label="비밀번호"
            placeholder="비밀번호 입력"
            type="password"
            name="password"
            errorMessage={'영문, 숫자, 특수문자를 포함하여 8자 이상이어야합니다'}
          />
          <Input
            label="비밀번호 확인"
            placeholder="비밀번호 재입력"
            type="password"
            name="passwordConfirm"
            errorMessage="비밀번호가 일치하지 않습니다"
            successMessage={'비밀번호가 일치합니다.'}
          />

          <div className="flex items-center justify-between">
            <Checkbox label="치즈 이용약관 동의" name="terms" required />

            <button
              type="button"
              aria-label="이용약관 자세히 보기"
              className="flex h-5 w-5 items-center justify-center"
            >
              <Chevron width={6} height={10} />
            </button>
          </div>
        </div>

        <Button type="submit">회원가입</Button>
      </form>
    </div>
  );
}
