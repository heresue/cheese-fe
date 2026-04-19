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
    <div className="flex h-8 w-[228px] items-center rounded-[13px] bg-[var(--color-bg-subtle)] p-[4px]">
      <div className="flex w-full items-center justify-between">
        {items.map((item) => {
          const active = item.value === value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={[
                'flex h-6 w-[60px] items-center justify-center rounded-[10px] text-xs leading-none font-medium transition',
                active
                  ? 'bg-[var(--color-bg-surface)] text-[var(--color-text)]'
                  : 'bg-transparent text-[var(--color-text-muted)]',
              ].join(' ')}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
