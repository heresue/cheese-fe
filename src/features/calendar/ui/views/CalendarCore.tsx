'use client';

import type {
  CalendarEvent,
  CalendarEventDraft,
  CalendarSlot,
  CalendarView,
} from '../../model/types';

type CalendarCoreProps = {
  view: CalendarView;
  events: CalendarEvent[];
  onSelectSlot?: (slot: CalendarSlot) => void;
  onClickEvent?: (event: Partial<CalendarEventDraft>) => void;
};

export function CalendarCore({ view, events, onSelectSlot, onClickEvent }: CalendarCoreProps) {
  // 아직 FullCalendar 연결 전이면 placeholder라도 OK
  return <div className="h-full w-full p-4">CalendarCore</div>;
}
