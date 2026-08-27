export const calendarQueryKeys = {
  all: ['calendar'] as const,

  byUser: (userId: string) => [...calendarQueryKeys.all, 'user', userId] as const,
  events: (userId: string) => [...calendarQueryKeys.byUser(userId), 'events'] as const,
};
