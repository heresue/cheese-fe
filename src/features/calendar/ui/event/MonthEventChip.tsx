'use client';

import { EVENT_COLOR_TOKENS, DEFAULT_EVENT_COLOR } from '../../model/constants';
import type { CalendarEvent } from '../../model/types';

type Props = {
  event: CalendarEvent;
};

export function MonthEventChip({ event }: Props) {
  const color = EVENT_COLOR_TOKENS[event.colorId ?? DEFAULT_EVENT_COLOR];

  return (
    <div
      className="flex items-center overflow-hidden rounded-md px-2 py-[2px] text-xs font-medium"
      style={{
        backgroundColor: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
      }}
    >
      <span className="truncate">{event.title}</span>
    </div>
  );
}
