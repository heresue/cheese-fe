import { useQuery } from '@tanstack/react-query';

import { getCalendarEvents } from '@/api/calendar.api';

import { calendarQueryKeys } from './calendarQueryKeys';

type UseCalendarEventsParams = {
  userId?: string;
  enabled: boolean;
};

export function useCalendarEvents({ userId, enabled }: UseCalendarEventsParams) {
  return useQuery({
    queryKey: calendarQueryKeys.events(userId ?? ''),
    queryFn: ({ signal }) => {
      if (!userId) {
        return [];
      }

      return getCalendarEvents({ userId, signal });
    },
    enabled: enabled && Boolean(userId),
  });
}
