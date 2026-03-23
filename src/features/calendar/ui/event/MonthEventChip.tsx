'use client';

import { DEFAULT_EVENT_COLOR, EVENT_COLOR_TOKENS } from '../../model/constants';
import type { CalendarEvent } from '../../model/types';

type Props = {
  event: CalendarEvent;
};

export function MonthEventChip({ event }: Props) {
  const color = EVENT_COLOR_TOKENS[event.colorId ?? DEFAULT_EVENT_COLOR];

  return (
    <div
      className="flex h-[18px] w-full items-center overflow-hidden rounded-[7px] px-2 text-[11px] leading-[14px] font-medium"
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
