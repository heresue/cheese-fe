'use client';

import BasePopup from '@/components/common/Popup/BasePopup';
import type { CalendarEventDraft } from '../../model/types';
import EventForm from './EventForm';

type EventFormModalProps = {
  open: boolean; // CalendarScreen에서 쓰는 이름 유지
  draft: CalendarEventDraft;
  onClose: () => void;
  onSubmit: (nextDraft: CalendarEventDraft) => void;
};

export function EventFormModal({ open, draft, onClose, onSubmit }: EventFormModalProps) {
  return (
    <BasePopup isOpen={open} onClose={onClose}>
      <div className="w-[520px] max-w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-base font-semibold">일정 생성</h2>
          <button
            type="button"
            className="h-9 w-9 rounded-xl hover:bg-[var(--color-bg-bg-2)]"
            onClick={onClose}
            aria-label="닫기"
            title="닫기"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">
          <EventForm initialValue={draft} onCancel={onClose} onSubmit={onSubmit} />
        </div>
      </div>
    </BasePopup>
  );
}
