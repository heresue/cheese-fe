'use client';

import { useMemo, useRef } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import type { CalendarApi, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';

import type {
  CalendarEvent,
  CalendarEventDraft,
  CalendarSlot,
  CalendarView,
} from '../../model/types';

/**
 * FullCalendar v6 CSS import
 * - 프로젝트 설정에 따라 경로가 다를 수 있어요.
 * - 아래 import에서 에러가 나면, 하단 "CSS import 에러 시" 섹션 참고.
 */

type CalendarCoreProps = {
  view: CalendarView;
  events: CalendarEvent[];
  onTitleChange?: (title: string) => void;

  onSelectSlot?: (slot: CalendarSlot) => void;
  onClickEvent?: (event: Partial<CalendarEventDraft>) => void;
};

const VIEW_MAP: Record<CalendarView, string> = {
  month: 'dayGridMonth',
  week: 'timeGridWeek',
  day: 'timeGridDay',
};

export function CalendarCore({ view, events, onSelectSlot, onClickEvent }: CalendarCoreProps) {
  const calendarRef = useRef<FullCalendar | null>(null);

  // 내부 이벤트 타입 -> FullCalendar EventInput으로 변환
  const fcEvents = useMemo<EventInput[]>(() => {
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      extendedProps: {
        memo: e.memo,
        spaceId: e.spaceId,
        colorId: e.colorId,
        reminderMinutes: e.reminderMinutes,
        location: e.location,
      },
    }));
  }, [events]);

  const initialView = VIEW_MAP[view];

  const handleSelect = (arg: DateSelectArg) => {
    onSelectSlot?.({
      start: arg.startStr,
      end: arg.endStr,
      allDay: arg.allDay,
    });

    // 선택 영역 해제(드래그 잔상 제거)
    arg.view.calendar.unselect();
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = arg.event;
    const ext = event.extendedProps as Partial<CalendarEventDraft>;

    onClickEvent?.({
      id: event.id,
      title: event.title ?? '',
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,

      memo: ext?.memo,
      spaceId: ext?.spaceId,
      colorId: ext?.colorId,
      reminderMinutes: ext?.reminderMinutes,
      location: ext?.location,
    });
  };

  // view prop이 바뀌면 FullCalendar view도 전환
  // (FullCalendar는 내부 상태라서 API로 changeView 해줘야 정확합니다)
  const syncView = (api: CalendarApi) => {
    const next = VIEW_MAP[view];
    if (api.view.type !== next) api.changeView(next);
  };

  return (
    <div className="h-full w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        height="100%"
        headerToolbar={false}
        nowIndicator
        selectable
        selectMirror
        unselectAuto
        select={handleSelect}
        eventClick={handleEventClick}
        events={fcEvents}
        // 뷰 동기화
        datesSet={(arg) => {
          // datesSet은 렌더/뷰 변경 시 자주 불리므로, 현재 view prop과 맞춰줌
          syncView(arg.view.calendar);
        }}
        // timeGrid 설정(주/일 뷰)
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        slotDuration="00:30:00"
        // month 뷰 설정
        dayMaxEventRows={3}
        // locale(원하면 'ko'로 더 정확히)
        locale="ko"
      />
    </div>
  );
}
