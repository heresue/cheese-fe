'use client';

import { useEffect, useMemo, useRef } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css';

import type {
  CalendarApi,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';

import type {
  CalendarEvent,
  CalendarEventDraft,
  CalendarSlot,
  CalendarView,
} from '../../model/types';

type CalendarCoreProps = {
  view: CalendarView;
  events: CalendarEvent[];
  onTitleChange?: (title: string) => void;
  onSelectSlot?: (slot: CalendarSlot) => void;
  onClickEvent?: (event: Partial<CalendarEventDraft>) => void;
};

const VIEW_MAP: Record<CalendarView, string> = {
  month: 'dayGridMonth',
  week: 'timeGridWeek',
  day: 'timeGridDay',
};

export function CalendarCore({
  view,
  events,
  onTitleChange,
  onSelectSlot,
  onClickEvent,
}: CalendarCoreProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const isMonthView = view === 'month';

  const fcEvents = useMemo<EventInput[]>(() => {
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      extendedProps: {
        memo: e.memo,
        spaceId: e.spaceId,
        colorId: e.colorId,
        reminderMinutes: e.reminderMinutes,
        location: e.location,
      },
    }));
  }, [events]);

  const initialView = VIEW_MAP[view];

  const getApi = () => calendarRef.current?.getApi();

  const syncView = (api: CalendarApi) => {
    const nextView = VIEW_MAP[view];
    if (api.view.type !== nextView) {
      api.changeView(nextView);
    }
  };

  const handleSelect = (arg: DateSelectArg) => {
    onSelectSlot?.({
      start: arg.startStr,
      end: arg.endStr,
      allDay: arg.allDay,
    });

    arg.view.calendar.unselect();
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = arg.event;
    const ext = event.extendedProps as Partial<CalendarEventDraft>;

    onClickEvent?.({
      id: event.id,
      title: event.title ?? '',
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      memo: ext?.memo,
      spaceId: ext?.spaceId,
      colorId: ext?.colorId,
      reminderMinutes: ext?.reminderMinutes,
      location: ext?.location,
    });
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    syncView(arg.view.calendar);
    onTitleChange?.(arg.view.title);
  };

  useEffect(() => {
    const api = getApi();
    if (!api) return;

    const handleToday = () => api.today();
    const handlePrev = () => api.prev();
    const handleNext = () => api.next();

    window.addEventListener('calendar:today', handleToday);
    window.addEventListener('calendar:prev', handlePrev);
    window.addEventListener('calendar:next', handleNext);

    return () => {
      window.removeEventListener('calendar:today', handleToday);
      window.removeEventListener('calendar:prev', handlePrev);
      window.removeEventListener('calendar:next', handleNext);
    };
  }, []);

  useEffect(() => {
    const api = getApi();
    if (!api) return;

    syncView(api);
    onTitleChange?.(api.view.title);
  }, [view, onTitleChange]);
  return (
    <div className="h-full min-h-0 w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        height="100%"
        contentHeight="100%"
        expandRows
        headerToolbar={false}
        fixedWeekCount={false}
        nowIndicator
        selectable
        selectMirror
        unselectAuto
        select={handleSelect}
        eventClick={handleEventClick}
        events={fcEvents}
        dayCellContent={(arg) => String(arg.date.getDate())}
        datesSet={handleDatesSet}
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        slotDuration="00:30:00"
        dayMaxEventRows={3}
        locale="ko"
      />
    </div>
  );
}
