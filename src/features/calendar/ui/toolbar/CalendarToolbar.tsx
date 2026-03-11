'use client';

import type { CalendarView } from '../../model/types';
import { CalendarViewSwitcher } from './CalendarViewSwitcher';

type Props = {
  view: CalendarView;
  title?: string;
  onChangeView: (next: CalendarView) => void;
  onClickToday: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
};

export function CalendarToolbar({
  view,
  title = '2026년 3월',
  onChangeView,
  onClickToday,
  onClickPrev,
  onClickNext,
}: Props) {
  return (
    <header className="mb-5 flex items-center justify-between bg-[var(--color-bg-surface)] px-8 pt-6 pb-2">
      <h2 className="text-2xl leading-[30px] font-bold text-[var(--color-gray-800)]">{title}</h2>

      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          onClick={onClickToday}
          className="flex h-8 w-[60px] items-center justify-center rounded-[13px] border border-[var(--color-gray-300)] bg-[var(--color-bg-surface)] text-xs font-medium text-[var(--color-text)] transition hover:bg-[var(--color-bg-subtle)]"
        >
          오늘
        </button>

        <button
          type="button"
          onClick={onClickPrev}
          aria-label="이전"
          className="flex h-8 w-8 items-center justify-center rounded-[13px] border border-[var(--color-gray-300)] bg-[var(--color-bg-surface)] transition hover:bg-[var(--color-bg-subtle)]"
        >
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <path
              d="M1 9L4 5L7 9"
              stroke="var(--color-gray-500)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={onClickNext}
          aria-label="다음"
          className="flex h-8 w-8 items-center justify-center rounded-[13px] border border-[var(--color-gray-300)] bg-[var(--color-bg-surface)] transition hover:bg-[var(--color-bg-subtle)]"
        >
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <path
              d="M1 5L4 9L7 5"
              stroke="var(--color-gray-500)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <CalendarViewSwitcher value={view} onChange={onChangeView} />
      </div>
    </header>
  );
}
