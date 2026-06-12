'use client';

import CreateIcon from '@/assets/icons/common/create.svg';
import DeleteIcon from '@/assets/icons/common/delete.svg';
import CheckIcon from '@/assets/icons/common/check.svg';
import ChevronIcon from '@/assets/icons/common/chevron.svg';

type MemoFilter = 'all' | 'pinned' | 'deleted';

type MemoToolbarProps = {
  filter: MemoFilter;
  searchValue: string;
  selectedCount: number;
  onChangeFilter: (filter: MemoFilter) => void;
  onChangeSearchValue: (value: string) => void;
  onToggleSelectMode: () => void;
  onDeleteSelected: () => void;
  onCreate: () => void;
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
  children: React.ReactNode;
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
      {children}
    </button>
  );
}

export function MemoToolbar({
  filter,
  searchValue,
  selectedCount,
  onChangeFilter,
  onChangeSearchValue,
  onToggleSelectMode,
  onDeleteSelected,
  onCreate,
}: MemoToolbarProps) {
  const isPinnedActive = filter === 'pinned';
  const isDeletedActive = filter === 'deleted';

  return (
    <div className="mb-[42px] flex items-center justify-center gap-[12px]">
      <button
        type="button"
        aria-label="정렬"
        className="hover:border-secondary-700 hover:text-secondary-700 flex h-[44px] w-[68px] items-center justify-center gap-[8px] rounded-[10px] border border-gray-300 text-gray-500 transition-colors"
      >
        <SortIcon className="h-[20px] w-[20px]" />
        <ChevronIcon className="h-[12px] w-[12px] rotate-90" aria-hidden="true" />
      </button>

      <ToolbarIconButton
        label="고정 메모 보기"
        active={isPinnedActive}
        onClick={() => onChangeFilter(isPinnedActive ? 'all' : 'pinned')}
      >
        <PinIcon className="h-[18px] w-[18px]" />
      </ToolbarIconButton>

      <ToolbarIconButton label="선택 모드" onClick={onToggleSelectMode}>
        <CheckIcon className="h-[18px] w-[18px]" aria-hidden="true" />
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
        <DeleteIcon className="h-[18px] w-[18px]" aria-hidden="true" />
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
