'use client';

import { useRef, useState } from 'react';

import { CalendarEventPopover } from './popover/CalendarEventPopover';
import { CalendarToolbar } from './toolbar/CalendarToolbar';
import { CalendarCore } from './views/CalendarCore';

import {
  addDaysToCalendarDate,
  addHoursToCalendarDateTime,
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
const CREATE_POPOVER_HEIGHT = 455;
const CREATE_POPOVER_GAP = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPopoverPosition(
  rect: DOMRect,
  options?: {
    placement?: 'auto' | 'cell-center';
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

  if (options?.placement === 'cell-center') {
    const centeredX = rect.left + rect.width / 2 - CREATE_POPOVER_WIDTH / 2;
    const hasSpaceAbove = rect.top - CREATE_POPOVER_HEIGHT - CREATE_POPOVER_GAP >= minY;
    const hasSpaceBelow = rect.bottom + CREATE_POPOVER_HEIGHT + CREATE_POPOVER_GAP <= maxY + 12;
    const anchoredY =
      hasSpaceAbove || !hasSpaceBelow
        ? rect.top - CREATE_POPOVER_HEIGHT - CREATE_POPOVER_GAP
        : rect.bottom + CREATE_POPOVER_GAP;

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

  const openCreatePopover = (payload: {
    draft: CalendarEventDraft;
    rect: DOMRect;
    placement?: 'auto' | 'cell-center';
  }) => {
    const { rect, draft, placement } = payload;
    const { x, y } = getPopoverPosition(rect, {
      placement: placement ?? 'auto',
      boundsRect: getViewportBounds(),
    });

    setEditPopover(null);
    setCreatePopover({
      x,
      y,
      draft: (() => {
        return {
          title: draft.title ?? '',
          start: draft.start,
          end: draft.end,
          allDay: draft.allDay ?? true,
          colorId: draft.colorId,
          memo: draft.memo ?? '',
          location: draft.location ?? '',
          reminderMinutes: draft.reminderMinutes,
          spaceId: draft.spaceId,
        };
      })(),
    });
  };

  const openEditPopover = (payload: { event: Partial<CalendarEventDraft>; rect: DOMRect }) => {
    const { rect, event } = payload;
    const { x, y } = getPopoverPosition(rect, {
      placement: view === 'day' ? 'cell-center' : 'auto',
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
    if (!nextDraft?.title?.trim()) {
      closeCreatePopover();
      return;
    }

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
              title: nextDraft.title?.trim() || event.title,
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

  const handleDeleteEventById = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setEditPopover((prev) => {
      if (!prev || prev.draft.id !== eventId) return prev;
      return null;
    });
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
            onClickDateCell={({ draft, rect, placement }) => {
              openCreatePopover({ draft, rect, placement });
            }}
            onClickEvent={({ event, rect }) => {
              openEditPopover({ event, rect });
            }}
            onDeleteEvent={handleDeleteEventById}
          />
        </section>

        {createPopover && (
          <CalendarEventPopover
            open={true}
            x={createPopover.x}
            y={createPopover.y}
            draft={createPopover.draft}
            onClose={closeCreatePopover}
            onCommit={handleCreateEvent}
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
            draft={editPopover.draft}
            onClose={closeEditPopover}
            onCommit={handleUpdateEvent}
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
