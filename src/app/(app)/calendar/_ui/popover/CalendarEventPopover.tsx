'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { getTagColor } from '@/lib/tagPalette';
import CheckboxIcon from '@/assets/icons/calendar/checkbox.svg';
import DateIcon from '@/assets/icons/calendar/calendar.svg';
import ThinCloseIcon from '@/assets/icons/calendar/thinclose.svg';
import WatchIcon from '@/assets/icons/calendar/watch.svg';
import Watch2Icon from '@/assets/icons/calendar/watch2.svg';
import LinkIcon from '@/assets/icons/common/link.svg';
import LocationIcon from '@/assets/icons/settings/location.svg';
import { CollapsibleColorPicker } from '@/components/common/CollapsibleColorPicker';

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
import { ChevronIcon } from '../../../../../assets/icons/calendar';
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

const FIELD_TEXT_CLASS_NAME = 'text-[14px] leading-[20px] font-normal tracking-[-0.02em]';

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

const QUICK_EVENT_COLOR_OPTIONS = QUICK_EVENT_COLORS.map((color) => ({
  value: color.id,
  label: color.label,
  swatchClassName: color.chipClassName,
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
  leadingIcon?: React.ReactNode;
};

type DropdownPlacement = 'top' | 'bottom';

const DROPDOWN_GAP = 6;
const DROPDOWN_OPTION_HEIGHT = 30;
const DROPDOWN_VERTICAL_CHROME = 10;
const DROPDOWN_VIEWPORT_PADDING = 12;

function CustomDropdown<T extends string | number>({
  value,
  options,
  onChange,
  leadingIcon,
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DropdownPlacement>('bottom');
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }

    const rootRect = rootRef.current?.getBoundingClientRect();
    if (rootRect) {
      const menuHeight = options.length * DROPDOWN_OPTION_HEIGHT + DROPDOWN_VERTICAL_CHROME;
      const viewportHeight = document.documentElement.clientHeight;
      const spaceBelow =
        viewportHeight - rootRect.bottom - DROPDOWN_GAP - DROPDOWN_VIEWPORT_PADDING;
      const spaceAbove = rootRect.top - DROPDOWN_GAP - DROPDOWN_VIEWPORT_PADDING;

      setPlacement(spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }

    setOpen(true);
  };

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
        onClick={handleToggle}
        className={cn(
          'flex h-[30px] w-full items-center justify-between rounded-[6px] border border-gray-300 bg-white px-2.5 outline-none',
          FIELD_TEXT_CLASS_NAME,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {leadingIcon ? <FieldIcon>{leadingIcon}</FieldIcon> : null}
          <span
            className={cn(
              'truncate',
              FIELD_TEXT_CLASS_NAME,
              isPlaceholder ? 'text-gray-500' : 'text-gray-700',
            )}
          >
            {getLabel(options, value)}
          </span>
        </span>

        <span className="text-gray-500">
          <ChevronIcon
            direction={open && placement === 'top' ? 'up' : 'down'}
            width={8}
            height={14}
            aria-hidden="true"
          />
        </span>
      </button>

      {open ? (
        <div
          data-dropdown-placement={placement}
          className={cn(
            'absolute left-0 z-20 w-full rounded-[12px] border border-gray-300 bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]',
            placement === 'top' ? 'bottom-[36px]' : 'top-[36px]',
          )}
        >
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
                  'flex h-[30px] w-full items-center px-3 text-left text-[12px] leading-[16px] font-medium tracking-normal text-gray-950 hover:bg-gray-200',
                  selected ? 'bg-gray-200' : '',
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
        className="flex h-[28px] w-full items-center justify-center rounded-[6px] border border-gray-300 bg-white px-2 text-[12px] leading-[16px] font-normal tracking-normal text-gray-700"
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

function formatDisplayTime(value?: string) {
  const inputValue = toTimeInputValue(value);
  if (!inputValue) return '시간 선택';

  const [hourText = '0', minute = '00'] = inputValue.split(':');
  const hour = Number(hourText);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 || 12;

  return `${period} ${displayHour}:${minute}`;
}

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
        className="flex h-[28px] w-full items-center justify-center rounded-[6px] border border-gray-300 bg-white px-2 text-[12px] leading-[16px] font-normal tracking-normal text-gray-700"
      >
        <span className="truncate">{formatDisplayTime(value)}</span>
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

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

  const handleToggleAllDay = () => {
    const nextAllDay = !isAllDay;
    const dateValue = toDateInputValue(draft.start);

    if (!dateValue) return;

    if (nextAllDay) {
      onChangeDraft({
        ...draft,
        allDay: true,
        start: dateValue,
        end: addDaysToCalendarDate(dateValue, 1),
      });
      return;
    }

    const nextStart = combineDateAndTime(dateValue, '22:00');
    const nextEnd = combineDateAndTime(dateValue, '23:30');

    if (!nextStart || !nextEnd) return;

    onChangeDraft({
      ...draft,
      allDay: false,
      start: nextStart,
      end: nextEnd,
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-transparent"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onCommit();
        }}
      />

      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label="일정"
        className={cn(
          'fixed z-50 w-[300px] overflow-visible rounded-[10px] border border-gray-300 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]',
          isAllDay || showDateOnlyTimedField ? 'h-[486px]' : 'h-[520px]',
        )}
        style={{ left: x, top: y }}
      >
        <div className="flex h-12 items-center justify-between px-4">
          <span className="text-[12px] leading-[16px] font-medium tracking-normal text-gray-950">
            일정
          </span>

          <button
            type="button"
            onClick={handleClosePopover}
            className="flex h-5 w-5 items-center justify-center text-gray-400"
            aria-label="닫기"
          >
            <ThinCloseIcon width={10} height={10} aria-hidden="true" />
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
            className="mt-[6px] h-[28px] w-full border-0 border-b border-gray-300 bg-transparent px-0 text-[14px] leading-[20px] font-medium tracking-normal text-gray-950 outline-none placeholder:text-gray-500 focus:border-gray-400"
          />

          {isAllDay ? (
            <div className="mt-[21px] grid grid-cols-[14px_1fr_10px_1fr] items-center gap-2">
              <FieldIcon>
                <DateIcon width={15} height={16} />
              </FieldIcon>

              <DisplayDateField value={draft.start} onChange={updateAllDayStart} />

              <span className="text-center text-[12px] text-gray-500">-</span>

              <DisplayDateField value={allDayDisplayEndValue} onChange={updateAllDayEnd} />
            </div>
          ) : showDateOnlyTimedField ? (
            <div className="mt-[21px] grid grid-cols-[14px_1fr] items-center gap-2">
              <FieldIcon>
                <DateIcon width={15} height={16} />
              </FieldIcon>

              <DisplayDateField value={draft.start} onChange={updateTimedDateOnlyDraft} />
            </div>
          ) : (
            <div className="mt-[21px] space-y-1.5">
              <div className="grid grid-cols-[14px_1fr_10px_1fr] items-center gap-2">
                <FieldIcon>
                  <WatchIcon width={16} height={16} />
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
                  <DateIcon width={15} height={16} />
                </FieldIcon>

                <DisplayDateField value={draft.start} onChange={updateTimedDateOnlyDraft} />
              </div>
            </div>
          )}

          <label className="mt-[10px] flex h-4 w-fit cursor-pointer items-center gap-3 text-[12px] leading-[16px] font-normal tracking-normal text-gray-700">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={handleToggleAllDay}
              className="sr-only"
            />
            <CheckboxIcon
              width={16}
              height={16}
              data-calendar-all-day-checkbox-icon="true"
              aria-hidden="true"
              className={cn('calendar-all-day-checkbox-icon', {
                'calendar-all-day-checkbox-icon--checked': isAllDay,
              })}
            />
            <span>종일</span>
          </label>

          <textarea
            value={draft.memo ?? ''}
            onChange={(event) =>
              onChangeDraft({
                ...draft,
                memo: event.target.value,
              })
            }
            placeholder="메모"
            className="mt-[25px] h-[100px] w-full resize-none overflow-y-auto rounded-[6px] border border-gray-300 px-2.5 py-2 text-[12px] leading-[16px] font-medium tracking-[-0.02em] text-gray-950 outline-none placeholder:text-gray-500 focus:border-gray-400"
          />

          <div className="mt-5">
            <div className="mb-[10px] text-[12px] leading-[16px] font-normal tracking-normal text-gray-600">
              일정 색상
            </div>

            <CollapsibleColorPicker
              value={draft.colorId}
              options={QUICK_EVENT_COLOR_OPTIONS}
              onChange={handleSelectColor}
            />
          </div>

          <div className="mt-[21px] space-y-[3px]">
            <div className="grid h-[30px] grid-cols-[14px_1fr] items-center gap-2 rounded-[6px] border border-gray-300 px-2.5">
              <FieldIcon>
                <LocationIcon width={12} height={12} />
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
                className={cn(
                  'h-[28px] w-full border-0 bg-transparent px-0 text-gray-700 outline-none placeholder:font-normal placeholder:text-gray-500',
                  FIELD_TEXT_CLASS_NAME,
                )}
              />
            </div>

            <div className="grid h-[30px] grid-cols-[14px_1fr] items-center gap-2 rounded-[6px] border border-gray-300 px-2.5">
              <FieldIcon>
                <LinkIcon width={12} height={6} />
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
                className={cn(
                  'h-[28px] w-full border-0 bg-transparent px-0 text-gray-700 outline-none placeholder:font-normal placeholder:text-gray-500',
                  FIELD_TEXT_CLASS_NAME,
                )}
              />
            </div>
          </div>

          <div className="mt-[3px] grid grid-cols-2 gap-2">
            <CustomDropdown
              value={draft.reminderMinutes !== undefined ? draft.reminderMinutes : ''}
              options={REMINDER_OPTIONS}
              leadingIcon={<Watch2Icon width={12} height={12} />}
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
    </>
  );
}
