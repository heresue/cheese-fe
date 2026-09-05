export const APPLICATION_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
] as const;

export type ApplicationSort = (typeof APPLICATION_SORT_OPTIONS)[number]['value'];
