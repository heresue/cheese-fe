import type { CalendarEvent } from './types';

export const mockEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: '프로젝트 킥오프',
    start: '2026-02-02T10:00:00',
    end: '2026-02-02T11:30:00',
    spaceId: 'space-team',
    colorId: 'tag-blue',
    reminderMinutes: 10,
    memo: '회의록 템플릿 준비',
  },
  {
    id: 'evt-2',
    title: '디자인 QA',
    start: '2026-02-03T14:00:00',
    end: '2026-02-03T15:00:00',
    spaceId: 'space-project',
    colorId: 'tag-purple',
    reminderMinutes: 30,
  },
  {
    id: 'evt-3',
    title: '점심 약속',
    start: '2026-02-04T12:00:00',
    end: '2026-02-04T13:00:00',
    spaceId: 'space-personal',
    colorId: 'tag-green',
    reminderMinutes: 15,
    location: '강남',
  },
  {
    id: 'evt-4',
    title: '휴가',
    start: '2026-02-10T00:00:00',
    end: '2026-02-10T23:59:59',
    allDay: true,
    spaceId: 'space-personal',
    colorId: 'tag-gray',
    memo: '연락 어려움',
  },
];
