'use client';

import { useMemo, useState } from 'react';

import { CalendarToolbar } from './toolbar/CalendarToolbar';
import { CalendarCore } from './views/CalendarCore';
import { EventFormModal } from './modal/EventFormModal';

import type { CalendarEvent, CalendarEventDraft, CalendarView } from '../model/types';
import { mockEvents } from '../model/mock-events';
import { DEFAULT_EVENT_COLOR } from '../model/constants';

export default function CalendarScreen() {
  const [view, setView] = useState<CalendarView>('month');
  const [title, setTitle] = useState('2026년 2월');

  const events = useMemo<CalendarEvent[]>(() => mockEvents, []);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarEventDraft | null>(null);

  const openCreateModal = (nextDraft?: Partial<CalendarEventDraft>) => {
    setDraft({
      title: '',
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      colorId: DEFAULT_EVENT_COLOR,
      ...nextDraft,
    });
    setIsEventModalOpen(true);
  };

  const closeModal = () => {
    setIsEventModalOpen(false);
    setDraft(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 bg-[var(--color-bg)] p-4">
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

      <section className="flex min-h-[720px] flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <CalendarCore
          view={view}
          events={events}
          onTitleChange={setTitle}
          onSelectSlot={(slot) => {
            openCreateModal({
              start: slot.start,
              end: slot.end,
              allDay: slot.allDay,
            });
          }}
          onClickEvent={(event) => {
            openCreateModal(event);
          }}
        />
      </section>

      {draft && (
        <EventFormModal
          open={isEventModalOpen}
          draft={draft}
          onClose={closeModal}
          onSubmit={(nextDraft) => {
            console.log('submit', nextDraft);
            closeModal();
          }}
        />
      )}
    </div>
  );
}
