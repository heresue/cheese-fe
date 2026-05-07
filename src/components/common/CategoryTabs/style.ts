import type { CategoryTabsSize } from './type';

export const categoryTabsClassNames = {
  list: 'flex flex-wrap items-center gap-[10px]',

  buttonBase:
    'inline-flex items-center justify-center whitespace-nowrap border bg-bg-white outline-none transition-colors disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-text-muted',

  buttonSize: {
    sm: 'h-[36px] min-w-[58px] rounded-[8px] px-[14px] text-[13px]',
    md: 'h-[44px] min-w-[66px] rounded-[8px] px-[18px] text-[14px]',
  } satisfies Record<CategoryTabsSize, string>,

  active: 'border-secondary-600 text-secondary-600 font-semibold',

  inactive:
    'border-border text-gray-800 font-medium hover:border-secondary-600 hover:text-secondary-600',
};
