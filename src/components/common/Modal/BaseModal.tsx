'use client';

import { createPortal } from 'react-dom';

import { useModalBehavior } from '@/hooks/useModalBehavior';
import { cn } from '@/lib/cn';

type ModalInteraction = 'default' | 'interactive';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  hasOverlay?: boolean;
  closeOnEscape?: boolean;
  interaction?: ModalInteraction;

  contentClassName?: string;
};

export default function BaseModal({
  isOpen,
  onClose,
  children,

  hasOverlay = false,
  closeOnEscape = true,
  interaction = 'default',

  contentClassName,
}: BaseModalProps) {
  const isInteractive = interaction === 'interactive';

  const closeOnDimClick = !isInteractive;
  const lockBodyScroll = !isInteractive;

  useModalBehavior({ isOpen, onClose, closeOnEscape, lockBodyScroll });

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 overflow-hidden',
        isInteractive && 'pointer-events-none',
        hasOverlay ? 'bg-overlay-dim' : '',
      )}
      onClick={closeOnDimClick ? onClose : undefined}
      role="presentation"
    >
      <div className="flex h-full w-full items-center justify-center p-5">
        <div
          className={cn(
            'pointer-events-auto max-h-full max-w-full',
            isInteractive && 'pointer-events-auto',
            contentClassName,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
