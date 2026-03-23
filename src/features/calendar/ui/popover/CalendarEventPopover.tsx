'use client';

import { useEffect, useMemo, useRef } from 'react';

import type { CalendarEventDraft, EventColorId, ReminderMinutes } from '../../model/types';

type CalendarEventPopoverProps = {
  open: boolean;
  x: number;
  y: number;
  draft: CalendarEventDraft;
  onChangeDraft: (nextDraft: CalendarEventDraft) => void;
  onClose: () => void;
  onSave: () => void;
};

const REMINDER_OPTIONS: Array<{ label: string; value: ReminderMinutes | '' }> = [
  { label: '없음', value: '' },
  { label: '5분 전', value: 5 },
  { label: '10분 전', value: 10 },
  { label: '30분 전', value: 30 },
  { label: '1시간 전', value: 60 },
];

const QUICK_EVENT_COLORS: Array<{ id: EventColorId; hex: string }> = [
  { id: 'tag-gray', hex: '#8B99A8' },
  { id: 'tag-red', hex: '#F26B5E' },
  { id: 'tag-yellow', hex: '#E9C84A' },
  { id: 'tag-green', hex: '#8BC34A' },
  { id: 'tag-blue', hex: '#5B9EF7' },
  { id: 'tag-purple', hex: '#A96BE3' },
];

function toDateInputValue(value?: string) {
  if (!value) return '';
  return value.slice(0, 10);
}

export function CalendarEventPopover({
  open,
  x,
  y,
  draft,
  onChangeDraft,
  onClose,
  onSave,
}: CalendarEventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!popoverRef.current) return;
      if (popoverRef.current.contains(event.target as Node)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const startDate = useMemo(() => toDateInputValue(draft.start), [draft.start]);
  const endDate = useMemo(() => toDateInputValue(draft.end), [draft.end]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-[360px] rounded-[14px] border border-[var(--color-gray-200)] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-gray-200)] px-4 py-3">
        <span className="text-sm font-semibold text-[var(--color-gray-900)]">일정</span>

        <button
          type="button"
          onClick={onClose}
          className="text-lg leading-none text-[var(--color-gray-500)]"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-gray-500)]">
            제목
          </label>
          <input
            value={draft.title ?? ''}
            onChange={(e) =>
              onChangeDraft({
                ...draft,
                title: e.target.value,
              })
            }
            placeholder="일정 제목"
            className="h-10 w-full rounded-[10px] border border-[var(--color-gray-200)] px-3 text-sm outline-none focus:border-[var(--color-gray-400)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-gray-500)]">
              시작
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                onChangeDraft({
                  ...draft,
                  start: e.target.value,
                })
              }
              className="h-10 w-full rounded-[10px] border border-[var(--color-gray-200)] px-3 text-sm outline-none focus:border-[var(--color-gray-400)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-gray-500)]">
              종료
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                onChangeDraft({
                  ...draft,
                  end: e.target.value,
                })
              }
              className="h-10 w-full rounded-[10px] border border-[var(--color-gray-200)] px-3 text-sm outline-none focus:border-[var(--color-gray-400)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[var(--color-gray-500)]">
            메모
          </label>
          <textarea
            value={draft.memo ?? ''}
            onChange={(e) =>
              onChangeDraft({
                ...draft,
                memo: e.target.value,
              })
            }
            placeholder="메모 최대 5줄&#10;5줄 이상 쓰면 스크롤 형식으로&#10;메모 작성 시 약 g10으로 (제목,장소,URL도 마찬가지)&#10;일정구분 항목"
            className="min-h-[96px] w-full resize-none rounded-[10px] border border-[var(--color-gray-200)] px-3 py-2 text-xs outline-none focus:border-[var(--color-gray-400)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[var(--color-gray-500)]">
            일정 색상
          </label>
          <div className="flex items-center gap-2">
            {QUICK_EVENT_COLORS.map((color) => {
              const selected = draft.colorId === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() =>
                    onChangeDraft({
                      ...draft,
                      colorId: color.id,
                    })
                  }
                  className={`h-4 w-4 rounded-[4px] border ${
                    selected ? 'scale-110 border-[var(--color-gray-700)]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.id}
                />
              );
            })}
          </div>
        </div>

        <div>
          <input
            value={draft.location ?? ''}
            onChange={(e) =>
              onChangeDraft({
                ...draft,
                location: e.target.value,
              })
            }
            placeholder="장소"
            className="h-9 w-full rounded-[8px] border border-[var(--color-gray-200)] px-3 text-sm outline-none focus:border-[var(--color-gray-400)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={draft.reminderMinutes !== undefined ? String(draft.reminderMinutes) : ''}
            onChange={(e) => {
              const nextReminderMinutes = e.target.value
                ? (Number(e.target.value) as ReminderMinutes)
                : undefined;

              onChangeDraft({
                ...draft,
                reminderMinutes: nextReminderMinutes,
              });
            }}
            className="h-9 rounded-[8px] border border-[var(--color-gray-200)] px-3 text-sm outline-none focus:border-[var(--color-gray-400)]"
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onSave}
            className="h-9 rounded-[10px] bg-[#f5c940] text-sm font-semibold text-[var(--color-gray-900)]"
          >
            일정 생성
          </button>
        </div>
      </div>
    </div>
  );
}
