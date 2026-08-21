'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
} from '@/api/calendar.api';
import { ApiError } from '@/api/client';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';

import {
  applyDraftToEvent,
  createCalendarEventFromDraft,
  hasTimedSlotConflict,
} from '../_lib/event-mapper';
import type { CalendarEvent, CalendarEventDraft } from '../_model/types';

type CalendarMutationStatus =
  | 'success'
  | 'invalid'
  | 'conflict'
  | 'not-found'
  | 'loading'
  | 'error';
type CalendarDeleteStatus = 'success' | 'not-found' | 'loading' | 'error';

type CalendarStoreContextValue = {
  events: CalendarEvent[];
  isLoading: boolean;
  errorMessage: string | null;
  createEvent: (draft: CalendarEventDraft) => Promise<CalendarMutationStatus>;
  updateEvent: (draft: CalendarEventDraft) => Promise<CalendarMutationStatus>;
  deleteEvent: (eventId: string) => Promise<CalendarDeleteStatus>;
};

const CalendarStoreContext = createContext<CalendarStoreContextValue | null>(null);

function getCalendarErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function CalendarStoreProvider({ children }: { children: ReactNode }) {
  const {
    data: currentUser,
    error: currentUserError,
    isPending: isCurrentUserPending,
  } = useCurrentUser();
  const userId = currentUser?.id;
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isCurrentUserPending) {
      setIsLoading(true);
      return;
    }

    if (!userId) {
      setEvents([]);
      setIsLoading(false);
      setErrorMessage(
        getCalendarErrorMessage(currentUserError, '로그인 정보를 확인할 수 없습니다.'),
      );
      return;
    }

    const controller = new AbortController();

    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const nextEvents = await getCalendarEvents({
          userId,
          signal: controller.signal,
        });

        setEvents(nextEvents);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 불러오지 못했습니다.'));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      controller.abort();
    };
  }, [currentUserError, isCurrentUserPending, userId]);

  const createEvent = useCallback(
    async (draft: CalendarEventDraft) => {
      if (isLoading) {
        return 'loading';
      }

      if (!userId) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const normalizedEvent = createCalendarEventFromDraft(draft, 'pending');

      if (!normalizedEvent) {
        return 'invalid';
      }

      if (hasTimedSlotConflict(events, normalizedEvent)) {
        return 'conflict';
      }

      try {
        setErrorMessage(null);

        const createdEvent = await createCalendarEvent({
          userId,
          draft: normalizedEvent,
        });

        setEvents((prevEvents) => [...prevEvents, createdEvent]);
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return 'conflict';
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 등록하지 못했습니다.'));
        return 'error';
      }
    },
    [events, isLoading, userId],
  );

  const updateEvent = useCallback(
    async (draft: CalendarEventDraft) => {
      if (isLoading) {
        return 'loading';
      }

      if (!userId) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const editingEventId = draft.id;

      if (!editingEventId) {
        return 'invalid';
      }

      const currentEvent = events.find((event) => event.id === editingEventId);

      if (!currentEvent) {
        return 'not-found';
      }

      const nextEvent = applyDraftToEvent(currentEvent, draft);

      if (!nextEvent) {
        return 'invalid';
      }

      if (hasTimedSlotConflict(events, nextEvent, nextEvent.id)) {
        return 'conflict';
      }

      try {
        setErrorMessage(null);

        const updatedEvent = await updateCalendarEvent({
          userId,
          eventId: editingEventId,
          draft: nextEvent,
        });

        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
        );
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setEvents((prevEvents) => prevEvents.filter((event) => event.id !== editingEventId));
          return 'not-found';
        }

        if (error instanceof ApiError && error.status === 409) {
          return 'conflict';
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 수정하지 못했습니다.'));
        return 'error';
      }
    },
    [events, isLoading, userId],
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (isLoading) {
        return 'loading';
      }

      if (!userId) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      try {
        setErrorMessage(null);

        await deleteCalendarEvent({
          userId,
          eventId,
        });

        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
          return 'not-found';
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 삭제하지 못했습니다.'));
        return 'error';
      }
    },
    [isLoading, userId],
  );

  const value = useMemo(
    () => ({
      events,
      isLoading,
      errorMessage,
      createEvent,
      updateEvent,
      deleteEvent,
    }),
    [events, isLoading, errorMessage, createEvent, updateEvent, deleteEvent],
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
