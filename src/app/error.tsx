'use client';

import { Button } from '@/components/common/Button';

type ErrorProps = {
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    // TODO: 디자인 수정 (임시 디자인 적용)

    <div className="bg-bg-1 flex min-h-dvh flex-col items-center justify-center gap-5 text-center">
      <p className="text-5xl font-semibold tracking-[-0.02em] text-gray-600">SERVER ERROR</p>

      <p className="mt-3 text-xl font-medium tracking-[-0.02em] text-gray-800">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>

      <Button type="button" width={160} onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}
