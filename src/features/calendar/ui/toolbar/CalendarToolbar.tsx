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
  title = '2026년 2월',
  onChangeView,
  onClickToday,
  onClickPrev,
  onClickNext,
}: Props) {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3">
      {/* left */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClickToday}
          className="h-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-bg-subtle)]"
        >
          오늘
        </button>

        <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-1">
          <button
            type="button"
            onClick={onClickPrev}
            aria-label="이전"
            title="이전"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-sm text-[var(--color-text)] transition hover:bg-[var(--color-bg-subtle)]"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onClickNext}
            aria-label="다음"
            title="다음"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-sm text-[var(--color-text)] transition hover:bg-[var(--color-bg-subtle)]"
          >
            ›
          </button>
        </div>
      </div>

      {/* center */}
      <div className="flex-1 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">{title}</h2>
      </div>

      {/* right */}
      <div className="flex items-center">
        <CalendarViewSwitcher value={view} onChange={onChangeView} />
      </div>
    </header>
  );
}
