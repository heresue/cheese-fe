'use client';

import { createPortal } from 'react-dom';

import { useModalBehavior } from '@/hooks/useModalBehavior';
import { cn } from '@/lib/cn';

type ModalScope = 'viewport' | 'content';

type ModalInteraction = 'default' | 'interactive';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  hasOverlay?: boolean;
  closeOnEscape?: boolean;
  interaction?: ModalInteraction;

  scope?: ModalScope;
  contentClassName?: string;
};

export default function BaseModal({
  isOpen,
  onClose,
  children,

  hasOverlay,
  closeOnEscape = true,
  interaction = 'default',

  scope = 'viewport',
  contentClassName,
}: BaseModalProps) {
  const isInteractive = interaction === 'interactive';
  const closeOnOutsideClick = !isInteractive;
  const lockBodyScroll = !isInteractive;

  useModalBehavior({ isOpen, onClose, closeOnEscape, lockBodyScroll });

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  const portalTarget = scope === 'content' ? document.getElementById('app-main') : document.body;

  if (!portalTarget) return null;

  return createPortal(
    <div
      className={cn(
        'z-50 overflow-hidden',
        scope === 'viewport' ? 'fixed inset-0' : 'absolute inset-0',
        isInteractive && 'pointer-events-none',
        hasOverlay && 'bg-overlay-dim',
      )}
      onClick={closeOnOutsideClick ? onClose : undefined}
      role="presentation"
    >
      <div className="flex h-full w-full items-center justify-center p-5">
        <div
          className={cn(
            'max-h-full max-w-full',
            isInteractive && 'pointer-events-auto',
            contentClassName,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
