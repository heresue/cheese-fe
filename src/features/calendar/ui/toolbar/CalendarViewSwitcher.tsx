'use client';

import type { CalendarView } from '../../model/types';

type Props = {
  value: CalendarView;
  onChange: (next: CalendarView) => void;
};

const items: Array<{ value: CalendarView; label: string }> = [
  { value: 'month', label: '월' },
  { value: 'week', label: '주' },
  { value: 'day', label: '일' },
];

export function CalendarViewSwitcher({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-xl bg-[var(--color-bg-subtle)] p-1">
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              'flex h-8 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium transition',
              active
                ? 'bg-[var(--color-primary-800)] text-[var(--color-text)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface)]',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
