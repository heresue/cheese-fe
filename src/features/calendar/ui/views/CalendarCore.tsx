'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import type {
  CalendarApi,
  DateSelectArg,
  DatesSetArg,
  DayCellContentArg,
  EventApi,
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core';

import {
  addDaysToCalendarDate,
  addHoursToCalendarDateTime,
  formatCalendarTitle,
  formatEnglishHourLabel,
  formatKoreanWeekday,
  isSameCalendarDate,
  normalizeCalendarValue,
  parseCalendarDate,
} from '../../lib/date';
import { getEventColorTokens } from '../../model/constants';
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
  selectedEventId?: string;
  onTitleChange?: (title: string) => void;
  onSelectSlot?: (slot: CalendarSlot) => void;
  onClickEvent?: (payload: { event: Partial<CalendarEventDraft>; rect: DOMRect }) => void;
  onDeleteEvent?: (eventId: string) => void;
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

type VisibleDateRange = {
  start: Date;
  end: Date;
};

type CalendarRenderEventExtendedProps = Partial<CalendarEventDraft> & {
  sourceEventId?: string;
  sourceStart?: string;
  sourceEnd?: string;
  sourceAllDay?: boolean;
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
const ALL_DAY_CHIP_HEIGHT = 22;
const ALL_DAY_CHIP_GAP = 4;
const ALL_DAY_SECTION_VERTICAL_PADDING = 8;
const ALL_DAY_SECTION_MIN_ROWS = 1;
const ALL_DAY_SECTION_MAX_ROWS = 3;
const MONTH_MAX_VISIBLE_EVENT_ROWS = 5;
const ALL_DAY_SECTION_HEIGHT = getAllDaySectionHeight(ALL_DAY_SECTION_MIN_ROWS);

function startOfCalendarDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAllDayEventEndDate(event: Pick<CalendarEvent, 'start' | 'end'>) {
  const startDate = parseCalendarDate(event.start);
  if (!startDate) return null;

  const endDate = parseCalendarDate(event.end);
  if (endDate && endDate > startDate) {
    return startOfCalendarDay(endDate);
  }

  const fallbackEnd = parseCalendarDate(addDaysToCalendarDate(event.start, 1));
  return fallbackEnd ? startOfCalendarDay(fallbackEnd) : null;
}

function getVisibleChipStackHeight(rowCount: number) {
  const visibleRows = Math.max(Math.ceil(rowCount), 1);
  const gapCount = Math.max(visibleRows - 1, 0);

  return visibleRows * ALL_DAY_CHIP_HEIGHT + gapCount * ALL_DAY_CHIP_GAP;
}

function getAllDaySectionHeight(rowCount: number) {
  const visibleRows = Math.min(
    Math.max(rowCount, ALL_DAY_SECTION_MIN_ROWS),
    ALL_DAY_SECTION_MAX_ROWS,
  );

  return ALL_DAY_SECTION_VERTICAL_PADDING + getVisibleChipStackHeight(visibleRows);
}

function countVisibleAllDayRows(events: CalendarEvent[], range: VisibleDateRange | null) {
  const counts = new Map<string, number>();
  let maxRows = 0;

  const visibleStart = range ? startOfCalendarDay(range.start) : null;
  const visibleEnd = range ? startOfCalendarDay(range.end) : null;

  events.forEach((event) => {
    if (!event.allDay) return;

    const startDate = parseCalendarDate(event.start);
    const endDate = getAllDayEventEndDate(event);

    if (!startDate || !endDate) return;

    const eventStart = startOfCalendarDay(startDate);
    const renderStart = visibleStart && eventStart < visibleStart ? visibleStart : eventStart;
    const renderEnd = visibleEnd && endDate > visibleEnd ? visibleEnd : endDate;

    if (renderEnd <= renderStart) return;

    for (
      let cursor = new Date(renderStart.getTime());
      cursor < renderEnd;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const dateKey = normalizeCalendarValue(cursor, { allDay: true });
      if (!dateKey) continue;

      const nextCount = (counts.get(dateKey) ?? 0) + 1;
      counts.set(dateKey, nextCount);
      maxRows = Math.max(maxRows, nextCount);
    }
  });

  return Math.max(maxRows, ALL_DAY_SECTION_MIN_ROWS);
}

function createCalendarEventInput(
  event: CalendarEvent,
  overrides?: {
    id?: string;
    start?: string;
    end?: string;
    allDay?: boolean;
  },
): EventInput {
  return {
    id: overrides?.id ?? event.id,
    title: event.title,
    start: overrides?.start ?? event.start,
    end: overrides?.end ?? event.end,
    allDay: overrides?.allDay ?? event.allDay,
    extendedProps: {
      memo: event.memo,
      spaceId: event.spaceId,
      colorId: event.colorId,
      reminderMinutes: event.reminderMinutes,
      location: event.location,
      sourceEventId: event.id,
      sourceStart: event.start,
      sourceEnd: event.end,
      sourceAllDay: Boolean(event.allDay),
    } satisfies CalendarRenderEventExtendedProps,
  };
}

function splitAllDayEventByDay(event: CalendarEvent, range: VisibleDateRange | null) {
  if (!event.allDay) {
    return [createCalendarEventInput(event)];
  }

  const startDate = parseCalendarDate(event.start);
  const endDate = getAllDayEventEndDate(event);

  if (!startDate || !endDate) {
    return [createCalendarEventInput(event)];
  }

  const visibleStart = range ? startOfCalendarDay(range.start) : startOfCalendarDay(startDate);
  const visibleEnd = range ? startOfCalendarDay(range.end) : endDate;
  const renderStart =
    startOfCalendarDay(startDate) > visibleStart ? startOfCalendarDay(startDate) : visibleStart;
  const renderEnd = endDate < visibleEnd ? endDate : visibleEnd;

  if (renderEnd <= renderStart) {
    return [];
  }

  const renderedEvents: EventInput[] = [];

  for (
    let cursor = new Date(renderStart.getTime());
    cursor < renderEnd;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const dateKey = normalizeCalendarValue(cursor, { allDay: true });
    if (!dateKey) continue;

    renderedEvents.push(
      createCalendarEventInput(event, {
        id: `${event.id}__allday__${dateKey}`,
        start: dateKey,
        end: addDaysToCalendarDate(dateKey, 1),
        allDay: true,
      }),
    );
  }

  return renderedEvents;
}

function getRenderedEventSource(event: EventApi) {
  const ext = event.extendedProps as CalendarRenderEventExtendedProps;
  const sourceAllDay = ext.sourceAllDay ?? event.allDay;

  return {
    sourceId: ext.sourceEventId ?? event.id,
    sourceStart: ext.sourceStart ?? normalizeCalendarValue(event.start, { allDay: sourceAllDay }),
    sourceEnd:
      ext.sourceEnd ?? normalizeCalendarValue(event.end ?? event.start, { allDay: sourceAllDay }),
    sourceAllDay,
  };
}

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

function isCalendarDateWithinRange(date: Date, start: Date, end: Date) {
  const time = date.getTime();

  return time >= start.getTime() && time < end.getTime();
}

export function CalendarCore({
  view,
  events,
  selectedEventId,
  onTitleChange,
  onSelectSlot,
  onClickEvent,
  onDeleteEvent,
  onClickDateCell,
}: CalendarCoreProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const rafRef = useRef<number | null>(null);
  const viewSyncRafRef = useRef<number | null>(null);

  const [now, setNow] = useState(() => new Date());
  const [monthLayout, setMonthLayout] = useState<MonthLayoutState>(DEFAULT_MONTH_LAYOUT);
  const [timeGridScrollbarWidth, setTimeGridScrollbarWidth] = useState(0);
  const [visibleRange, setVisibleRange] = useState<VisibleDateRange | null>(null);
  const today = now;

  const fcEvents = useMemo<EventInput[]>(() => {
    if (view === 'month') {
      return events.flatMap((event) => splitAllDayEventByDay(event, visibleRange));
    }

    return events.flatMap((event) => splitAllDayEventByDay(event, visibleRange));
  }, [events, view, visibleRange]);

  const allDaySectionHeight = useMemo(() => {
    if (view === 'month') {
      return ALL_DAY_SECTION_HEIGHT;
    }

    return getAllDaySectionHeight(countVisibleAllDayRows(events, visibleRange));
  }, [events, visibleRange, view]);

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
    const monthScrollGrid = monthViewEl?.querySelector('.fc-scrollgrid');
    const monthHeader = monthViewEl?.querySelector('.fc-col-header');
    const monthBody = monthViewEl?.querySelector('.fc-daygrid-body');
    const monthBodyScroller =
      monthBody instanceof HTMLElement ? monthBody.closest('.fc-scroller') : null;
    const weekRows = monthViewEl?.querySelectorAll('.fc-daygrid-body tbody tr');

    if (
      !(monthViewEl instanceof HTMLElement) ||
      !(monthBody instanceof HTMLElement) ||
      !(monthBodyScroller instanceof HTMLElement) ||
      !weekRows ||
      weekRows.length === 0
    ) {
      return;
    }

    const weekCount = weekRows.length;
    const monthViewHeight = monthViewEl.getBoundingClientRect().height;
    const scrollGridHeight =
      monthScrollGrid instanceof HTMLElement ? monthScrollGrid.getBoundingClientRect().height : 0;
    const headerHeight =
      monthHeader instanceof HTMLElement ? monthHeader.getBoundingClientRect().height : 0;
    const bodyViewportHeight = Math.max(monthViewHeight, scrollGridHeight) - headerHeight;

    if (bodyViewportHeight <= 0) return;

    const rowHeight = Math.round((bodyViewportHeight / 4) * 100) / 100;
    const density: MonthDensity =
      rowHeight >= MONTH_MIN_ROW_HEIGHT.comfortable ? 'comfortable' : 'compact';

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
    const timeGridBody = timeGridViewEl?.querySelector('.fc-timegrid-body');
    const bodyScroller =
      timeGridBody instanceof HTMLElement ? timeGridBody.closest('.fc-scroller') : null;

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
    const clickTarget = arg.jsEvent.target as HTMLElement | null;
    if (clickTarget?.closest('[data-calendar-event-delete]')) return;

    const ext = arg.event.extendedProps as CalendarRenderEventExtendedProps;
    const sourceEvent = getRenderedEventSource(arg.event);

    onClickEvent?.({
      rect: arg.el.getBoundingClientRect(),
      event: {
        id: sourceEvent.sourceId,
        title: arg.event.title ?? '',
        start: sourceEvent.sourceStart,
        end: sourceEvent.sourceEnd,
        allDay: sourceEvent.sourceAllDay,
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

    if (!dateKey) return;
    if (view !== 'month' && !arg.allDay) return;

    onClickDateCell?.({
      rect,
      draft: {
        title: '',
        start: dateKey,
        end: addDaysToCalendarDate(dateKey, 1),
        allDay: true,
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

    setVisibleRange({
      start: new Date(arg.start.getTime()),
      end: new Date(arg.end.getTime()),
    });

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
    const ext = arg.event.extendedProps as CalendarRenderEventExtendedProps;
    const sourceEvent = getRenderedEventSource(arg.event);

    const monthEvent: CalendarEvent = {
      id: sourceEvent.sourceId,
      title: arg.event.title,
      start: sourceEvent.sourceStart,
      end: sourceEvent.sourceEnd,
      allDay: sourceEvent.sourceAllDay,
      memo: ext.memo,
      spaceId: ext.spaceId,
      colorId: ext.colorId,
      reminderMinutes: ext.reminderMinutes,
      location: ext.location,
    };

    return (
      <MonthEventChip
        event={monthEvent}
        onDelete={
          onDeleteEvent
            ? () => {
                onDeleteEvent(sourceEvent.sourceId);
              }
            : undefined
        }
      />
    );
  };

  const renderTimeGridEventContent = (arg: EventContentArg) => {
    const ext = arg.event.extendedProps as CalendarRenderEventExtendedProps;
    const sourceEvent = getRenderedEventSource(arg.event);
    const color = getEventColorTokens(ext.colorId);

    const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onDeleteEvent?.(sourceEvent.sourceId);
    };

    return (
      <div
        className="calendar-event-chip calendar-event-chip--timegrid"
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
        <span className="calendar-event-chip__title">{arg.event.title}</span>

        <button
          type="button"
          data-calendar-event-delete
          onMouseDown={handleDelete}
          onClick={handleDelete}
          className="calendar-event-chip__delete"
          aria-label="일정 삭제"
        >
          <svg viewBox="0 0 20 20" fill="none" className="calendar-event-chip__delete-icon">
            <path
              d="M6 6L14 14M14 6L6 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
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

  const handleAllDayDidMount = useCallback((arg: { el: HTMLElement }) => {
    arg.el.setAttribute('data-calendar-all-day-axis', 'true');

    const section = arg.el.closest('.fc-scrollgrid-section');
    if (!(section instanceof HTMLElement)) return;

    section.setAttribute('data-calendar-all-day-section', 'true');
  }, []);

  const getEventClassNames = useCallback(
    (arg: EventContentArg) => {
      const isAllDayEvent = view === 'month' || arg.event.allDay;
      const sourceEvent = getRenderedEventSource(arg.event);

      return [
        'calendar-event',
        isAllDayEvent ? 'calendar-event--month' : 'calendar-event--timegrid',
        sourceEvent.sourceId === selectedEventId ? 'calendar-event--selected' : '',
      ].filter(Boolean);
    },
    [selectedEventId, view],
  );

  const calendarStyle = useMemo(() => {
    return {
      '--calendar-month-day-height': `${monthLayout.rowHeight}px`,
      '--calendar-month-week-count': `${monthLayout.weekCount}`,
      '--calendar-scrollbar-width': `${monthLayout.scrollbarWidth}px`,
      '--calendar-time-slot-height': `${TIMEGRID_SLOT_HEIGHT}px`,
      '--calendar-timegrid-scrollbar-width': `${timeGridScrollbarWidth}px`,
      '--calendar-allday-section-height': `${allDaySectionHeight}px`,
      '--calendar-month-max-visible-events-height': `${getVisibleChipStackHeight(MONTH_MAX_VISIBLE_EVENT_ROWS)}px`,
    } as CSSProperties;
  }, [
    allDaySectionHeight,
    monthLayout.rowHeight,
    monthLayout.scrollbarWidth,
    monthLayout.weekCount,
    timeGridScrollbarWidth,
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 15_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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
    if (view === 'month') return;
    scheduleLayoutSync();
  }, [allDaySectionHeight, scheduleLayoutSync, view]);

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
        now={now}
        expandRows={view !== 'month'}
        fixedWeekCount={false}
        nowIndicator={view !== 'month'}
        nowIndicatorSnap={false}
        selectable={Boolean(onSelectSlot)}
        selectMirror={Boolean(onSelectSlot)}
        unselectAuto
        select={handleSelect}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={(arg) => {
          return view === 'month' || arg.event.allDay
            ? renderMonthEventContent(arg)
            : renderTimeGridEventContent(arg);
        }}
        eventClassNames={getEventClassNames}
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
                const isActiveHour =
                  isCalendarDateWithinRange(now, arg.view.activeStart, arg.view.activeEnd) &&
                  arg.date.getHours() === now.getHours();

                return (
                  <span
                    className={
                      isActiveHour
                        ? 'calendar-timegrid-axis-label calendar-timegrid-axis-label--active'
                        : 'calendar-timegrid-axis-label'
                    }
                  >
                    {formatEnglishHourLabel(arg.date)}
                  </span>
                );
              }
        }
        allDaySlot={view !== 'month'}
        allDayText="종일 일정"
        allDayClassNames={
          view === 'month'
            ? undefined
            : () => {
                return ['calendar-timegrid-allday-axis-cell'];
              }
        }
        allDayContent={
          view === 'month'
            ? undefined
            : (arg) => {
                return <span className="calendar-timegrid-allday-label">{arg.text}</span>;
              }
        }
        allDayDidMount={view === 'month' ? undefined : handleAllDayDidMount}
        dayMaxEvents={false}
        dayMaxEventRows={false}
        slotEventOverlap={false}
        locale="ko"
      />
    </div>
  );
}
