'use client';

import { createPortal } from 'react-dom';
import { usePopupBehavior } from '@/hooks/usePopupBehavior';

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
  usePopupBehavior({ isOpen, onClose });

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  const handleOverlayClick = () => {
    if (!closeOnDimClick) return;
    onClose();
  };

  return createPortal(
    <div
      className="bg-bw-900/40 fixed inset-0 z-50 flex items-center justify-center p-5"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
