'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import type {
  CalendarApi,
  DateSelectArg,
  DatesSetArg,
  DayCellContentArg,
  EventClickArg,
  EventContentArg,
  EventInput,
  NowIndicatorContentArg,
} from '@fullcalendar/core';

import {
  addDaysToCalendarDate,
  addHoursToCalendarDateTime,
  combineDateAndTime,
  formatCalendarTitle,
  formatEnglishHourLabel,
  formatKoreanWeekday,
  isSameCalendarDate,
  normalizeCalendarValue,
} from '../../lib/date';
import { DEFAULT_EVENT_COLOR, EVENT_COLOR_TOKENS } from '../../model/constants';
import type {
  CalendarEvent,
  CalendarEventDraft,
  CalendarSlot,
  CalendarView,
} from '../../model/types';
import { MonthEventChip } from '../event/MonthEventChip';
import './calendar.css';

type CalendarCoreProps = {
  view: CalendarView;
  events: CalendarEvent[];
  onTitleChange?: (title: string) => void;
  onSelectSlot?: (slot: CalendarSlot) => void;
  onClickEvent?: (payload: { event: Partial<CalendarEventDraft>; rect: DOMRect }) => void;
  onClickDateCell?: (payload: {
    draft: CalendarEventDraft;
    rect: DOMRect;
    placement?: 'auto' | 'cell-center';
  }) => void;
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
const TIMEGRID_SLOT_HEIGHT = 48;
const TIMEGRID_SLOT_COUNT = 24;

function resolveDateClickRect(arg: DateClickArg) {
  const target = arg.jsEvent.target as HTMLElement | null;

  if (target) {
    const slotLane = target.closest('.fc-timegrid-slot-lane');
    if (slotLane instanceof HTMLElement) {
      return slotLane.getBoundingClientRect();
    }

    const tableCell = target.closest('td');
    if (tableCell instanceof HTMLElement) {
      return tableCell.getBoundingClientRect();
    }
  }

  return arg.dayEl.getBoundingClientRect();
}

function formatCompactHourLabel(date: Date) {
  const hours = date.getHours();
  const meridiem = hours < 12 ? 'AM' : 'PM';
  const hour12 = hours % 12 || 12;

  return `${hour12}${meridiem}`;
}

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
  const today = useMemo(() => new Date(), []);

  const [monthLayout, setMonthLayout] = useState<MonthLayoutState>(DEFAULT_MONTH_LAYOUT);
  const [timeGridScrollbarWidth, setTimeGridScrollbarWidth] = useState(0);

  const fcEvents = useMemo<EventInput[]>(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: {
        memo: event.memo,
        spaceId: event.spaceId,
        colorId: event.colorId,
        reminderMinutes: event.reminderMinutes,
        location: event.location,
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

  const syncTimeGridLayout = useCallback(() => {
    if (view === 'month') {
      setTimeGridScrollbarWidth((prev) => (prev === 0 ? prev : 0));
      return;
    }

    const containerEl = containerRef.current;
    if (!containerEl) return;

    const timeGridViewEl = containerEl.querySelector(
      view === 'week' ? '.fc-timeGridWeek-view' : '.fc-timeGridDay-view',
    );
    const bodyScroller = timeGridViewEl?.querySelector('.fc-scroller');

    if (!(bodyScroller instanceof HTMLElement)) return;

    const scrollbarWidth = Math.max(bodyScroller.offsetWidth - bodyScroller.clientWidth, 0);

    setTimeGridScrollbarWidth((prev) => (prev === scrollbarWidth ? prev : scrollbarWidth));
  }, [view]);

  const scheduleLayoutSync = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncMonthLayout();
      syncTimeGridLayout();
    });
  }, [syncMonthLayout, syncTimeGridLayout]);

  const handleSelect = (arg: DateSelectArg) => {
    onSelectSlot?.({
      start: arg.startStr,
      end: arg.endStr,
      allDay: arg.allDay,
    });

    arg.view.calendar.unselect();
  };

  const handleEventClick = (arg: EventClickArg) => {
    const ext = arg.event.extendedProps as Partial<CalendarEventDraft>;
    const isAllDay = arg.event.allDay;
    const start = normalizeCalendarValue(arg.event.start, { allDay: isAllDay });
    const end = normalizeCalendarValue(arg.event.end ?? arg.event.start, { allDay: isAllDay });

    onClickEvent?.({
      rect: arg.el.getBoundingClientRect(),
      event: {
        id: arg.event.id,
        title: arg.event.title ?? '',
        start,
        end,
        allDay: isAllDay,
        memo: ext.memo,
        spaceId: ext.spaceId,
        colorId: ext.colorId,
        reminderMinutes: ext.reminderMinutes,
        location: ext.location,
      },
    });
  };

  const handleDateClick = (arg: DateClickArg) => {
    const rect = resolveDateClickRect(arg);
    const dateKey = normalizeCalendarValue(arg.date, { allDay: true });
    const start = combineDateAndTime(dateKey, '09:00');
    const end = addHoursToCalendarDateTime(start, 1);

    if (!start || !end) return;

    onClickDateCell?.({
      rect,
      draft: {
        title: '',
        start,
        end,
        allDay: false,
      },
    });
  };

  const openTimedSlotPopover = useCallback(
    (date: Date, slotEl: HTMLElement) => {
      const start = normalizeCalendarValue(date);
      const end = addHoursToCalendarDateTime(start, 1);

      onClickDateCell?.({
        rect: slotEl.getBoundingClientRect(),
        placement: view === 'day' ? 'cell-center' : 'auto',
        draft: {
          title: '',
          start,
          end,
          allDay: false,
        },
      });
    },
    [onClickDateCell, view],
  );

  const renderTimeGridSlotOverlay = useCallback(
    (arg: DayCellContentArg) => {
      const baseDate = new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate());
      return (
        <div className="calendar-timegrid-slot-overlay">
          <div className="calendar-timegrid-slot-overlay__grid">
            {Array.from({ length: TIMEGRID_SLOT_COUNT }, (_, hour) => {
              const slotDate = new Date(
                baseDate.getFullYear(),
                baseDate.getMonth(),
                baseDate.getDate(),
                hour,
                0,
                0,
                0,
              );

              return (
                <button
                  key={`${arg.date.toISOString()}-${hour}`}
                  type="button"
                  tabIndex={-1}
                  className="calendar-timegrid-slot-overlay__button"
                  aria-label={`${formatKoreanWeekday(baseDate)} ${baseDate.getDate()}일 ${formatEnglishHourLabel(
                    slotDate,
                  )}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    openTimedSlotPopover(slotDate, event.currentTarget);
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    },
    [openTimedSlotPopover],
  );

  const handleDatesSet = (arg: DatesSetArg) => {
    const focusedDate = arg.view.calendar.getDate();

    onTitleChange?.(formatCalendarTitle(focusedDate));

    window.dispatchEvent(
      new CustomEvent('calendar:focus-date', {
        detail: {
          date: focusedDate.toISOString(),
        },
      }),
    );

    scheduleLayoutSync();
  };

  const renderMonthDayContent = (date: Date) => {
    const viewDate = getApi()?.getDate() ?? today;
    const isVisibleMonth =
      date.getFullYear() === viewDate.getFullYear() && date.getMonth() === viewDate.getMonth();
    const isActive = isVisibleMonth && isSameCalendarDate(date, today);

    return (
      <span
        className={
          isActive
            ? 'calendar-month-day-number calendar-month-day-number--active'
            : 'calendar-month-day-number'
        }
      >
        {date.getDate()}
      </span>
    );
  };

  const renderMonthEventContent = (arg: EventContentArg) => {
    const ext = arg.event.extendedProps as Partial<CalendarEventDraft>;

    const monthEvent: CalendarEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: normalizeCalendarValue(arg.event.start, { allDay: arg.event.allDay }),
      end: normalizeCalendarValue(arg.event.end ?? arg.event.start, { allDay: arg.event.allDay }),
      allDay: arg.event.allDay,
      memo: ext.memo,
      spaceId: ext.spaceId,
      colorId: ext.colorId,
      reminderMinutes: ext.reminderMinutes,
      location: ext.location,
    };

    return <MonthEventChip event={monthEvent} />;
  };

  const renderTimeGridEventContent = (arg: EventContentArg) => {
    const ext = arg.event.extendedProps as Partial<CalendarEventDraft>;
    const colorId = ext.colorId ?? DEFAULT_EVENT_COLOR;
    const color = EVENT_COLOR_TOKENS[colorId];

    return (
      <div
        className="calendar-time-event-chip"
        style={
          {
            '--calendar-event-bg': color.bg,
            '--calendar-event-hover': color.hover,
            '--calendar-event-text': color.text,
            '--calendar-event-border': color.border,
          } as CSSProperties
        }
      >
        <span className="calendar-time-event-chip__title">{arg.event.title}</span>
      </div>
    );
  };

  const renderTimeGridHeader = (date: Date) => {
    const isActive = isSameCalendarDate(date, today);

    return (
      <div className="calendar-timegrid-header-label">
        <span className="calendar-timegrid-header-label__weekday">{formatKoreanWeekday(date)}</span>
        <span
          className={
            isActive
              ? 'calendar-timegrid-header-label__date calendar-timegrid-header-label__date--active'
              : 'calendar-timegrid-header-label__date'
          }
        >
          {date.getDate()}
        </span>
      </div>
    );
  };

  const renderMonthHeader = (date: Date) => {
    return <span className="calendar-month-header-label">{formatKoreanWeekday(date)}</span>;
  };

  const renderNowIndicatorContent = (arg: NowIndicatorContentArg) => {
    if (!arg.isAxis) return null;

    return <span className="calendar-now-indicator-label">{formatCompactHourLabel(arg.date)}</span>;
  };

  const calendarStyle = useMemo(() => {
    return {
      '--calendar-month-day-height': `${monthLayout.rowHeight}px`,
      '--calendar-scrollbar-width': `${monthLayout.scrollbarWidth}px`,
      '--calendar-time-slot-height': `${TIMEGRID_SLOT_HEIGHT}px`,
      '--calendar-timegrid-scrollbar-width': `${timeGridScrollbarWidth}px`,
    } as CSSProperties;
  }, [monthLayout.rowHeight, monthLayout.scrollbarWidth, timeGridScrollbarWidth]);

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

    onTitleChange?.(formatCalendarTitle(api.getDate()));
    scheduleLayoutSync();
  }, [onTitleChange, scheduleLayoutSync, view]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      scheduleLayoutSync();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [scheduleLayoutSync]);

  useEffect(() => {
    if (view !== 'month') return;
    scheduleLayoutSync();
  }, [monthLayout.rowHeight, scheduleLayoutSync, view]);

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
      className="relative h-full min-h-0 w-full overflow-hidden"
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
        nowIndicator={view !== 'month'}
        nowIndicatorSnap={false}
        nowIndicatorContent={renderNowIndicatorContent}
        selectable={Boolean(onSelectSlot)}
        selectMirror={Boolean(onSelectSlot)}
        unselectAuto
        select={handleSelect}
        dateClick={view === 'month' ? handleDateClick : undefined}
        eventClick={handleEventClick}
        eventContent={view === 'month' ? renderMonthEventContent : renderTimeGridEventContent}
        eventClassNames={view === 'month' ? undefined : () => ['calendar-time-event']}
        eventDisplay="block"
        displayEventTime={false}
        events={fcEvents}
        dayCellContent={
          view === 'month'
            ? (arg) => {
                return renderMonthDayContent(arg.date);
              }
            : (arg) => {
                return renderTimeGridSlotOverlay(arg);
              }
        }
        dayHeaderContent={
          view === 'month'
            ? (arg) => {
                return renderMonthHeader(arg.date);
              }
            : (arg) => {
                return renderTimeGridHeader(arg.date);
              }
        }
        datesSet={handleDatesSet}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        scrollTime="01:00:00"
        scrollTimeReset={false}
        slotDuration="01:00:00"
        slotLabelInterval="01:00:00"
        slotLabelContent={
          view === 'month'
            ? undefined
            : (arg) => {
                return (
                  <span className="calendar-timegrid-axis-label">
                    {formatEnglishHourLabel(arg.date)}
                  </span>
                );
              }
        }
        allDaySlot={false}
        dayMaxEventRows={view === 'month' ? true : undefined}
        slotEventOverlap={false}
        locale="ko"
      />
    </div>
  );
}
