'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  applyDraftToEvent,
  createCalendarEventFromDraft,
  hasTimedSlotConflict,
} from '../_lib/event-mapper';
import { mockEvents } from '../_model/mock-events';
import type { CalendarEvent, CalendarEventDraft } from '../_model/types';

const CALENDAR_STORAGE_KEY = 'cheese:calendar-events:v1';

type CalendarStoreContextValue = {
  events: CalendarEvent[];
  createEvent: (draft: CalendarEventDraft) => boolean;
  updateEvent: (draft: CalendarEventDraft) => boolean;
  deleteEvent: (eventId: string) => void;
};

const CalendarStoreContext = createContext<CalendarStoreContextValue | null>(null);

function createEventId() {
  if (typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `evt-${Date.now()}`;
}

function getInitialEvents() {
  return mockEvents;
}

function readStoredEvents() {
  try {
    const storedEvents = window.localStorage.getItem(CALENDAR_STORAGE_KEY);

    if (!storedEvents) {
      return null;
    }

    const parsedEvents = JSON.parse(storedEvents);

    if (!Array.isArray(parsedEvents)) {
      return null;
    }

    if (parsedEvents.length === 0) {
      return null;
    }

    return parsedEvents as CalendarEvent[];
  } catch {
    return null;
  }
}

function writeStoredEvents(events: CalendarEvent[]) {
  try {
    window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage 저장 실패는 UI 동작을 막지 않음
  }
}

export function CalendarStoreProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(getInitialEvents);
  const storageReadyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const timerId = window.setTimeout(() => {
      if (cancelled) return;

      const storedEvents = readStoredEvents();

      if (storedEvents) {
        setEvents(storedEvents);
      }

      storageReadyRef.current = true;
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (!storageReadyRef.current) return;

    writeStoredEvents(events);
  }, [events]);

  const createEvent = useCallback((draft: CalendarEventDraft) => {
    const newEvent = createCalendarEventFromDraft(draft, createEventId());

    if (!newEvent) {
      return false;
    }

    let created = false;

    setEvents((prevEvents) => {
      if (hasTimedSlotConflict(prevEvents, newEvent)) {
        return prevEvents;
      }

      created = true;
      return [...prevEvents, newEvent];
    });

    return created;
  }, []);

  const updateEvent = useCallback((draft: CalendarEventDraft) => {
    const editingEventId = draft.id;

    if (!editingEventId) {
      return false;
    }

    let updated = false;

    setEvents((prevEvents) => {
      const currentEvent = prevEvents.find((event) => event.id === editingEventId);

      if (!currentEvent) {
        return prevEvents;
      }

      const nextEvent = applyDraftToEvent(currentEvent, draft);

      if (!nextEvent) {
        return prevEvents;
      }

      if (hasTimedSlotConflict(prevEvents, nextEvent, nextEvent.id)) {
        return prevEvents;
      }

      updated = true;

      return prevEvents.map((event) => (event.id === nextEvent.id ? nextEvent : event));
    });

    return updated;
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  }, []);

  const value = useMemo(
    () => ({
      events,
      createEvent,
      updateEvent,
      deleteEvent,
    }),
    [events, createEvent, updateEvent, deleteEvent],
  );

  return <CalendarStoreContext.Provider value={value}>{children}</CalendarStoreContext.Provider>;
}

export function useCalendarStore() {
  const context = useContext(CalendarStoreContext);

  if (!context) {
    throw new Error('useCalendarStore must be used within CalendarStoreProvider');
  }

  return context;
}
