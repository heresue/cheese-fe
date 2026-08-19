import Link from 'next/link';

import { Button } from '@/components/common/Button';

export default function NotFound() {
  return (
    // TODO: 디자인 수정 (임시 디자인 적용)

    <div className="bg-bg-1 flex min-h-dvh flex-col items-center justify-center gap-5 text-center">
      <div>
        <div className="text-9xl font-bold tracking-[-0.04em] text-gray-600">404</div>
        <p className="text-2xl font-semibold tracking-[-0.02em] text-gray-600">PAGE NOT FOUND</p>
      </div>

      <p className="mt-3 text-xl font-medium tracking-[-0.02em] text-gray-800">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>

      <Button asChild width={160}>
        <Link href="/dashboard">홈으로 이동</Link>
      </Button>
    </div>
  );
}
