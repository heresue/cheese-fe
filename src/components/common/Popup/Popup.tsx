'use client';

import clsx from 'clsx';
import BasePopup from './BasePopup';
import { Button } from '@/components/common/Button';

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  description?: string;

  primaryText: string;
  onPrimaryClick?: () => void;

  children?: React.ReactNode;
};

export default function Popup({
  isOpen,
  onClose,
  title,
  description,
  primaryText,
  onPrimaryClick,
  children,
}: PopupProps) {
  return (
    <BasePopup isOpen={isOpen} onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'w-full max-w-[640px] rounded-[16px]',
          'bg-bg-surface',
          'px-[20px] py-[40px]',
          'shadow-[0_0_4px_rgba(0,0,0,0.25)]',
        )}
      >
        <div className="flex flex-col items-center text-center">
          {title ? <h2 className="text-bw-900 text-[20px] font-semibold">{title}</h2> : null}
          {description ? (
            <p className={clsx('text-bw-900 text-[20px] font-normal', title && 'mt-[10px]')}>
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-[29px] w-full">{children}</div> : null}

          <div className="mt-[29px] w-full">
            <Button onClick={onPrimaryClick ?? onClose} className="text-[20px] font-bold">
              {primaryText}
            </Button>
          </div>
        </div>
      </div>
    </BasePopup>
  );
}
