'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { getTagColor } from '@/lib/tagPalette';

import {
  addDaysToCalendarDate,
  addHoursToCalendarDateTime,
  combineDateAndTime,
  formatDisplayDate,
  hasTimePart,
  parseCalendarDate,
  toDateInputValue,
  toTimeInputValue,
} from '../../_lib/date';
import {
  CalendarLineIcon,
  ChevronIcon,
  ClockLineIcon,
  LinkLineIcon,
  LocationLineIcon,
} from '../../../../../assets/icons/calendar';
import { DEFAULT_EVENT_COLOR } from '../../_model/constants';
import type { CalendarEventDraft, EventColorId, ReminderMinutes } from '../../_model/types';

type CalendarEventPopoverProps = {
  open: boolean;
  x: number;
  y: number;
  draft: CalendarEventDraft;
  hideTimeFields?: boolean;
  onChangeDraft: (nextDraft: CalendarEventDraft) => void;
  onClose: () => void;
  onCommit: () => void;
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

const QUICK_EVENT_COLOR_IDS = [
  'tag-gray',
  'tag-red',
  'tag-yellow',
  'tag-green',
  'tag-blue',
  'tag-purple',
] as const satisfies readonly EventColorId[];

const QUICK_EVENT_COLORS = QUICK_EVENT_COLOR_IDS.map((id) => ({
  ...getTagColor(id),
  id,
}));

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-gray-400">
      {children}
    </span>
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

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const isPlaceholder = value === '' || value === undefined;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[30px] w-full items-center justify-between rounded-[6px] border border-gray-300 bg-white px-2.5 text-[12px] outline-none"
      >
        <span className={isPlaceholder ? 'text-gray-500' : 'text-gray-700'}>
          {getLabel(options, value)}
        </span>

        <span className="text-gray-500">
          <ChevronIcon direction="down" width={16} height={16} aria-hidden="true" />
        </span>
      </button>

      {open ? (
        <div className="absolute top-[36px] left-0 z-20 w-full rounded-[12px] border border-gray-300 bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
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
                className={cn(
                  'flex h-[30px] w-full items-center px-3 text-left text-[12px] hover:bg-gray-200',
                  selected ? 'text-gray-900' : 'text-gray-700',
                )}
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
  active?: boolean;
  onChange: (nextValue: string) => void;
};

function DisplayDateField({ value, active = false, onChange }: DisplayDateFieldProps) {
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
        className={cn(
          'flex h-[28px] w-full items-center justify-center rounded-[6px] border border-gray-300 px-2 text-[12px] leading-[28px] text-gray-700',
          active ? 'bg-gray-200' : 'bg-white',
        )}
      >
        <span className="truncate">{displayText}</span>
      </button>

      <input
        ref={inputRef}
        type="date"
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
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
        className="flex h-[28px] w-full items-center justify-center rounded-[6px] border border-gray-300 bg-white px-2 text-[12px] leading-[28px] text-gray-700"
      >
        <span className="truncate">{inputValue || '시간 선택'}</span>
      </button>

      <input
        ref={inputRef}
        type="time"
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
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
  hideTimeFields = false,
  onChangeDraft,
  onClose,
  onCommit,
}: CalendarEventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const isAllDay = draft.allDay ?? !hasTimePart(draft.start);
  const showDateOnlyTimedField = hideTimeFields && !isAllDay;
  const timedStartDateValue = toDateInputValue(draft.start);
  const timedStartTimeValue = toTimeInputValue(draft.start) || '09:00';
  const timedEndTimeValue =
    toTimeInputValue(draft.end || addHoursToCalendarDateTime(draft.start, 1)) || '10:00';
  const allDayDisplayEndValue = getAllDayDisplayEndValue(draft.start, draft.end);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!popoverRef.current) return;
      if (popoverRef.current.contains(event.target as Node)) return;

      onCommit();
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
  }, [open, onClose, onCommit]);

  const handleClosePopover = () => {
    onClose();
  };

  const handleSelectColor = (colorId: EventColorId) => {
    onChangeDraft({
      ...draft,
      colorId,
    });
  };

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

  const updateTimedStart = (nextDate: string, nextTime: string) => {
    const nextStart = combineDateAndTime(nextDate, nextTime);
    if (!nextStart) return;

    const nextEnd =
      combineDateAndTime(nextDate, timedEndTimeValue) || addHoursToCalendarDateTime(nextStart, 1);

    onChangeDraft({
      ...draft,
      allDay: false,
      start: nextStart,
      end: nextEnd,
    });
  };

  const updateTimedEnd = (nextTime: string) => {
    const nextEnd = combineDateAndTime(timedStartDateValue, nextTime);
    if (!nextEnd) return;

    onChangeDraft({
      ...draft,
      allDay: false,
      end: nextEnd,
    });
  };

  const updateTimedDateOnlyDraft = (nextDate: string) => {
    const nextStart = combineDateAndTime(nextDate, timedStartTimeValue);
    if (!nextStart) return;

    const nextEnd =
      combineDateAndTime(nextDate, timedEndTimeValue) || addHoursToCalendarDateTime(nextStart, 1);

    onChangeDraft({
      ...draft,
      allDay: false,
      start: nextStart,
      end: nextEnd,
    });
  };

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        'fixed z-50 w-[300px] overflow-visible rounded-[10px] border border-gray-300 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]',
        isAllDay || showDateOnlyTimedField ? 'h-[442px]' : 'min-h-[476px]',
      )}
      style={{ left: x, top: y }}
    >
      <div className="flex h-12 items-center justify-between px-4">
        <span className="text-[12px] leading-[16px] font-semibold text-gray-900">일정</span>

        <button
          type="button"
          onClick={handleClosePopover}
          className="text-[18px] leading-none text-gray-400"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div className="px-4 pb-[18px]">
        <input
          value={draft.title ?? ''}
          onChange={(event) =>
            onChangeDraft({
              ...draft,
              title: event.target.value,
            })
          }
          placeholder="제목"
          className="mt-[6px] h-[28px] w-full border-0 bg-transparent px-0 text-[12px] text-gray-900 outline-none placeholder:text-gray-500"
        />

        {isAllDay ? (
          <div className="mt-[21px] grid grid-cols-[14px_1fr_10px_1fr] items-center gap-2">
            <FieldIcon>
              <ClockLineIcon width={16} height={16} />
            </FieldIcon>

            <DisplayDateField value={draft.start} active onChange={updateAllDayStart} />

            <span className="text-center text-[12px] text-gray-500">-</span>

            <DisplayDateField value={allDayDisplayEndValue} onChange={updateAllDayEnd} />
          </div>
        ) : showDateOnlyTimedField ? (
          <div className="mt-[21px] grid grid-cols-[14px_1fr] items-center gap-2">
            <FieldIcon>
              <CalendarLineIcon width={16} height={16} />
            </FieldIcon>

            <DisplayDateField value={draft.start} active onChange={updateTimedDateOnlyDraft} />
          </div>
        ) : (
          <div className="mt-[21px] space-y-1.5">
            <div className="grid grid-cols-[14px_1fr_10px_1fr] items-center gap-2">
              <FieldIcon>
                <ClockLineIcon width={16} height={16} />
              </FieldIcon>

              <DisplayTimeField
                value={draft.start}
                onChange={(nextValue) => updateTimedStart(timedStartDateValue, nextValue)}
              />

              <span className="text-center text-[12px] text-gray-500">-</span>

              <DisplayTimeField
                value={draft.end}
                onChange={(nextValue) => updateTimedEnd(nextValue)}
              />
            </div>

            <div className="grid grid-cols-[14px_1fr] items-center gap-2">
              <FieldIcon>
                <CalendarLineIcon width={16} height={16} />
              </FieldIcon>

              <DisplayDateField value={draft.start} onChange={updateTimedDateOnlyDraft} />
            </div>
          </div>
        )}

        <textarea
          value={draft.memo ?? ''}
          onChange={(event) =>
            onChangeDraft({
              ...draft,
              memo: event.target.value,
            })
          }
          className="mt-[10px] h-[100px] w-full resize-none rounded-[6px] border border-gray-300 px-2.5 py-2 text-[11px] leading-[15px] text-gray-700 outline-none focus:border-gray-400"
        />

        <div className="mt-3">
          <div className="mb-[10px] text-[11px] leading-[14px] font-medium text-gray-700">
            일정 색상
          </div>

          <div className="flex items-center gap-2">
            {QUICK_EVENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => handleSelectColor(color.id)}
                className={cn(
                  'h-5 w-5 shrink-0 rounded-[6px] border border-transparent transition-transform duration-150 hover:scale-105 hover:border-gray-300',
                  color.chipClassName,
                )}
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.52)' }}
                aria-label={color.label}
                aria-pressed={(draft.colorId ?? DEFAULT_EVENT_COLOR) === color.id}
              />
            ))}
          </div>
        </div>

        <div className="mt-[21px] space-y-[3px]">
          <div className="grid h-[30px] grid-cols-[14px_1fr] items-center gap-2 rounded-[6px] border border-gray-300 px-2.5">
            <FieldIcon>
              <LocationLineIcon width={16} height={16} />
            </FieldIcon>

            <input
              value={draft.location ?? ''}
              onChange={(event) =>
                onChangeDraft({
                  ...draft,
                  location: event.target.value,
                })
              }
              placeholder="장소"
              className="h-[28px] w-full border-0 bg-transparent px-0 text-[12px] outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="grid h-[30px] grid-cols-[14px_1fr] items-center gap-2 rounded-[6px] border border-gray-300 px-2.5">
            <FieldIcon>
              <LinkLineIcon width={16} height={16} />
            </FieldIcon>

            <input
              value={(draft as CalendarEventDraft & { url?: string }).url ?? ''}
              onChange={(event) =>
                onChangeDraft({
                  ...draft,
                  url: event.target.value,
                } as CalendarEventDraft)
              }
              placeholder="채용정보 URL"
              className="h-[28px] w-full border-0 bg-transparent px-0 text-[12px] outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mt-[3px] grid grid-cols-2 gap-2">
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
      </div>
    </div>
  );
}
