import { Input, InputActionButton } from '@/components/common/Input';

export default function InputTestPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-8 text-xl font-bold">Input Component Test</h1>

        <div className="flex flex-col gap-10">
          {/* 1) 기본 (일반 텍스트) */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">1) text input</p>
            <Input label="이메일" type="email" placeholder="이메일을 입력해주세요" />
          </section>

          {/* 2) 기본 (비밀번호) */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">2) password input</p>
            <Input label="비밀번호" type="password" placeholder="비밀번호를 입력해주세요" />
          </section>

          {/* 3) error */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">3) error</p>
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              error="경고문구"
            />
          </section>

          {/* 4) rightAddon: 인증하기 버튼 */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">4) input with button</p>
            <Input
              label="휴대폰 번호"
              type="tel"
              placeholder="휴대폰 번호를 입력해주세요"
              rightAddon={<InputActionButton>인증하기</InputActionButton>}
            />
          </section>

          {/* 5) rightAddon + error */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">5) input with button (error)</p>
            <Input
              label="휴대폰 번호"
              type="tel"
              placeholder="휴대폰 번호를 입력해주세요"
              error="경고문구"
              rightAddon={<InputActionButton>인증하기</InputActionButton>}
            />
          </section>

          {/* 6) disabled */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">6) disabled</p>
            <Input label="이메일" type="email" placeholder="이메일을 입력해주세요" disabled />
          </section>

          {/* 7) input with button disabled */}
          <section className="flex flex-col gap-3">
            <p className="text-bw-500 text-sm font-medium">7) input with button disabled</p>
            <Input
              label="휴대폰 번호"
              type="tel"
              placeholder="휴대폰 번호를 입력해주세요"
              rightAddon={<InputActionButton disabled>인증하기</InputActionButton>}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
