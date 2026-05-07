'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

import ChevronIcon from '@/assets/icons/chevron.svg';
import CloseIcon from '@/assets/icons/close.svg';
import CreateIcon from '@/assets/icons/create.svg';
import { Button } from '@/components/common/Button';

import { listFilterBarClassNames as styles } from './style';
import type { ListFilterBarProps } from './type';

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h7M3 8h5M3 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M12 5v6M10 9l2 2 2-2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7.2 12.4a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4ZM11 11l3 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ListFilterBar<TSortValue extends string = string>({
  sortOptions = [],
  selectedSort,
  onSortChange,
  searchValue = '',
  searchPlaceholder = '검색',
  searchHistories = [],
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onSearchHistorySelect,
  actionButton,
  className,
}: ListFilterBarProps<TSortValue>) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);

  const sortRootRef = useRef<HTMLDivElement>(null);
  const searchRootRef = useRef<HTMLDivElement>(null);

  const searchHistoryListId = useId();

  const hasSortOptions = sortOptions.length > 0;

  const searchHistoryItems = searchHistories.filter((history) => history.trim().length > 0);

  const hasSearchHistories = searchHistoryItems.length > 0;

  const selectedOption =
    sortOptions.find((option) => option.value === selectedSort) ?? sortOptions[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearchValue = searchValue.trim();

    onSearchSubmit?.(trimmedSearchValue);
    setIsSearchHistoryOpen(false);
  };

  const handleSortSelect = (value: TSortValue) => {
    onSortChange?.(value);
    setIsSortOpen(false);
  };

  const handleSearchClear = () => {
    onSearchChange?.('');
    onSearchClear?.();
    setIsSearchHistoryOpen(false);
  };

  const handleSearchHistorySelect = (history: string) => {
    const trimmedHistory = history.trim();

    if (!trimmedHistory) {
      return;
    }

    onSearchChange?.(trimmedHistory);
    onSearchHistorySelect?.(trimmedHistory);
    onSearchSubmit?.(trimmedHistory);
    setIsSearchHistoryOpen(false);
  };

  const handleSearchFocus = () => {
    if (hasSearchHistories) {
      setIsSearchHistoryOpen(true);
    }
  };

  const handleSearchHistoryToggle = () => {
    if (!hasSearchHistories) {
      return;
    }

    setIsSearchHistoryOpen((prev) => !prev);
  };

  const handleRootKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      setIsSortOpen(false);
      setIsSearchHistoryOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (sortRootRef.current && !sortRootRef.current.contains(target)) {
        setIsSortOpen(false);
      }

      if (searchRootRef.current && !searchRootRef.current.contains(target)) {
        setIsSearchHistoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form
      className={cn(styles.form, className)}
      onSubmit={handleSubmit}
      onKeyDown={handleRootKeyDown}
    >
      {hasSortOptions && selectedOption && (
        <div ref={sortRootRef} className={styles.sortRoot}>
          <button
            type="button"
            className={styles.sortButton}
            aria-label={`정렬: ${selectedOption.label}`}
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            onClick={() => setIsSortOpen((prev) => !prev)}
          >
            <SortIcon />

            <ChevronIcon className={styles.sortChevronIcon} aria-hidden="true" focusable="false" />
          </button>

          {isSortOpen && (
            <div className={styles.sortMenu} role="listbox" aria-label="정렬">
              {sortOptions.map((option) => {
                const isActive = option.value === selectedOption.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    disabled={option.disabled}
                    className={cn(
                      styles.sortMenuItem,
                      isActive ? styles.sortMenuItemActive : styles.sortMenuItemInactive,
                    )}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div ref={searchRootRef} className={styles.searchRoot}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>

        <input
          type="text"
          value={searchValue}
          placeholder={searchPlaceholder}
          className={styles.searchInput}
          aria-label="검색어"
          autoComplete="off"
          onFocus={handleSearchFocus}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />

        <div className={styles.searchRightControls}>
          {searchValue.length > 0 && (
            <button
              type="button"
              className={styles.searchClearButton}
              aria-label="검색어 삭제"
              onClick={handleSearchClear}
            >
              <CloseIcon className={styles.searchClearIcon} aria-hidden="true" focusable="false" />
            </button>
          )}

          <button
            type="button"
            className={styles.searchHistoryToggleButton}
            aria-label="검색 기록 열기"
            aria-haspopup="listbox"
            aria-expanded={isSearchHistoryOpen}
            aria-controls={searchHistoryListId}
            onClick={handleSearchHistoryToggle}
          >
            <ChevronIcon
              className={styles.searchHistoryChevronIcon}
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </div>

        {isSearchHistoryOpen && hasSearchHistories && (
          <div
            id={searchHistoryListId}
            className={styles.searchHistoryMenu}
            role="listbox"
            aria-label="검색 기록"
          >
            {searchHistoryItems.map((history, index) => {
              const isSelected = history === searchValue;

              return (
                <button
                  key={`${history}-${index}`}
                  type="button"
                  className={styles.searchHistoryItem}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSearchHistorySelect(history)}
                >
                  {history}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {actionButton && (
        <Button
          type="button"
          variant="default"
          size={44}
          width={76}
          paddingX={0}
          className={styles.actionButton}
          disabled={actionButton.disabled}
          onClick={() => {
            actionButton.onClick();
          }}
        >
          {actionButton.icon !== false && (
            <span className={styles.actionButtonIconWrapper}>
              {actionButton.icon === undefined ? (
                <CreateIcon
                  className={styles.actionButtonIcon}
                  aria-hidden="true"
                  focusable="false"
                />
              ) : (
                actionButton.icon
              )}
            </span>
          )}

          <span>{actionButton.label}</span>
        </Button>
      )}
    </form>
  );
}

export default ListFilterBar;
