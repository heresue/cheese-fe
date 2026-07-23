import { hasTimePart, parseCalendarDate, toTimeInputValue } from '../_lib/date';
import type { CalendarEvent } from '../_model/types';

function getStartOfToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getDayDiff(from: Date, to: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round((to.getTime() - from.getTime()) / millisecondsPerDay);
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function getUpcomingEvents(events: CalendarEvent[], limit?: number) {
  const now = new Date();
  const todayStart = getStartOfToday();

  const upcomingEvents = events
    .filter((event) => {
      const start = parseCalendarDate(event.start);

      if (!start) {
        return false;
      }

      if (event.allDay || !hasTimePart(event.start)) {
        const eventDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());

        return eventDay >= todayStart;
      }

      return start >= now;
    })
    .sort((left, right) => {
      const leftStart = parseCalendarDate(left.start)?.getTime() ?? 0;
      const rightStart = parseCalendarDate(right.start)?.getTime() ?? 0;

      return leftStart - rightStart;
    });

  if (typeof limit === 'number') {
    return upcomingEvents.slice(0, limit);
  }

  return upcomingEvents;
}

export function getThisWeekRemainingEvents(events: CalendarEvent[]) {
  const now = new Date();
  const todayStart = getStartOfToday();
  const dayOfWeek = todayStart.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + daysUntilSunday);
  weekEnd.setHours(23, 59, 59, 999);

  return getUpcomingEvents(events).filter((event) => {
    const start = parseCalendarDate(event.start);

    if (!start) {
      return false;
    }

    return start >= now && start <= weekEnd;
  });
}

export function getNearestUpcomingWeekdayLabel(events: CalendarEvent[]) {
  const nearestEvent = getUpcomingEvents(events, 1)[0];

  if (!nearestEvent) {
    return null;
  }

  const start = parseCalendarDate(nearestEvent.start);

  if (!start) {
    return null;
  }

  return new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(start);
}

export function formatDashboardDeadlineLabel(event: CalendarEvent) {
  const start = parseCalendarDate(event.start);

  if (!start) {
    return '';
  }

  const todayStart = getStartOfToday();
  const eventDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const dayDiff = getDayDiff(todayStart, eventDay);

  if (dayDiff === 0 && hasTimePart(event.start)) {
    return `오늘 ${toTimeInputValue(event.start)}`;
  }

  if (dayDiff === 0) {
    return '오늘';
  }

  if (dayDiff > 0) {
    return `D-${dayDiff}`;
  }

  return '지난 일정';
}

export function formatDashboardTimeRange(event: CalendarEvent) {
  const start = parseCalendarDate(event.start);

  if (!start) {
    return '';
  }

  if (event.allDay || !hasTimePart(event.start)) {
    const month = MONTH_LABELS[start.getMonth()];

    return `${month} ${String(start.getDate()).padStart(2, '0')}, 00:00`;
  }

  const endLabel = toTimeInputValue(event.end) || toTimeInputValue(event.start);

  return `${toTimeInputValue(event.start)} - ${endLabel}`;
}

export function getDashboardEventLocation(event: CalendarEvent) {
  return event.location?.trim() || event.url?.trim() || '';
}
