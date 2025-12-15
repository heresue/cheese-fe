'use client';

import { useState } from 'react';
import { Popup } from '@/components/common/Popup';
import { Checkbox } from '@/components/common/Checkbox';

export default function SignupPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        팝업 열기
      </button>

      <Popup
        isOpen={open}
        onClose={() => setOpen(false)}
        title="알리는 제목"
        description="알리는 문구"
        primaryText="로그인"
      >
        <div className="flex flex-col gap-3">
          <Checkbox label="체크" />
          <Checkbox label="체크 안 함" />
        </div>
      </Popup>
    </>
  );
}
