import { useEffect } from 'react';

type UsePopupBehaviorProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 팝업 열림 상태에서
 * - ESC 키 닫기
 * - body 스크롤 차단
 */
export function usePopupBehavior({ isOpen, onClose }: UsePopupBehaviorProps) {
  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // body 스크롤 차단
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);
}
