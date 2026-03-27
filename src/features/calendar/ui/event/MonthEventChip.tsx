'use client';

import type { CSSProperties } from 'react';

import { getEventColorTokens } from '../../model/constants';
import type { CalendarEvent } from '../../model/types';

type Props = {
  event: CalendarEvent;
};

export function MonthEventChip({ event }: Props) {
  const color = getEventColorTokens(event.colorId);

  return (
    <div
      className="calendar-event-chip calendar-event-chip--month"
      style={
        {
          '--calendar-event-bg-default': color.defaultBg,
          '--calendar-event-bg-hover': color.hoverBg,
          '--calendar-event-bg-selected': color.selectedBg,
          '--calendar-event-text-default': color.defaultText,
          '--calendar-event-text-selected': color.selectedText,
          '--calendar-event-border-default': color.defaultBorder,
          '--calendar-event-border-hover': color.hoverBorder,
          '--calendar-event-border-selected': color.selectedBorder,
        } as CSSProperties
      }
    >
      <span className="calendar-event-chip__title">{event.title}</span>
    </div>
  );
}
