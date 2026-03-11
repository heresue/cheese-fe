'use client';

import type { CalendarView } from '../../model/types';
import { CalendarViewSwitcher } from './CalendarViewSwitcher';

type Props = {
  view: CalendarView;
  onChangeView: (next: CalendarView) => void;

  onClickToday: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;

  title?: string;
};

export function CalendarToolbar({
  view,
  onChangeView,
  onClickToday,
  onClickPrev,
  onClickNext,
  title = '2026년 2월',
}: Props) {
  return (
    <header className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClickToday}
          className="h-9 rounded-xl border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-bg-subtle)]"
        >
          오늘
        </button>

        <div className="flex items-center overflow-hidden rounded-xl border border-[var(--color-border)]">
          <button
            type="button"
            onClick={onClickPrev}
            className="h-9 w-10 hover:bg-[var(--color-bg-subtle)]"
            aria-label="이전"
            title="이전"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onClickNext}
            className="h-9 w-10 hover:bg-[var(--color-bg-subtle)]"
            aria-label="다음"
            title="다음"
          >
            ›
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 text-center">
        <div className="truncate text-base font-semibold">{title}</div>
      </div>

      <div className="shrink-0">
        <CalendarViewSwitcher value={view} onChange={onChangeView} />
      </div>
    </header>
  );
}
