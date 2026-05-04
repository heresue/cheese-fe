import type { CategoryTabsSize } from './type';

export const categoryTabsClassNames = {
  list: 'flex flex-wrap items-center gap-[10px]',

  buttonBase:
    'inline-flex items-center justify-center whitespace-nowrap border bg-bg-white transition-colors outline-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-text-muted',

  buttonSize: {
    sm: 'h-[36px] min-w-[58px] rounded-[8px] px-[14px] text-[13px]',
    md: 'h-[44px] min-w-[66px] rounded-[8px] px-[18px] text-[14px]',
  } satisfies Record<CategoryTabsSize, string>,

  active: 'border-secondary-500 text-secondary-500 font-semibold',

  inactive:
    'border-border text-gray-800 font-normal hover:border-secondary-500 hover:text-secondary-500',
};
