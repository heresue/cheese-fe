import { DEFAULT_EVENT_COLOR } from '@/app/(app)/calendar/_model/constants';

import type { CalendarEvent, CalendarEventDraft } from '@/app/(app)/calendar/_model/types';

type CalendarEventRequest = Pick<CalendarEventDraft, 'title' | 'start' | 'end'> &
  Partial<
    Pick<
      CalendarEventDraft,
      'allDay' | 'memo' | 'location' | 'url' | 'colorId' | 'category' | 'reminderMinutes'
    >
  >;

type GetCalendarEventsParams = {
  userId: string;
  from?: string;
  to?: string;
  signal?: AbortSignal;
};

type CalendarEventMutationParams = {
  userId: string;
  draft: CalendarEventDraft;
};

type UpdateCalendarEventParams = CalendarEventMutationParams & {
  eventId: string;
};

type DeleteCalendarEventParams = {
  userId: string;
  eventId: string;
};

export class CalendarApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'CalendarApiError';
  }
}

function createApiUrl(path: string, query?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${path}?${queryString}` : path;
}

async function readErrorMessage(response: Response) {
  try {
    const body: unknown = await response.json();

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === 'string').join(', ');
      }
    }
  } catch {
    // JSON이 아닌 오류 응답은 상태 코드 기반 메시지를 사용한다.
  }

  return `캘린더 API 요청에 실패했습니다. (${response.status})`;
}

async function requestCalendarApi<T>(
  path: string,
  options?: RequestInit & { query?: Record<string, string | undefined> },
) {
  const { query, ...requestInit } = options ?? {};
  const response = await fetch(createApiUrl(path, query), {
    ...requestInit,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(requestInit.body ? { 'Content-Type': 'application/json' } : {}),
      ...requestInit.headers,
    },
  });

  if (!response.ok) {
    throw new CalendarApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
}

function toCalendarEventRequest(draft: CalendarEventDraft): CalendarEventRequest {
  return {
    title: draft.title,
    start: draft.start,
    end: draft.end,
    allDay: draft.allDay ?? false,
    memo: draft.memo,
    location: draft.location,
    url: draft.url,
    colorId: draft.colorId ?? DEFAULT_EVENT_COLOR,
    category: draft.category,
    reminderMinutes: draft.reminderMinutes,
  };
}

export function getCalendarEvents({ userId, from, to, signal }: GetCalendarEventsParams) {
  return requestCalendarApi<CalendarEvent[]>('/backend-api/calendar/events', {
    method: 'GET',
    query: { userId, from, to },
    signal,
    cache: 'no-store',
  });
}

export function createCalendarEvent({ userId, draft }: CalendarEventMutationParams) {
  return requestCalendarApi<CalendarEvent>('/backend-api/calendar/events', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      ...toCalendarEventRequest(draft),
    }),
  });
}

export function updateCalendarEvent({ userId, eventId, draft }: UpdateCalendarEventParams) {
  return requestCalendarApi<CalendarEvent>(`/backend-api/calendar/events/${eventId}`, {
    method: 'PATCH',
    query: { userId },
    body: JSON.stringify(toCalendarEventRequest(draft)),
  });
}

export function deleteCalendarEvent({ userId, eventId }: DeleteCalendarEventParams) {
  return requestCalendarApi<CalendarEvent>(`/backend-api/calendar/events/${eventId}`, {
    method: 'DELETE',
    query: { userId },
  });
}
