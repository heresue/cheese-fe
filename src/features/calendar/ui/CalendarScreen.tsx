'use client';

import { useMemo, useState } from 'react';

import { CalendarToolbar } from './toolbar/CalendarToolbar';
import { CalendarCore } from './views/CalendarCore';
import { EventFormModal } from './modal/EventFormModal';
import { CalendarEventPopover } from './popover/CalendarEventPopover';

import type { CalendarEvent, CalendarEventDraft, CalendarView } from '../model/types';
import { mockEvents } from '../model/mock-events';
import { DEFAULT_EVENT_COLOR } from '../model/constants';

type CreatePopoverState = {
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

export default function CalendarScreen() {
  const [view, setView] = useState<CalendarView>('month');
  const [title, setTitle] = useState('2026년 2월');

  const [events, setEvents] = useState<CalendarEvent[]>(() => mockEvents);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<CalendarEventDraft | null>(null);

  const [createPopover, setCreatePopover] = useState<CreatePopoverState | null>(null);

  const closeEditModal = () => {
    setIsEventModalOpen(false);
    setEditDraft(null);
  };

  const closeCreatePopover = () => {
    setCreatePopover(null);
  };

  const openCreatePopover = (payload: { date: string; rect: DOMRect }) => {
    const { rect, date } = payload;

    let x = rect.right + CREATE_POPOVER_GAP;
    let y = rect.top;

    if (x + CREATE_POPOVER_WIDTH > window.innerWidth - 12) {
      x = rect.left - CREATE_POPOVER_WIDTH - CREATE_POPOVER_GAP;
    }

    const cellHeight = rect.height;

    if (y + CREATE_POPOVER_HEIGHT > window.innerHeight - 12) {
      y = rect.top - (CREATE_POPOVER_HEIGHT - cellHeight);
    }

    if (y < 12) {
      y = 12;
    }

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
    setCreatePopover(null);
  };

  const handleUpdateEvent = (nextDraft: CalendarEventDraft) => {
    if (!nextDraft.id) {
      closeEditModal();
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
              colorId: nextDraft.colorId ?? event.colorId,
              reminderMinutes: nextDraft.reminderMinutes,
              location: nextDraft.location,
            }
          : event,
      ),
    );

    closeEditModal();
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
            onClickEvent={(event) => {
              setEditDraft(event as CalendarEventDraft);
              setIsEventModalOpen(true);
            }}
          />
        </section>

        {createPopover && (
          <CalendarEventPopover
            open={true}
            x={createPopover.x}
            y={createPopover.y}
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

        {editDraft && (
          <EventFormModal
            open={isEventModalOpen}
            draft={editDraft}
            onClose={closeEditModal}
            onSubmit={handleUpdateEvent}
          />
        )}
      </div>
    </div>
  );
}
