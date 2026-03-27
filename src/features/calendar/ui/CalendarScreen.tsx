'use client';

import { useRef, useState } from 'react';

import { CalendarEventPopover } from './popover/CalendarEventPopover';
import { CalendarToolbar } from './toolbar/CalendarToolbar';
import { CalendarCore } from './views/CalendarCore';

import {
  addDaysToCalendarDate,
  addHoursToCalendarDateTime,
  combineDateAndTime,
  formatCalendarDate,
  formatCalendarDateTime,
  hasTimePart,
  parseCalendarDate,
} from '../lib/date';
import { mockEvents } from '../model/mock-events';
import type { CalendarEvent, CalendarEventDraft, CalendarView } from '../model/types';

type PopoverState = {
  x: number;
  y: number;
  draft: CalendarEventDraft;
};

const CREATE_POPOVER_WIDTH = 320;
const CREATE_POPOVER_HEIGHT = 520;
const CREATE_POPOVER_GAP = 8;

const MONTH_POPOVER_DEFAULT_START_TIME = '09:00';
const MONTH_POPOVER_DEFAULT_END_TIME = '10:00';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPopoverPosition(
  rect: DOMRect,
  options?: {
    placement?: 'auto' | 'timegrid-center';
    boundsRect?: DOMRect | null;
  },
) {
  const boundsRect = options?.boundsRect ?? null;
  const minX = Math.max((boundsRect?.left ?? 0) + 12, 12);
  const maxX =
    Math.min(boundsRect?.right ?? window.innerWidth, window.innerWidth) - CREATE_POPOVER_WIDTH - 12;
  const minY = Math.max((boundsRect?.top ?? 0) + 12, 12);
  const maxY =
    Math.min(boundsRect?.bottom ?? window.innerHeight, window.innerHeight) -
    CREATE_POPOVER_HEIGHT -
    12;

  if (options?.placement === 'timegrid-center') {
    const centeredX = rect.left + rect.width / 2 - CREATE_POPOVER_WIDTH / 2;
    const anchoredY = rect.top - 8;

    return {
      x: clamp(centeredX, minX, Math.max(minX, maxX)),
      y: clamp(anchoredY, minY, Math.max(minY, maxY)),
    };
  }

  let x = rect.right + CREATE_POPOVER_GAP;
  let y = rect.top;

  if (x + CREATE_POPOVER_WIDTH > (boundsRect?.right ?? window.innerWidth) - 12) {
    x = rect.left - CREATE_POPOVER_WIDTH - CREATE_POPOVER_GAP;
  }

  x = clamp(x, minX, Math.max(minX, maxX));

  const anchorHeight = rect.height;

  if (y + CREATE_POPOVER_HEIGHT > (boundsRect?.bottom ?? window.innerHeight) - 12) {
    y = rect.top - (CREATE_POPOVER_HEIGHT - anchorHeight);
  }

  y = clamp(y, minY, Math.max(minY, maxY));

  return { x, y };
}

function getTimedSlotKey(value?: string) {
  return formatCalendarDateTime(value, { seconds: false });
}

function hasTimedSlotConflict(
  events: CalendarEvent[],
  draft: CalendarEventDraft,
  excludeEventId?: string,
) {
  if (draft.allDay) return false;

  const slotKey = getTimedSlotKey(draft.start);
  if (!slotKey) return false;

  return events.some((event) => {
    if (event.id === excludeEventId) return false;
    if (event.allDay) return false;

    return getTimedSlotKey(event.start) === slotKey;
  });
}

function normalizeDraftForSave(draft: CalendarEventDraft) {
  const isAllDay = draft.allDay ?? !hasTimePart(draft.start);

  if (isAllDay) {
    const normalizedStart = formatCalendarDate(draft.start);
    if (!normalizedStart) return null;

    const normalizedEndCandidate =
      formatCalendarDate(draft.end) || addDaysToCalendarDate(normalizedStart, 1);
    const startDate = parseCalendarDate(normalizedStart);
    const endDate = parseCalendarDate(normalizedEndCandidate);

    const normalizedEnd =
      startDate && endDate && endDate > startDate
        ? normalizedEndCandidate
        : addDaysToCalendarDate(normalizedStart, 1);

    return {
      ...draft,
      start: normalizedStart,
      end: normalizedEnd,
      allDay: true,
    } satisfies CalendarEventDraft;
  }

  const normalizedStart = formatCalendarDateTime(draft.start);
  if (!normalizedStart) return null;

  const normalizedEndCandidate =
    formatCalendarDateTime(draft.end) || addHoursToCalendarDateTime(normalizedStart, 1);
  const startDate = parseCalendarDate(normalizedStart);
  const endDate = parseCalendarDate(normalizedEndCandidate);
  const normalizedEnd =
    startDate && endDate && endDate > startDate
      ? normalizedEndCandidate
      : addHoursToCalendarDateTime(normalizedStart, 1);

  return {
    ...draft,
    start: normalizedStart,
    end: normalizedEnd,
    allDay: false,
  } satisfies CalendarEventDraft;
}

function normalizeMonthCreateDraft(draft: CalendarEventDraft) {
  const startDate = formatCalendarDate(draft.start);
  if (!startDate) return draft;

  const start = hasTimePart(draft.start)
    ? formatCalendarDateTime(draft.start)
    : combineDateAndTime(startDate, MONTH_POPOVER_DEFAULT_START_TIME);

  const displayEndDate = hasTimePart(draft.end)
    ? formatCalendarDate(draft.end) || startDate
    : addDaysToCalendarDate(
        formatCalendarDate(draft.end) || addDaysToCalendarDate(startDate, 1),
        -1,
      ) || startDate;

  const end = hasTimePart(draft.end)
    ? formatCalendarDateTime(draft.end)
    : combineDateAndTime(displayEndDate, MONTH_POPOVER_DEFAULT_END_TIME);

  return {
    ...draft,
    start: start || draft.start,
    end: end || addHoursToCalendarDateTime(start || draft.start, 1),
    allDay: false,
  } satisfies CalendarEventDraft;
}

export default function CalendarScreen() {
  const screenRef = useRef<HTMLDivElement | null>(null);

  const [view, setView] = useState<CalendarView>('month');
  const [title, setTitle] = useState('2026년 2월');
  const [events, setEvents] = useState<CalendarEvent[]>(() => mockEvents);

  const [createPopover, setCreatePopover] = useState<PopoverState | null>(null);
  const [editPopover, setEditPopover] = useState<PopoverState | null>(null);

  const closeCreatePopover = () => {
    setCreatePopover(null);
  };

  const closeEditPopover = () => {
    setEditPopover(null);
  };

  const getViewportBounds = () => {
    return screenRef.current?.getBoundingClientRect() ?? null;
  };

  const openCreatePopover = (payload: { draft: CalendarEventDraft; rect: DOMRect }) => {
    const { rect, draft } = payload;
    const { x, y } = getPopoverPosition(rect, {
      placement: view === 'month' ? 'auto' : 'timegrid-center',
      boundsRect: getViewportBounds(),
    });

    setEditPopover(null);
    setCreatePopover({
      x,
      y,
      draft: (() => {
        const normalizedDraft = view === 'month' ? normalizeMonthCreateDraft(draft) : draft;

        return {
          title: normalizedDraft.title ?? '',
          start: normalizedDraft.start,
          end: normalizedDraft.end,
          allDay: normalizedDraft.allDay ?? true,
          colorId: normalizedDraft.colorId,
          memo: normalizedDraft.memo ?? '',
          location: normalizedDraft.location ?? '',
          reminderMinutes: normalizedDraft.reminderMinutes,
          spaceId: normalizedDraft.spaceId,
        };
      })(),
    });
  };

  const openEditPopover = (payload: { event: Partial<CalendarEventDraft>; rect: DOMRect }) => {
    const { rect, event } = payload;
    const { x, y } = getPopoverPosition(rect, {
      placement: view === 'month' ? 'auto' : 'timegrid-center',
      boundsRect: getViewportBounds(),
    });

    setCreatePopover(null);
    setEditPopover({
      x,
      y,
      draft: {
        id: event.id,
        title: event.title ?? '',
        start: event.start ?? '',
        end: event.end ?? event.start ?? '',
        allDay: event.allDay ?? true,
        colorId: event.colorId,
        memo: event.memo ?? '',
        location: event.location ?? '',
        reminderMinutes: event.reminderMinutes,
        spaceId: event.spaceId,
      },
    });
  };

  const handleCreateEvent = () => {
    if (!createPopover) return;

    const nextDraft = normalizeDraftForSave(createPopover.draft);
    if (!nextDraft?.title?.trim()) return;

    if (hasTimedSlotConflict(events, nextDraft)) {
      window.alert('해당 시간 칸에는 이미 일정이 있습니다.');
      return;
    }

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: nextDraft.title.trim(),
      start: nextDraft.start,
      end: nextDraft.end,
      allDay: nextDraft.allDay ?? true,
      memo: nextDraft.memo,
      spaceId: nextDraft.spaceId,
      colorId: nextDraft.colorId,
      reminderMinutes: nextDraft.reminderMinutes,
      location: nextDraft.location,
    };

    setEvents((prev) => [...prev, newEvent]);
    closeCreatePopover();
  };

  const handleUpdateEvent = () => {
    if (!editPopover?.draft.id) {
      closeEditPopover();
      return;
    }

    const nextDraft = normalizeDraftForSave(editPopover.draft);
    if (!nextDraft) {
      closeEditPopover();
      return;
    }

    if (hasTimedSlotConflict(events, nextDraft, nextDraft.id)) {
      window.alert('해당 시간 칸에는 이미 일정이 있습니다.');
      return;
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === nextDraft.id
          ? {
              ...event,
              title: nextDraft.title ?? event.title,
              start: nextDraft.start ?? event.start,
              end: nextDraft.end ?? event.end,
              allDay: nextDraft.allDay ?? event.allDay,
              memo: nextDraft.memo,
              spaceId: nextDraft.spaceId,
              colorId: nextDraft.colorId,
              reminderMinutes: nextDraft.reminderMinutes,
              location: nextDraft.location,
            }
          : event,
      ),
    );

    closeEditPopover();
  };

  const handleDeleteEvent = () => {
    if (!editPopover?.draft.id) {
      closeEditPopover();
      return;
    }

    setEvents((prev) => prev.filter((event) => event.id !== editPopover.draft.id));
    closeEditPopover();
  };

  return (
    <div className="flex h-full min-h-0 bg-[var(--color-bg)]">
      <div
        ref={screenRef}
        className="flex h-full min-h-0 w-full flex-col bg-[var(--color-bg-surface)]"
      >
        <div className="shrink-0 pt-[83px]">
          <CalendarToolbar
            view={view}
            title={title}
            onChangeView={setView}
            onClickToday={() => {
              window.dispatchEvent(new CustomEvent('calendar:today'));
            }}
            onClickPrev={() => {
              window.dispatchEvent(new CustomEvent('calendar:prev'));
            }}
            onClickNext={() => {
              window.dispatchEvent(new CustomEvent('calendar:next'));
            }}
          />
        </div>

        <section
          className={
            view === 'month'
              ? 'h-[calc(100dvh-147px)] min-h-0 overflow-hidden bg-[var(--color-bg-surface)]'
              : 'min-h-0 flex-1 overflow-hidden bg-[var(--color-bg-surface)]'
          }
        >
          <CalendarCore
            view={view}
            events={events}
            selectedEventId={editPopover?.draft.id}
            onTitleChange={setTitle}
            onClickDateCell={({ draft, rect }) => {
              openCreatePopover({ draft, rect });
            }}
            onClickEvent={({ event, rect }) => {
              openEditPopover({ event, rect });
            }}
          />
        </section>

        {createPopover && (
          <CalendarEventPopover
            open={true}
            x={createPopover.x}
            y={createPopover.y}
            mode="create"
            draft={createPopover.draft}
            onClose={closeCreatePopover}
            onSave={handleCreateEvent}
            onChangeDraft={(nextDraft) => {
              setCreatePopover((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  draft: nextDraft,
                };
              });
            }}
          />
        )}

        {editPopover && (
          <CalendarEventPopover
            open={true}
            x={editPopover.x}
            y={editPopover.y}
            mode="edit"
            draft={editPopover.draft}
            onClose={closeEditPopover}
            onSave={handleUpdateEvent}
            onDelete={handleDeleteEvent}
            onChangeDraft={(nextDraft) => {
              setEditPopover((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  draft: nextDraft,
                };
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
