'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import './calendar.css';

import type {
  CalendarApi,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core';

import type {
  CalendarEvent,
  CalendarEventDraft,
  CalendarSlot,
  CalendarView,
} from '../../model/types';
import { MonthEventChip } from '../event/MonthEventChip';

type CalendarCoreProps = {
  view: CalendarView;
  events: CalendarEvent[];
  onTitleChange?: (title: string) => void;
  onSelectSlot?: (slot: CalendarSlot) => void;
  onClickEvent?: (payload: { event: Partial<CalendarEventDraft>; rect: DOMRect }) => void;
  onClickDateCell?: (payload: { date: string; rect: DOMRect }) => void;
};

type MonthDensity = 'comfortable' | 'compact';

type MonthLayoutState = {
  density: MonthDensity;
  rowHeight: number;
  scrollbarWidth: number;
  weekCount: number;
};

const VIEW_MAP: Record<CalendarView, string> = {
  month: 'dayGridMonth',
  week: 'timeGridWeek',
  day: 'timeGridDay',
};

const MONTH_MIN_ROW_HEIGHT: Record<MonthDensity, number> = {
  comfortable: 142,
  compact: 120,
};

const DEFAULT_MONTH_LAYOUT: MonthLayoutState = {
  density: 'comfortable',
  rowHeight: MONTH_MIN_ROW_HEIGHT.comfortable,
  scrollbarWidth: 0,
  weekCount: 5,
};

const MONTH_LAYOUT_EPSILON = 0.5;

export function CalendarCore({
  view,
  events,
  onTitleChange,
  onSelectSlot,
  onClickEvent,
  onClickDateCell,
}: CalendarCoreProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const rafRef = useRef<number | null>(null);
  const viewSyncRafRef = useRef<number | null>(null);

  const [monthLayout, setMonthLayout] = useState<MonthLayoutState>(DEFAULT_MONTH_LAYOUT);

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

  const syncView = useCallback(
    (api: CalendarApi) => {
      const nextView = VIEW_MAP[view];

      if (api.view.type === nextView) return;

      if (viewSyncRafRef.current !== null) {
        cancelAnimationFrame(viewSyncRafRef.current);
      }

      viewSyncRafRef.current = requestAnimationFrame(() => {
        viewSyncRafRef.current = null;

        const latestApi = getApi();
        if (!latestApi) return;
        if (latestApi.view.type === nextView) return;

        latestApi.changeView(nextView);
      });
    },
    [view],
  );

  const syncMonthLayout = useCallback(() => {
    if (view !== 'month') {
      setMonthLayout((prev) => {
        const isSameAsDefault =
          prev.density === DEFAULT_MONTH_LAYOUT.density &&
          Math.abs(prev.rowHeight - DEFAULT_MONTH_LAYOUT.rowHeight) < MONTH_LAYOUT_EPSILON &&
          prev.scrollbarWidth === DEFAULT_MONTH_LAYOUT.scrollbarWidth &&
          prev.weekCount === DEFAULT_MONTH_LAYOUT.weekCount;

        return isSameAsDefault ? prev : DEFAULT_MONTH_LAYOUT;
      });
      return;
    }

    const containerEl = containerRef.current;
    if (!containerEl) return;

    const monthViewEl = containerEl.querySelector('.fc-dayGridMonth-view');
    const monthBodyScroller = monthViewEl?.querySelector('.fc-scroller');
    const monthBody = monthViewEl?.querySelector('.fc-daygrid-body');
    const weekRows = monthViewEl?.querySelectorAll('.fc-daygrid-body tbody tr');

    if (
      !(monthBodyScroller instanceof HTMLElement) ||
      !(monthBody instanceof HTMLElement) ||
      !weekRows ||
      weekRows.length === 0
    ) {
      return;
    }

    const weekCount = weekRows.length;
    const bodyHeight = monthBody.getBoundingClientRect().height;
    if (bodyHeight <= 0) return;

    // 6주 달에서 사용할 기준 높이는 "5주 달이 꽉 찰 때 한 줄 높이"
    const measuredRowHeight = bodyHeight / 5;

    const density: MonthDensity =
      measuredRowHeight >= MONTH_MIN_ROW_HEIGHT.comfortable ? 'comfortable' : 'compact';

    const minRowHeight = MONTH_MIN_ROW_HEIGHT[density];
    const rowHeight = Math.max(minRowHeight, measuredRowHeight);

    const scrollbarWidth = Math.max(
      monthBodyScroller.offsetWidth - monthBodyScroller.clientWidth,
      0,
    );

    setMonthLayout((prev) => {
      const next: MonthLayoutState = {
        density,
        rowHeight,
        scrollbarWidth,
        weekCount,
      };

      const hasSameDensity = prev.density === next.density;
      const hasSameRowHeight = Math.abs(prev.rowHeight - next.rowHeight) < MONTH_LAYOUT_EPSILON;
      const hasSameScrollbarWidth = prev.scrollbarWidth === next.scrollbarWidth;
      const hasSameWeekCount = prev.weekCount === next.weekCount;

      return hasSameDensity && hasSameRowHeight && hasSameScrollbarWidth && hasSameWeekCount
        ? prev
        : next;
    });
  }, [view]);

  const scheduleMonthLayoutSync = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncMonthLayout();
    });
  }, [syncMonthLayout]);

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
    const rect = arg.el.getBoundingClientRect();

    onClickEvent?.({
      rect,
      event: {
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
      },
    });
  };

  const handleDateClick = (arg: DateClickArg) => {
    if (view !== 'month') return;

    const rect = arg.dayEl.getBoundingClientRect();

    onClickDateCell?.({
      date: arg.dateStr,
      rect,
    });
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    onTitleChange?.(arg.view.title);
    scheduleMonthLayoutSync();
  };

  const renderMonthEventContent = (arg: EventContentArg) => {
    const ext = arg.event.extendedProps as Partial<CalendarEventDraft>;

    const monthEvent: CalendarEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr || arg.event.startStr,
      allDay: arg.event.allDay,
      memo: ext.memo,
      spaceId: ext.spaceId,
      colorId: ext.colorId,
      reminderMinutes: ext.reminderMinutes,
      location: ext.location,
    };

    return <MonthEventChip event={monthEvent} />;
  };

  const calendarStyle = useMemo(() => {
    return {
      '--calendar-month-day-height': `${monthLayout.rowHeight}px`,
      '--calendar-scrollbar-width': `${monthLayout.scrollbarWidth}px`,
    } as CSSProperties;
  }, [monthLayout.rowHeight, monthLayout.scrollbarWidth]);

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
  }, [syncView]);

  useEffect(() => {
    const api = getApi();
    if (!api) return;

    onTitleChange?.(api.view.title);
    scheduleMonthLayoutSync();
  }, [onTitleChange, scheduleMonthLayoutSync, view]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      scheduleMonthLayoutSync();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [scheduleMonthLayoutSync]);

  useEffect(() => {
    if (view !== 'month') return;
    scheduleMonthLayoutSync();
  }, [monthLayout.rowHeight, scheduleMonthLayoutSync, view]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (viewSyncRafRef.current !== null) {
        cancelAnimationFrame(viewSyncRafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 w-full overflow-hidden"
      data-calendar-view={view}
      data-month-density={monthLayout.density}
      data-month-week-count={monthLayout.weekCount}
      style={calendarStyle}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={false}
        height="100%"
        contentHeight="100%"
        expandRows={view !== 'month'}
        fixedWeekCount={false}
        nowIndicator={false}
        selectable
        selectMirror
        unselectAuto
        select={handleSelect}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={view === 'month' ? renderMonthEventContent : undefined}
        eventDisplay={view === 'month' ? 'block' : 'auto'}
        displayEventTime={view !== 'month'}
        events={fcEvents}
        dayCellContent={(arg) => String(arg.date.getDate())}
        datesSet={handleDatesSet}
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        slotDuration="00:30:00"
        dayMaxEventRows={view === 'month' ? true : 3}
        locale="ko"
      />
    </div>
  );
}
