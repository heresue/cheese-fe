'use client';

import { useEffect, useRef, useState } from 'react';

import {
  addDaysToCalendarDate,
  addHoursToCalendarDateTime,
  combineDateAndTime,
  formatDisplayDate,
  hasTimePart,
  parseCalendarDate,
  toDateInputValue,
  toTimeInputValue,
} from '../../lib/date';
import type { CalendarEventDraft, EventColorId, ReminderMinutes } from '../../model/types';

type CalendarEventPopoverProps = {
  open: boolean;
  x: number;
  y: number;
  draft: CalendarEventDraft;
  mode?: 'create' | 'edit';
  hideTimeFields?: boolean;
  onChangeDraft: (nextDraft: CalendarEventDraft) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
};

type DropdownOption<T extends string | number> = {
  label: string;
  value: T;
};

const REMINDER_OPTIONS: Array<DropdownOption<ReminderMinutes | ''>> = [
  { label: '리마인더', value: '' },
  { label: '5분 전', value: 5 },
  { label: '10분 전', value: 10 },
  { label: '30분 전', value: 30 },
  { label: '1시간 전', value: 60 },
];

const CATEGORY_OPTIONS: Array<DropdownOption<string>> = [
  { label: '일정구분', value: '' },
  { label: '면접', value: 'interview' },
  { label: '과제', value: 'assignment' },
  { label: '미팅', value: 'meeting' },
  { label: '기타', value: 'etc' },
];

const QUICK_EVENT_COLORS: Array<{ id: EventColorId; hex: string }> = [
  { id: 'tag-gray', hex: '#93A1AF' },
  { id: 'tag-red', hex: '#EB5B49' },
  { id: 'tag-yellow', hex: '#F4C340' },
  { id: 'tag-green', hex: '#9CC04B' },
  { id: 'tag-blue', hex: '#5B9EF7' },
  { id: 'tag-purple', hex: '#9B59D0' },
];

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#C1C7CF]">
      {children}
    </span>
  );
}

function ClockLineIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 6.75V10L12.25 11.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationLineIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M10 16.25C12.9167 13.1667 14.5 10.875 14.5 8.75C14.5 6.26472 12.4853 4.25 10 4.25C7.51472 4.25 5.5 6.26472 5.5 8.75C5.5 10.875 7.08333 13.1667 10 16.25Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="10" cy="8.75" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function LinkLineIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M8.25 10.75L11.75 7.25M7.25 7.75H6.75C5.50736 7.75 4.5 8.75736 4.5 10V12.25C4.5 13.4926 5.50736 14.5 6.75 14.5H9C10.2426 14.5 11.25 13.4926 11.25 12.25V11.75M12.25 8.25H12.75C13.9926 8.25 15 7.24264 15 6V5.75C15 4.50736 13.9926 3.5 12.75 3.5H10.5C9.25736 3.5 8.25 4.50736 8.25 5.75V6.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M6 8L10 12L14 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getLabel<T extends string | number>(options: Array<DropdownOption<T>>, value: T) {
  return options.find((option) => option.value === value)?.label ?? options[0].label;
}

type CustomDropdownProps<T extends string | number> = {
  value: T;
  options: Array<DropdownOption<T>>;
  onChange: (value: T) => void;
};

function CustomDropdown<T extends string | number>({
  value,
  options,
  onChange,
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const isPlaceholder = value === '' || value === undefined;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[32px] w-full items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-2.5 text-[12px] outline-none"
      >
        <span className={isPlaceholder ? 'text-[#B3BAC4]' : 'text-[#4B5563]'}>
          {getLabel(options, value)}
        </span>
        <span className="text-[#8E96A3]">
          <ChevronDownIcon />
        </span>
      </button>

      {open ? (
        <div className="absolute top-[36px] left-0 z-20 w-full rounded-[12px] border border-[#E5E7EB] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex h-[30px] w-full items-center px-3 text-left text-[12px] ${
                  selected ? 'text-[#2F2F2F]' : 'text-[#4B5563]'
                } hover:bg-[#F1F1F1]`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

type DisplayDateFieldProps = {
  value?: string;
  onChange: (nextValue: string) => void;
};

function DisplayDateField({ value, onChange }: DisplayDateFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const displayText = formatDisplayDate(value);
  const inputValue = toDateInputValue(value);

  const openPicker = () => {
    if (!inputRef.current) return;

    if ('showPicker' in HTMLInputElement.prototype) {
      (inputRef.current as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
      return;
    }

    inputRef.current.click();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="flex h-[28px] w-full items-center justify-center rounded-[6px] border border-[#E4E8ED] bg-white px-2 text-[12px] leading-[28px] text-[#4B5563]"
      >
        <span className="truncate">{displayText}</span>
      </button>

      <input
        ref={inputRef}
        type="date"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
      />
    </div>
  );
}

type DisplayTimeFieldProps = {
  value?: string;
  onChange: (nextValue: string) => void;
};

function DisplayTimeField({ value, onChange }: DisplayTimeFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputValue = toTimeInputValue(value);

  const openPicker = () => {
    if (!inputRef.current) return;

    if ('showPicker' in HTMLInputElement.prototype) {
      (inputRef.current as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
      return;
    }

    inputRef.current.click();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="flex h-[28px] w-full items-center justify-center rounded-[6px] border border-[#E4E8ED] bg-white px-2 text-[12px] leading-[28px] text-[#4B5563]"
      >
        <span className="truncate">{inputValue || '시간 선택'}</span>
      </button>

      <input
        ref={inputRef}
        type="time"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
      />
    </div>
  );
}

function getAllDayDisplayEndValue(start?: string, end?: string) {
  if (!start) return '';
  if (!end) return start;

  const inclusiveEnd = addDaysToCalendarDate(end, -1);
  return inclusiveEnd || start;
}

export function CalendarEventPopover({
  open,
  x,
  y,
  draft,
  mode = 'create',
  hideTimeFields = false,
  onChangeDraft,
  onClose,
  onSave,
  onDelete,
}: CalendarEventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const isAllDay = draft.allDay ?? !hasTimePart(draft.start);
  const showDateOnlyTimedField = hideTimeFields && !isAllDay;
  const timedDateValue = toDateInputValue(draft.start);
  const timedStartTimeValue = toTimeInputValue(draft.start);
  const timedEndTimeValue = toTimeInputValue(
    draft.end || addHoursToCalendarDateTime(draft.start, 1),
  );
  const allDayDisplayEndValue = getAllDayDisplayEndValue(draft.start, draft.end);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!popoverRef.current) return;
      if (popoverRef.current.contains(event.target as Node)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const updateAllDayStart = (nextStart: string) => {
    const currentDisplayEnd = getAllDayDisplayEndValue(draft.start, draft.end) || nextStart;
    const currentEndDate = parseCalendarDate(currentDisplayEnd);
    const nextStartDate = parseCalendarDate(nextStart);

    const nextDisplayEnd =
      currentEndDate && nextStartDate && currentEndDate >= nextStartDate
        ? currentDisplayEnd
        : nextStart;

    onChangeDraft({
      ...draft,
      allDay: true,
      start: nextStart,
      end: addDaysToCalendarDate(nextDisplayEnd, 1),
    });
  };

  const updateAllDayEnd = (nextEnd: string) => {
    onChangeDraft({
      ...draft,
      allDay: true,
      end: addDaysToCalendarDate(nextEnd || draft.start, 1),
    });
  };

  const updateTimedDraft = (nextDate?: string, nextTime?: string) => {
    const mergedDate = nextDate ?? timedDateValue;
    const mergedTime = nextTime ?? timedStartTimeValue;
    const nextStart = combineDateAndTime(mergedDate, mergedTime);

    if (!nextStart) return;

    onChangeDraft({
      ...draft,
      allDay: false,
      start: nextStart,
      end: addHoursToCalendarDateTime(nextStart, 1),
    });
  };

  const updateTimedDateOnlyDraft = (nextDate: string) => {
    const nextStart = combineDateAndTime(nextDate, timedStartTimeValue || '09:00');

    if (!nextStart) return;

    onChangeDraft({
      ...draft,
      allDay: false,
      start: nextStart,
      end: addHoursToCalendarDateTime(nextStart, 1),
    });
  };

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 min-h-[455px] w-[320px] overflow-visible rounded-[12px] border border-[#E8EAEE] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center justify-between px-3 py-[10px]">
        <span className="text-[12px] leading-[16px] font-semibold text-[#2F2F2F]">일정</span>

        <button
          type="button"
          onClick={onClose}
          className="text-[18px] leading-none text-[#BFC5CC]"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 px-3 pb-3">
        <input
          value={draft.title ?? ''}
          onChange={(e) =>
            onChangeDraft({
              ...draft,
              title: e.target.value,
            })
          }
          placeholder="제목"
          className="h-[28px] w-full border-0 bg-transparent px-0 text-[12px] text-[#2F2F2F] outline-none placeholder:text-[#A8AFB8]"
        />

        {isAllDay ? (
          <div className="grid grid-cols-[14px_1fr_10px_1fr] items-center gap-2">
            <FieldIcon>
              <ClockLineIcon />
            </FieldIcon>

            <DisplayDateField value={draft.start} onChange={updateAllDayStart} />

            <span className="text-center text-[12px] text-[#A8AFB8]">-</span>

            <DisplayDateField value={allDayDisplayEndValue} onChange={updateAllDayEnd} />
          </div>
        ) : showDateOnlyTimedField ? (
          <div className="grid grid-cols-[14px_1fr] items-center gap-2">
            <FieldIcon>
              <ClockLineIcon />
            </FieldIcon>

            <DisplayDateField value={draft.start} onChange={updateTimedDateOnlyDraft} />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="grid grid-cols-[14px_1fr_88px] items-center gap-2">
              <FieldIcon>
                <ClockLineIcon />
              </FieldIcon>

              <DisplayDateField
                value={draft.start}
                onChange={(nextValue) => updateTimedDraft(nextValue)}
              />

              <DisplayTimeField
                value={draft.start}
                onChange={(nextValue) => updateTimedDraft(undefined, nextValue)}
              />
            </div>
          </div>
        )}

        <textarea
          value={draft.memo ?? ''}
          onChange={(e) =>
            onChangeDraft({
              ...draft,
              memo: e.target.value,
            })
          }
          className="h-[96px] w-full resize-none rounded-[8px] border border-[#D9DEE5] px-2.5 py-2 text-[11px] leading-[15px] text-[#4B5563] outline-none focus:border-[#C8CED6]"
        />

        <div>
          <div className="mb-2 text-[11px] leading-[14px] font-medium text-[#6B7280]">
            일정 색상
          </div>
          <div className="flex items-center gap-[8px]">
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
                  className={`h-[16px] w-[16px] rounded-[4px] border transition ${
                    selected ? 'scale-110 border-[#59636F]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.id}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="grid grid-cols-[14px_1fr] items-center gap-2 rounded-[8px] border border-[#E5E7EB] px-2.5">
            <FieldIcon>
              <LocationLineIcon />
            </FieldIcon>

            <input
              value={draft.location ?? ''}
              onChange={(e) =>
                onChangeDraft({
                  ...draft,
                  location: e.target.value,
                })
              }
              placeholder="장소"
              className="h-[31px] w-full border-0 bg-transparent px-0 text-[12px] outline-none placeholder:text-[#B3BAC4]"
            />
          </div>

          <div className="grid grid-cols-[14px_1fr] items-center gap-2 rounded-[8px] border border-[#E5E7EB] px-2.5">
            <FieldIcon>
              <LinkLineIcon />
            </FieldIcon>

            <input
              value={(draft as CalendarEventDraft & { url?: string }).url ?? ''}
              onChange={(e) =>
                onChangeDraft({
                  ...draft,
                  url: e.target.value,
                } as CalendarEventDraft)
              }
              placeholder="채용정보 URL"
              className="h-[31px] w-full border-0 bg-transparent px-0 text-[12px] outline-none placeholder:text-[#B3BAC4]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CustomDropdown
            value={draft.reminderMinutes !== undefined ? draft.reminderMinutes : ''}
            options={REMINDER_OPTIONS}
            onChange={(nextValue) => {
              onChangeDraft({
                ...draft,
                reminderMinutes: nextValue === '' ? undefined : (nextValue as ReminderMinutes),
              });
            }}
          />

          <CustomDropdown
            value={(draft as CalendarEventDraft & { category?: string }).category ?? ''}
            options={CATEGORY_OPTIONS}
            onChange={(nextValue) =>
              onChangeDraft({
                ...draft,
                category: nextValue || undefined,
              } as CalendarEventDraft)
            }
          />
        </div>

        {mode === 'create' ? (
          <button
            type="button"
            onClick={onSave}
            className="h-[34px] w-full rounded-[8px] bg-[#F4C53D] text-[12px] font-semibold text-[#2F2F2F]"
          >
            일정 생성
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDelete}
              className="h-[34px] flex-1 rounded-[8px] border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280]"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={onSave}
              className="h-[34px] flex-1 rounded-[8px] bg-[#F4C53D] text-[12px] font-semibold text-[#2F2F2F]"
            >
              수정
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
