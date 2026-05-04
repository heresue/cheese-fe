'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

import { listFilterBarClassNames as styles } from './style';
import type { ListFilterBarProps } from './type';

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h7M3 8h5M3 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 5v6M10 9l2 2 2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
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
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CreateIcon() {
  return (
    <svg
      className={styles.actionButtonIcon}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.56098 16.0195C1.13171 16.0195 0.764097 15.8665 0.458146 15.5606C0.152715 15.2552 0 14.8878 0 14.4585V3.53171C0 3.10244 0.152715 2.73483 0.458146 2.42888C0.764097 2.12345 1.13171 1.97073 1.56098 1.97073H8.52683L6.96585 3.53171H1.56098V14.4585H12.4878V9.03415L14.0488 7.47317V14.4585C14.0488 14.8878 13.8961 15.2552 13.5906 15.5606C13.2847 15.8665 12.9171 16.0195 12.4878 16.0195H1.56098ZM10.2829 2.41951L11.3951 3.51219L6.2439 8.66341V9.77561H7.33658L12.5073 4.60488L13.6195 5.69756L8 11.3366H4.68293V8.01951L10.2829 2.41951ZM13.6195 5.69756L10.2829 2.41951L12.2341 0.468293C12.5463 0.156098 12.9205 0 13.3565 0C13.792 0 14.1593 0.156098 14.4585 0.468293L15.5512 1.58049C15.8504 1.87967 16 2.2439 16 2.67317C16 3.10244 15.8504 3.46667 15.5512 3.76585L13.6195 5.69756Z"
        fill="currentColor"
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
    onSearchSubmit?.(searchValue.trim());
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
    onSearchChange?.(history);
    onSearchHistorySelect?.(history);
    setIsSearchHistoryOpen(false);
  };

  const handleSearchFocus = () => {
    if (hasSearchHistories) {
      setIsSearchHistoryOpen(true);
    }
  };

  const handleSearchHistoryToggle = () => {
    if (!hasSearchHistories) return;

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
            <ChevronDownIcon />
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
              <CloseIcon />
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
            <ChevronDownIcon />
          </button>
        </div>

        {isSearchHistoryOpen && hasSearchHistories && (
          <div
            id={searchHistoryListId}
            className={styles.searchHistoryMenu}
            role="listbox"
            aria-label="검색 기록"
          >
            {searchHistoryItems.map((history, index) => (
              <button
                key={`${history}-${index}`}
                type="button"
                className={styles.searchHistoryItem}
                role="option"
                onClick={() => handleSearchHistorySelect(history)}
              >
                {history}
              </button>
            ))}
          </div>
        )}
      </div>

      {actionButton && (
        <button
          type="button"
          className={styles.actionButton}
          disabled={actionButton.disabled}
          onClick={actionButton.onClick}
        >
          <span className={styles.actionButtonIconWrapper}>
            {actionButton.icon === undefined || actionButton.icon === false ? (
              <CreateIcon />
            ) : (
              actionButton.icon
            )}
          </span>

          <span>{actionButton.label}</span>
        </button>
      )}
    </form>
  );
}

export default ListFilterBar;
