'use client';

import Popup from '@/components/common/Popup/Popup';
import type { CalendarEventDraft } from '../../model/types';
import EventForm from './EventForm';

type EventFormModalProps = {
  open: boolean;
  draft: CalendarEventDraft;
  onClose: () => void;
  onSubmit: (nextDraft: CalendarEventDraft) => void;
};

export function EventFormModal({ open, draft, onClose, onSubmit }: EventFormModalProps) {
  return (
    <Popup open={open} onClose={onClose} title="일정 생성">
      <EventForm initialValue={draft} onCancel={onClose} onSubmit={onSubmit} />
    </Popup>
  );
}
