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
    <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-1">
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              'h-9 min-w-10 rounded-lg px-3 text-sm transition',
              active
                ? 'bg-[var(--color-primary-800)] text-[var(--color-text)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
