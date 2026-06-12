'use client';

import Image from 'next/image';

import CheckIcon from '@/assets/icons/common/check.svg';
import DeleteIcon from '@/assets/icons/common/delete.svg';
import EditIcon from '@/assets/icons/common/edit.svg';

import type { Memo } from '../_types/memo';

type MemoCardProps = {
  memo: Memo;
  onToggleSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEdit: (memo: Memo) => void;
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12.78 2.6 17.4 7.22l-2.16 2.16-1.62-.54-2.92 2.92.54 3.78-.82.82-3.18-3.18-3.64 3.64-.82-.82 3.64-3.64-3.18-3.18.82-.82 3.78.54 2.92-2.92-.54-1.62L12.78 2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RestoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6.2 6.1A5.7 5.7 0 1 1 5 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.3 2.8v3.4H2.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const memoColorClassName = {
  pink: 'bg-[#F7CDD3]',
  gray: 'bg-gray-200',
  orange: 'bg-secondary-200',
  green: 'bg-[#B9D77A]',
  blue: 'bg-[#B9D8FF]',
  purple: 'bg-[#D5B8F2]',
};

function MemoCheckButton({ selected, onClick }: { selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="메모 선택"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        'absolute top-[16px] right-[14px] z-10 flex h-[24px] w-[24px] items-center justify-center rounded-[6px] border bg-white transition-colors',
        selected ? 'border-secondary-700 text-secondary-700' : 'border-gray-300 text-gray-300',
      )}
    >
      <CheckIcon className="h-[14px] w-[14px]" aria-hidden="true" />
    </button>
  );
}

function MemoActionButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="hover:text-secondary-700 flex h-[22px] w-[22px] items-center justify-center text-gray-500 transition-colors"
    >
      {children}
    </button>
  );
}

export function MemoCard({
  memo,
  onToggleSelect,
  onTogglePin,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEdit,
}: MemoCardProps) {
  const hasImage = Boolean(memo.imageSrc);
  const isSelected = Boolean(memo.selected);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!memo.deleted) onEdit(memo);
      }}
      className={cn(
        'relative h-[270px] w-[250px] overflow-hidden rounded-[8px] border bg-white transition-colors',
        isSelected && !memo.deleted ? 'border-secondary-700 border-2' : 'border-gray-300',
      )}
    >
      <MemoCheckButton selected={isSelected} onClick={() => onToggleSelect(memo.id)} />

      {hasImage ? (
        <div className="relative h-[176px] w-full overflow-hidden border-b border-gray-200">
          <Image src={memo.imageSrc as string} alt="" fill sizes="250px" className="object-cover" />
        </div>
      ) : (
        <div className="h-[176px] px-[16px] pt-[16px]">
          <h3
            className={cn(
              'mb-[10px] h-[24px] rounded-[5px] px-[8px] text-[14px] leading-[24px] font-bold text-gray-950',
              memo.color ? memoColorClassName[memo.color] : '',
            )}
          >
            {memo.title}
          </h3>

          <p className="[display:-webkit-box] overflow-hidden text-[12px] leading-[18px] font-medium text-gray-600 [-webkit-box-orient:vertical] [-webkit-line-clamp:9]">
            {memo.content}
          </p>
        </div>
      )}

      <div className={cn('px-[16px]', hasImage ? 'pt-[12px]' : 'pt-0')}>
        {hasImage ? (
          <h3
            className={cn(
              'mb-[12px] h-[24px] rounded-[5px] px-[8px] text-[14px] leading-[24px] font-bold text-gray-950',
              memo.color ? memoColorClassName[memo.color] : '',
            )}
          >
            {memo.title}
          </h3>
        ) : null}

        <div className="absolute right-[16px] bottom-[14px] left-[16px] flex items-center justify-between">
          <span className="text-[12px] leading-[18px] font-medium text-gray-500">
            {memo.createdAt}
            {memo.deleted ? ' 삭제됨' : ''}
          </span>

          <div className="flex items-center gap-[8px]">
            {memo.deleted ? (
              <>
                <MemoActionButton label="복구" onClick={() => onRestore(memo.id)}>
                  <RestoreIcon className="h-[16px] w-[16px]" />
                </MemoActionButton>

                <MemoActionButton label="영구 삭제" onClick={() => onPermanentDelete(memo.id)}>
                  <DeleteIcon className="h-[16px] w-[16px]" aria-hidden="true" />
                </MemoActionButton>
              </>
            ) : (
              <>
                <MemoActionButton label="고정" onClick={() => onTogglePin(memo.id)}>
                  <PinIcon
                    className={cn(
                      'h-[16px] w-[16px]',
                      memo.pinned ? 'text-gray-950' : 'text-gray-500',
                    )}
                  />
                </MemoActionButton>

                <MemoActionButton label="수정" onClick={() => onEdit(memo)}>
                  <EditIcon className="h-[16px] w-[16px]" aria-hidden="true" />
                </MemoActionButton>

                <MemoActionButton label="삭제" onClick={() => onDelete(memo.id)}>
                  <DeleteIcon className="h-[16px] w-[16px]" aria-hidden="true" />
                </MemoActionButton>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
