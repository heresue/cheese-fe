'use client';

import { createPortal } from 'react-dom';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import { cn } from '@/lib/cn';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnDimClick?: boolean;
  hasOverlay?: boolean;
};

export default function BaseModal({
  isOpen,
  onClose,
  children,
  closeOnDimClick = true,
  hasOverlay = false,
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
      className={cn('fixed inset-0 z-50 overflow-hidden', hasOverlay ? 'bg-overlay-dim' : '')}
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
