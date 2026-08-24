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
import { useQueryClient } from '@tanstack/react-query';

import type { AuthUser } from '@/api/auth.api';
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
} from '@/api/calendar.api';
import { ApiError } from '@/api/client';
import { authQueryKeys } from '@/queries/auth/authQueryKeys';
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
  | 'cancelled'
  | 'error';
type CalendarDeleteStatus = 'success' | 'not-found' | 'loading' | 'cancelled' | 'error';

type CalendarEventsState = {
  ownerUserId: string | null;
  events: CalendarEvent[];
};

type CalendarStoreContextValue = {
  events: CalendarEvent[];
  isLoading: boolean;
  errorMessage: string | null;
  createEvent: (draft: CalendarEventDraft) => Promise<CalendarMutationStatus>;
  updateEvent: (draft: CalendarEventDraft) => Promise<CalendarMutationStatus>;
  deleteEvent: (eventId: string) => Promise<CalendarDeleteStatus>;
};

const CalendarStoreContext = createContext<CalendarStoreContextValue | null>(null);
const EMPTY_CALENDAR_EVENTS: CalendarEvent[] = [];

function updateOwnedEvents(
  state: CalendarEventsState,
  ownerUserId: string,
  updateEvents: (events: CalendarEvent[]) => CalendarEvent[],
) {
  if (state.ownerUserId !== ownerUserId) {
    return state;
  }

  return {
    ownerUserId,
    events: updateEvents(state.events),
  };
}

function getCalendarErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function CalendarStoreProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const {
    data: currentUser,
    error: currentUserError,
    isPending: isCurrentUserPending,
    isRefetchError: isCurrentUserRefetchError,
  } = useCurrentUser();
  const userId = currentUser?.id;
  const [eventsState, setEventsState] = useState<CalendarEventsState>({
    ownerUserId: null,
    events: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasCurrentUserError = Boolean(currentUserError) || isCurrentUserRefetchError;
  const hasCurrentUserEvents =
    !isCurrentUserPending &&
    !hasCurrentUserError &&
    Boolean(userId) &&
    eventsState.ownerUserId === userId;
  const events = hasCurrentUserEvents ? eventsState.events : EMPTY_CALENDAR_EVENTS;
  const isEventsOwnerChanging =
    Boolean(userId) && !hasCurrentUserError && eventsState.ownerUserId !== userId;
  const isCalendarLoading = isLoading || isCurrentUserPending || isEventsOwnerChanging;
  const isCurrentAuthUser = useCallback(
    (requestUserId: string) => {
      const authQueryState = queryClient.getQueryState<AuthUser>(authQueryKeys.me());

      return (
        authQueryState?.status === 'success' &&
        authQueryState.error === null &&
        authQueryState.data?.id === requestUserId
      );
    },
    [queryClient],
  );

  useEffect(() => {
    if (isCurrentUserPending) {
      setIsLoading(true);
      return;
    }

    if (hasCurrentUserError) {
      setEventsState({ ownerUserId: null, events: [] });
      setIsLoading(false);
      setErrorMessage(
        getCalendarErrorMessage(currentUserError, '로그인 정보를 확인할 수 없습니다.'),
      );
      return;
    }

    if (!userId) {
      setEventsState({ ownerUserId: null, events: [] });
      setIsLoading(false);
      setErrorMessage(
        getCalendarErrorMessage(currentUserError, '로그인 정보를 확인할 수 없습니다.'),
      );
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    setEventsState({ ownerUserId: userId, events: [] });

    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const nextEvents = await getCalendarEvents({
          userId,
          signal: controller.signal,
        });

        if (isCancelled || !isCurrentAuthUser(userId)) {
          return;
        }

        setEventsState({ ownerUserId: userId, events: nextEvents });
      } catch (error) {
        if (isCancelled || !isCurrentAuthUser(userId)) {
          return;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 불러오지 못했습니다.'));
      } finally {
        if (!isCancelled && isCurrentAuthUser(userId)) {
          setIsLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [currentUserError, hasCurrentUserError, isCurrentAuthUser, isCurrentUserPending, userId]);

  const createEvent = useCallback(
    async (draft: CalendarEventDraft) => {
      if (isCalendarLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
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

      const requestUserId = userId;

      try {
        setErrorMessage(null);

        const createdEvent = await createCalendarEvent({
          userId: requestUserId,
          draft: normalizedEvent,
        });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setEventsState((prevState) =>
          updateOwnedEvents(prevState, requestUserId, (prevEvents) => [
            ...prevEvents,
            createdEvent,
          ]),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 409) {
          return 'conflict';
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 등록하지 못했습니다.'));
        return 'error';
      }
    },
    [events, isCalendarLoading, isCurrentAuthUser, userId],
  );

  const updateEvent = useCallback(
    async (draft: CalendarEventDraft) => {
      if (isCalendarLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
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

      const requestUserId = userId;

      try {
        setErrorMessage(null);

        const updatedEvent = await updateCalendarEvent({
          userId: requestUserId,
          eventId: editingEventId,
          draft: nextEvent,
        });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setEventsState((prevState) =>
          updateOwnedEvents(prevState, requestUserId, (prevEvents) =>
            prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
          ),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404) {
          setEventsState((prevState) =>
            updateOwnedEvents(prevState, requestUserId, (prevEvents) =>
              prevEvents.filter((event) => event.id !== editingEventId),
            ),
          );
          return 'not-found';
        }

        if (error instanceof ApiError && error.status === 409) {
          return 'conflict';
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 수정하지 못했습니다.'));
        return 'error';
      }
    },
    [events, isCalendarLoading, isCurrentAuthUser, userId],
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (isCalendarLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const requestUserId = userId;

      try {
        setErrorMessage(null);

        await deleteCalendarEvent({
          userId: requestUserId,
          eventId,
        });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setEventsState((prevState) =>
          updateOwnedEvents(prevState, requestUserId, (prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId),
          ),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404) {
          setEventsState((prevState) =>
            updateOwnedEvents(prevState, requestUserId, (prevEvents) =>
              prevEvents.filter((event) => event.id !== eventId),
            ),
          );
          return 'not-found';
        }

        setErrorMessage(getCalendarErrorMessage(error, '일정을 삭제하지 못했습니다.'));
        return 'error';
      }
    },
    [isCalendarLoading, isCurrentAuthUser, userId],
  );

  const value = useMemo(
    () => ({
      events,
      isLoading: isCalendarLoading,
      errorMessage,
      createEvent,
      updateEvent,
      deleteEvent,
    }),
    [events, isCalendarLoading, errorMessage, createEvent, updateEvent, deleteEvent],
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
