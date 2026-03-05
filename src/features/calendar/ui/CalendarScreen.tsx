'use client';

import { useMemo, useState } from 'react';

import { CalendarToolbar } from './toolbar/CalendarToolbar';
import { CalendarSidebar } from './sidebar/CalendarSidebar';
import { CalendarCore } from './views/CalendarCore';
import { EventFormModal } from './modal/EventFormModal';

import type { CalendarEvent, CalendarEventDraft, CalendarView } from '../model/types';
import { mockEvents } from '../model/mock-events';
import { DEFAULT_EVENT_COLOR } from '../model/constants';

/**
 * CalendarScreen: 캘린더 페이지의 "조립" 컴포넌트
 * - Toolbar / Sidebar / CalendarCore / Modal을 한 곳에서 배치
 * - 라이브러리(FullCalendar) 의존은 CalendarCore 내부에서만
 */
export default function CalendarScreen() {
  // 월/주/일
  const [view, setView] = useState<CalendarView>('month');

  // 임시: 이벤트 데이터는 mock
  const events = useMemo<CalendarEvent[]>(() => mockEvents, []);

  // 모달 상태(임시 draft)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarEventDraft | null>(null);

  const openCreateModal = (nextDraft?: Partial<CalendarEventDraft>) => {
    setDraft({
      title: '',
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      colorId: DEFAULT_EVENT_COLOR,
      ...nextDraft,
    });
    setIsEventModalOpen(true);
  };

  const closeModal = () => {
    setIsEventModalOpen(false);
    setDraft(null);
  };

  return (
    <div className="flex h-[calc(100vh-0px)] w-full gap-4 p-4">
      {/* 캘린더 전용 좌측 패널(미니 달력/목록 등) */}
      <aside className="w-[320px] shrink-0">
        <CalendarSidebar events={events} onCreateClick={() => openCreateModal()} />
      </aside>

      {/* 메인 영역 */}
      <main className="flex min-w-0 flex-1 flex-col gap-3">
        <CalendarToolbar
          view={view}
          onChangeView={setView}
          onClickToday={() => {
            // CalendarCore와 연결은 다음 단계에서
            // (지금은 구조만 잡기)
            console.log('TODO: go today');
          }}
          onClickPrev={() => console.log('TODO: prev')}
          onClickNext={() => console.log('TODO: next')}
          onClickCreate={() => openCreateModal()}
        />

        <section className="min-h-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
          <CalendarCore
            view={view}
            events={events}
            onSelectSlot={(slot) => {
              // slot: { start, end, allDay } 형태로 CalendarCore에서 넘겨주도록 만들 예정
              openCreateModal({
                start: slot.start,
                end: slot.end,
                allDay: slot.allDay,
              });
            }}
            onClickEvent={(event) => {
              openCreateModal(event);
            }}
          />
        </section>
      </main>

      {/* 일정 생성/수정 모달 */}
      {draft && (
        <EventFormModal
          open={isEventModalOpen}
          draft={draft}
          onClose={closeModal}
          onSubmit={(nextDraft) => {
            // API 전: 일단 콘솔로 확인
            console.log('submit', nextDraft);
            closeModal();
          }}
        />
      )}
    </div>
  );
}
