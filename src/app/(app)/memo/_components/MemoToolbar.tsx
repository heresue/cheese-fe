'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import ChevronIcon from '@/assets/icons/common/chevron.svg';
import CreateIcon from '@/assets/icons/common/create.svg';
import MemoCheckIcon from '@/assets/icons/memo/check.svg';
import MemoDeleteIcon from '@/assets/icons/memo/delete.svg';
import MemoPinIcon from '@/assets/icons/memo/pin.svg';

type MemoFilter = 'all' | 'pinned' | 'deleted';
type MemoSortOrder = 'latest' | 'oldest';

type MemoToolbarProps = {
  filter: MemoFilter;
  sortOrder: MemoSortOrder;
  searchValue: string;
  selectedCount: number;
  onChangeFilter: (filter: MemoFilter) => void;
  onChangeSortOrder: (sortOrder: MemoSortOrder) => void;
  onChangeSearchValue: (value: string) => void;
  onToggleSelectMode: () => void;
  onDeleteSelected: () => void;
  onCreate: () => void;
};

const SORT_OPTIONS: Array<{ label: string; value: MemoSortOrder }> = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
];

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function SortIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 5h8M4 10h6M4 15h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 4v10M15 14l-2.5-2.5M15 14l2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="m14.2 14.2 3 3M8.8 15.2a6.4 6.4 0 1 1 0-12.8 6.4 6.4 0 0 1 0 12.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToolbarIconButton({
  active,
  disabled,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-[44px] w-[48px] items-center justify-center rounded-[10px] border transition-colors',
        active
          ? 'border-secondary-700 text-secondary-700'
          : 'hover:border-secondary-700 hover:text-secondary-700 border-gray-300 text-gray-500',
        disabled && 'cursor-not-allowed opacity-40 hover:border-gray-300 hover:text-gray-500',
      )}
    >
      <span className="flex h-[20px] w-[20px] translate-x-px items-center justify-center [&>svg]:block [&>svg]:shrink-0">
        {children}
      </span>
    </button>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: MemoSortOrder;
  onChange: (value: MemoSortOrder) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = SORT_OPTIONS.find((option) => option.value === value)?.label ?? '최신순';

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;

      setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`메모 정렬: ${selectedLabel}`}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-[44px] w-[68px] items-center justify-center gap-[8px] rounded-[10px] border transition-colors',
          open
            ? 'border-secondary-700 text-secondary-700'
            : 'hover:border-secondary-700 hover:text-secondary-700 border-gray-300 text-gray-500',
        )}
      >
        <SortIcon className="h-[20px] w-[20px]" />
        <ChevronIcon
          className={cn(
            'h-[12px] w-[12px] transition-transform',
            open ? '-rotate-90' : 'rotate-90',
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-[52px] left-0 z-30 w-[98px] overflow-hidden rounded-[10px] border border-gray-300 bg-white py-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {SORT_OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex h-[32px] w-full items-center px-[12px] text-left text-[13px] font-medium transition-colors',
                  selected ? 'text-secondary-700' : 'text-gray-700',
                  'hover:bg-gray-100',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function MemoToolbar({
  filter,
  sortOrder,
  searchValue,
  selectedCount,
  onChangeFilter,
  onChangeSortOrder,
  onChangeSearchValue,
  onToggleSelectMode,
  onDeleteSelected,
  onCreate,
}: MemoToolbarProps) {
  const isPinnedActive = filter === 'pinned';
  const isDeletedActive = filter === 'deleted';

  return (
    <div className="mb-[42px] flex items-center justify-center gap-[12px]">
      <SortDropdown value={sortOrder} onChange={onChangeSortOrder} />

      <ToolbarIconButton
        label="고정 메모 보기"
        active={isPinnedActive}
        onClick={() => onChangeFilter(isPinnedActive ? 'all' : 'pinned')}
      >
        <MemoPinIcon className="h-[18px] w-[18px]" aria-hidden="true" />
      </ToolbarIconButton>

      <ToolbarIconButton label="선택 모드" onClick={onToggleSelectMode}>
        <MemoCheckIcon className="h-[18px] w-[18px]" aria-hidden="true" />
      </ToolbarIconButton>

      <ToolbarIconButton
        label={selectedCount > 0 ? '선택한 메모 삭제' : '삭제된 메모 보기'}
        active={isDeletedActive}
        onClick={() => {
          if (selectedCount > 0) {
            onDeleteSelected();
            return;
          }

          onChangeFilter(isDeletedActive ? 'all' : 'deleted');
        }}
      >
        <MemoDeleteIcon className="h-[18px] w-[18px]" aria-hidden="true" />
      </ToolbarIconButton>

      <label className="flex h-[44px] w-[500px] items-center gap-[10px] rounded-[8px] border border-gray-300 px-[14px] text-gray-500">
        <SearchIcon className="h-[18px] w-[18px] shrink-0" />

        <input
          value={searchValue}
          onChange={(event) => onChangeSearchValue(event.target.value)}
          placeholder="메모 검색"
          className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-gray-500"
        />

        <ChevronIcon className="h-[12px] w-[12px] rotate-90" aria-hidden="true" />
      </label>

      <button
        type="button"
        onClick={onCreate}
        className="bg-secondary-700 flex h-[44px] w-[78px] items-center justify-center gap-[8px] rounded-[10px] text-[14px] font-medium text-white"
      >
        <CreateIcon className="h-[16px] w-[16px]" aria-hidden="true" />
        생성
      </button>
    </div>
  );
}
