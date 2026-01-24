'use client';

import clsx from 'clsx';
import { Panel } from '@/components/common/Panel';
import BasePopup from './BasePopup';
import CloseIcon from '@/assets/icons/close.svg';

type DocumentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function DocumentPopup({
  isOpen,
  onClose,
  title,
  children,
  className,
}: DocumentPopupProps) {
  return (
    <BasePopup isOpen={isOpen} onClose={onClose}>
      <Panel
        role="dialog"
        aria-modal="true"
        rounded={false}
        className={clsx(
          'w-[min(640px,calc(100vw-32px))] sm:w-[min(630px,calc(100vw-48px))]',
          'max-h-[calc(100dvh-160px)] md:max-h-[calc(100dvh-316px)]',
          'flex flex-col overflow-hidden',
          'px-10 py-[30px]',
          className,
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 pb-10">
          <div className="h-6 w-6 shrink-0" aria-hidden="true" />
          <h2 className="flex-1 text-center text-[24px] font-bold">{title}</h2>

          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </Panel>
    </BasePopup>
  );
}
