'use client';

import { createPortal } from 'react-dom';
import { useModalBehavior } from '@/hooks/useModalBehavior';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnDimClick?: boolean;
};

export default function BaseModal({
  isOpen,
  onClose,
  children,
  closeOnDimClick = true,
}: BaseModalProps) {
  useModalBehavior({ isOpen, onClose });

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  const handleOverlayClick = () => {
    if (!closeOnDimClick) return;
    onClose();
  };

  return createPortal(
    <div
      className="bg-overlay-dim fixed inset-0 z-50 overflow-hidden"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="flex h-full w-full items-center justify-center p-5">
        <div className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
