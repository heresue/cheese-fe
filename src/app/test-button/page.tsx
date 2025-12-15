import { Button } from '@/components/common/Button';

export default function test() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-6 text-xl font-bold">Button Test</h1>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold">contained button</h4>
          {/* contained 기본 (width 100%, height 52) */}
          <p>1) 기본 (width 100%, height 52)</p>
          <Button>로그인</Button>

          {/* contained 고정 폭 */}
          <p>2) width값 지정</p>
          <Button width={240}>로그인</Button>

          {/* contained 높이 변경 */}
          <p>3) height값 지정</p>
          <Button height={80}>로그인</Button>

          <h4 className="font-bold">circle button</h4>
          <p>1) 기본 (48x48)</p>
          {/* circle 기본 (48x48)*/}
          <Button variant="circle" aria-label="Google로 로그인">
            G
          </Button>

          <p>2) 사이즈 지정 (80x80)</p>
          {/* circle 사이즈 변경 */}
          <Button variant="circle" size={80} aria-label="Circle 80">
            G
          </Button>

          {/* disabled 테스트 */}
          <Button disabled>비활성화</Button>

          {/* loading 테스트 */}
          <Button isLoading>로딩중</Button>
        </div>
      </div>
    </main>
  );
}
