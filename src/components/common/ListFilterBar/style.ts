export const listFilterBarClassNames = {
  form: 'flex w-full items-center gap-2',

  sortRoot: 'relative shrink-0',

  sortButton:
    'flex h-[44px] w-[66px] items-center justify-center gap-1 rounded-[8px] border border-border bg-bg-white text-text-placeholder outline-none transition-colors hover:border-secondary-600 hover:text-secondary-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-text-muted',

  sortChevronIcon: 'block h-[12px] w-[12px] shrink-0 rotate-90 [&_*]:fill-current',

  sortMenu:
    'absolute left-0 top-[calc(100%+10px)] z-50 flex w-[200px] flex-col gap-[10px] rounded-[5px] border border-border bg-bg-white p-[12px] shadow-[0_4px_20px_rgb(var(--color-gray-500-rgb)/0.25)]',

  sortMenuItem:
    'flex h-[20px] w-full items-center rounded-[5px] px-[8px] text-left text-[14px] font-medium leading-5 text-text outline-none transition-colors disabled:cursor-not-allowed disabled:text-text-muted',

  sortMenuItemActive: 'bg-gray-200',

  sortMenuItemInactive: 'bg-transparent hover:bg-gray-200',

  searchRoot: 'relative flex h-[44px] w-[500px] max-w-full items-center',

  searchIcon:
    'pointer-events-none absolute left-[14px] flex items-center justify-center text-text-placeholder',

  searchInput:
    'h-full w-full rounded-[8px] border border-border bg-bg-white px-[14px] pl-10 pr-[72px] text-[14px] text-text outline-none placeholder:text-text-placeholder',

  searchRightControls: 'absolute right-[12px] flex items-center justify-center gap-[8px]',

  searchClearButton:
    'flex h-5 w-5 items-center justify-center rounded-full text-border transition-colors hover:text-text-muted',

  searchClearIcon: 'block h-[12px] w-[12px] shrink-0 [&_*]:fill-current',

  searchHistoryToggleButton:
    'flex h-5 w-5 items-center justify-center text-text-placeholder transition-colors hover:text-text-muted',

  searchHistoryChevronIcon: 'block h-[12px] w-[12px] shrink-0 rotate-90 [&_*]:fill-current',

  searchHistoryMenu:
    'absolute left-0 top-[calc(100%+8px)] z-50 flex w-full flex-col rounded-[8px] border border-border bg-bg-white py-2 shadow-[0_4px_20px_rgb(var(--color-gray-500-rgb)/0.25)]',

  searchHistoryItem:
    'flex h-[40px] w-full items-center px-[14px] text-left text-[14px] font-normal text-text transition-colors hover:bg-gray-200',

  actionButton:
    'gap-[4px] rounded-[10px] border border-secondary-600 bg-secondary-600 p-0 text-[14px] font-medium leading-[24px] tracking-[-0.02em] text-gray-50 transition-colors hover:border-secondary-700 hover:bg-secondary-700 disabled:cursor-not-allowed disabled:opacity-50',

  actionButtonIconWrapper:
    'flex h-[17px] w-[16px] shrink-0 items-center justify-center text-gray-50',

  actionButtonIcon: 'block h-[17px] w-[16px] shrink-0 [&_*]:fill-current',
};
