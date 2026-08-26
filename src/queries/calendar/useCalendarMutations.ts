import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from '@/api/calendar.api';

import { calendarQueryKeys } from './calendarQueryKeys';

import type { CalendarEventDraft } from '@/app/(app)/calendar/_model/types';

type CreateCalendarEventVariables = {
  userId: string;
  draft: CalendarEventDraft;
};

type UpdateCalendarEventVariables = CreateCalendarEventVariables & {
  eventId: string;
};

type DeleteCalendarEventVariables = {
  userId: string;
  eventId: string;
};

function useInvalidateCalendarEvents() {
  const queryClient = useQueryClient();

  return (userId: string) =>
    queryClient.invalidateQueries({
      queryKey: calendarQueryKeys.byUser(userId),
    });
}

export function useCreateCalendarEventMutation() {
  const invalidateCalendarEvents = useInvalidateCalendarEvents();

  return useMutation({
    mutationFn: ({ userId, draft }: CreateCalendarEventVariables) =>
      createCalendarEvent({ userId, draft }),
    onSettled: async (_data, _error, variables) => {
      await invalidateCalendarEvents(variables.userId);
    },
  });
}

export function useUpdateCalendarEventMutation() {
  const invalidateCalendarEvents = useInvalidateCalendarEvents();

  return useMutation({
    mutationFn: ({ userId, eventId, draft }: UpdateCalendarEventVariables) =>
      updateCalendarEvent({ userId, eventId, draft }),
    onSettled: async (_data, _error, variables) => {
      await invalidateCalendarEvents(variables.userId);
    },
  });
}

export function useDeleteCalendarEventMutation() {
  const invalidateCalendarEvents = useInvalidateCalendarEvents();

  return useMutation({
    mutationFn: ({ userId, eventId }: DeleteCalendarEventVariables) =>
      deleteCalendarEvent({ userId, eventId }),
    onSettled: async (_data, _error, variables) => {
      await invalidateCalendarEvents(variables.userId);
    },
  });
}
