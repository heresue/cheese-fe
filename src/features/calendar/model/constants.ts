import type { EventColorId } from './types';

export const EVENT_COLOR_TOKENS: Record<
  EventColorId,
  { bg: string; hover: string; text: string; border: string }
> = {
  'tag-red': {
    bg: 'var(--color-tag-red-100)',
    hover: 'var(--color-tag-red-200)',
    text: 'var(--color-tag-red-500)',
    border: 'var(--color-tag-red-500)',
  },
  'tag-yellow': {
    bg: 'var(--color-tag-yellow-100)',
    hover: 'var(--color-tag-yellow-200)',
    text: 'var(--color-tag-yellow-500)',
    border: 'var(--color-tag-yellow-500)',
  },
  'tag-green': {
    bg: 'var(--color-tag-green-100)',
    hover: 'var(--color-tag-green-200)',
    text: 'var(--color-tag-green-500)',
    border: 'var(--color-tag-green-500)',
  },
  'tag-blue': {
    bg: 'var(--color-tag-blue-100)',
    hover: 'var(--color-tag-blue-200)',
    text: 'var(--color-tag-blue-500)',
    border: 'var(--color-tag-blue-500)',
  },
  'tag-purple': {
    bg: 'var(--color-tag-purple-100)',
    hover: 'var(--color-tag-purple-200)',
    text: 'var(--color-tag-purple-500)',
    border: 'var(--color-tag-purple-500)',
  },
  'tag-gray': {
    bg: 'var(--color-tag-gray-100)',
    hover: 'var(--color-tag-gray-200)',
    text: 'var(--color-tag-gray-500)',
    border: 'var(--color-tag-gray-500)',
  },
};
