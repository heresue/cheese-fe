'use client';

import clsx from 'clsx';
import { Button } from '@/components/common/Button';
import { Panel } from '@/components/common/Panel';
import BasePopup from './BasePopup';

type ConfirmPopupProps = {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  description?: string;

  primaryText: string;
  onPrimaryClick?: () => void;

  children?: React.ReactNode;
};

export default function ConfirmPopup({
  isOpen,
  onClose,
  title,
  description,
  primaryText,
  onPrimaryClick,
  children,
}: ConfirmPopupProps) {
  return (
    <BasePopup isOpen={isOpen} onClose={onClose}>
      <Panel
        role="dialog"
        aria-modal="true"
        className={clsx(
          'w-[min(385px,calc(100vw-32px))]',
          'max-h-[calc(100dvh-160px)] md:max-h-[calc(100dvh-316px)]',
          'flex flex-col overflow-hidden',
          'px-[42.5px] py-[40px]',
        )}
      >
        <div className="flex flex-col items-center text-center">
          {title ? <h2 className="text-g1 text-[20px] font-bold">{title}</h2> : null}
          {description ? (
            <p className={clsx('text-g1 text-[20px] font-normal', title && 'mt-3')}>
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-[29px] w-full">{children}</div> : null}

          <div className="mt-6 w-full">
            <Button onClick={onPrimaryClick ?? onClose} className="font-bold">
              {primaryText}
            </Button>
          </div>
        </div>
      </Panel>
    </BasePopup>
  );
}
