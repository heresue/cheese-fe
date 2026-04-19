'use client';

import type { CalendarEvent } from '../../model/types';

type Props = {
  events: CalendarEvent[];
  onCreateClick?: () => void;
};

export function CalendarSidebar({ events, onCreateClick }: Props) {
  return (
    <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-semibold">일정</div>
        <button
          type="button"
          onClick={onCreateClick}
          className="h-9 rounded-xl border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-bg-bg-2)]"
        >
          추가
        </button>
      </div>

      <div className="text-sm text-[var(--color-text-muted)]">총 {events.length}개</div>
    </div>
  );
}
