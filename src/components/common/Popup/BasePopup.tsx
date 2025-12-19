'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type BasePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnDimClick?: boolean;
};

export default function BasePopup({
  isOpen,
  onClose,
  children,
  closeOnDimClick = true,
}: BasePopupProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* dim */}
      <button
        type="button"
        aria-label="팝업 닫기"
        className="bg-bw-900/40 absolute inset-0"
        onClick={closeOnDimClick ? onClose : undefined}
      />

      {/* content */}
      <div className="relative w-full max-w-[640px]">{children}</div>
    </div>,
    document.body,
  );
}
