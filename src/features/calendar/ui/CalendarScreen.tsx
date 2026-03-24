'use client';

import { useState } from 'react';

import { CalendarToolbar } from './toolbar/CalendarToolbar';
import { CalendarCore } from './views/CalendarCore';
import { CalendarEventPopover } from './popover/CalendarEventPopover';

import type { CalendarEvent, CalendarEventDraft, CalendarView } from '../model/types';
import { mockEvents } from '../model/mock-events';
import { DEFAULT_EVENT_COLOR } from '../model/constants';

type PopoverState = {
  x: number;
  y: number;
  draft: CalendarEventDraft;
};

const CREATE_POPOVER_WIDTH = 360;
const CREATE_POPOVER_HEIGHT = 500;
const CREATE_POPOVER_GAP = 8;

function addOneDay(dateString: string) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function getPopoverPosition(rect: DOMRect) {
  let x = rect.right + CREATE_POPOVER_GAP;
  let y = rect.top;

  if (x + CREATE_POPOVER_WIDTH > window.innerWidth - 12) {
    x = rect.left - CREATE_POPOVER_WIDTH - CREATE_POPOVER_GAP;
  }

  const anchorHeight = rect.height;

  if (y + CREATE_POPOVER_HEIGHT > window.innerHeight - 12) {
    y = rect.top - (CREATE_POPOVER_HEIGHT - anchorHeight);
  }

  if (y < 12) {
    y = 12;
  }

  return { x, y };
}

export default function CalendarScreen() {
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

  const openCreatePopover = (payload: { date: string; rect: DOMRect }) => {
    const { rect, date } = payload;
    const { x, y } = getPopoverPosition(rect);

    setEditPopover(null);
    setCreatePopover({
      x,
      y,
      draft: {
        title: '',
        start: date,
        end: addOneDay(date),
        allDay: true,
        colorId: DEFAULT_EVENT_COLOR,
        memo: '',
        location: '',
      },
    });
  };

  const openEditPopover = (payload: { event: Partial<CalendarEventDraft>; rect: DOMRect }) => {
    const { rect, event } = payload;
    const { x, y } = getPopoverPosition(rect);

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
        colorId: event.colorId ?? DEFAULT_EVENT_COLOR,
        memo: event.memo ?? '',
        location: event.location ?? '',
        reminderMinutes: event.reminderMinutes,
        spaceId: event.spaceId,
      },
    });
  };

  const handleCreateEvent = () => {
    if (!createPopover) return;

    const draft = createPopover.draft;
    if (!draft.title?.trim()) return;

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      start: draft.start,
      end: draft.end,
      allDay: true,
      memo: draft.memo,
      spaceId: draft.spaceId,
      colorId: draft.colorId ?? DEFAULT_EVENT_COLOR,
      reminderMinutes: draft.reminderMinutes,
      location: draft.location,
    };

    setEvents((prev) => [...prev, newEvent]);
    closeCreatePopover();
  };

  const handleUpdateEvent = () => {
    if (!editPopover?.draft.id) {
      closeEditPopover();
      return;
    }

    const nextDraft = editPopover.draft;

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
              colorId: nextDraft.colorId ?? event.colorId,
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
      <div className="flex h-full min-h-0 w-full flex-col bg-[var(--color-bg-surface)]">
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
            onTitleChange={setTitle}
            onClickDateCell={({ date, rect }) => {
              openCreatePopover({ date, rect });
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
