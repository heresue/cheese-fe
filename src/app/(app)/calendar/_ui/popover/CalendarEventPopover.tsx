'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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

const QUICK_EVENT_COLORS: Array<{ id: EventColorId; hex: string }> = [
  { id: 'tag-gray', hex: '#93A1AF' },
  { id: 'tag-red', hex: '#EB5B49' },
  { id: 'tag-yellow', hex: '#F4C340' },
  { id: 'tag-green', hex: '#9CC04B' },
  { id: 'tag-blue', hex: '#5B9EF7' },
  { id: 'tag-purple', hex: '#9B59D0' },
];

const COLOR_SWATCH_SIZE = 20;
const COLOR_SWATCH_GAP = 8;

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#C1C7CF]">
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
          <ChevronIcon direction="down" width={16} height={16} />
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
  hideTimeFields = false,
  onChangeDraft,
  onClose,
  onCommit,
}: CalendarEventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

  const selectedColorId = draft.colorId ?? DEFAULT_EVENT_COLOR;
  const selectedColor = useMemo(
    () => QUICK_EVENT_COLORS.find((color) => color.id === selectedColorId) ?? QUICK_EVENT_COLORS[0],
    [selectedColorId],
  );
  const paletteColors = useMemo(
    () => QUICK_EVENT_COLORS.filter((color) => color.id !== selectedColorId),
    [selectedColorId],
  );

  const colorPaletteWidth =
    COLOR_SWATCH_SIZE +
    (paletteColors.length > 0
      ? COLOR_SWATCH_GAP +
        paletteColors.length * COLOR_SWATCH_SIZE +
        (paletteColors.length - 1) * COLOR_SWATCH_GAP
      : 0);

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
        setIsColorPaletteOpen(false);
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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!colorPickerRef.current) return;
      if (colorPickerRef.current.contains(event.target as Node)) return;
      setIsColorPaletteOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleClosePopover = () => {
    setIsColorPaletteOpen(false);
    onClose();
  };

  const handleColorTriggerClick = () => {
    setIsColorPaletteOpen((prev) => !prev);
  };

  const handleSelectColor = (colorId: EventColorId) => {
    onChangeDraft({
      ...draft,
      colorId,
    });
    setIsColorPaletteOpen(false);
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

  const handleToggleAllDay = (checked: boolean) => {
    if (checked) {
      const start = toDateInputValue(draft.start);
      if (!start) return;

      const displayEnd = toDateInputValue(draft.end) || start;
      const normalizedDisplayEnd =
        parseCalendarDate(displayEnd) &&
        parseCalendarDate(start) &&
        parseCalendarDate(displayEnd)! >= parseCalendarDate(start)!
          ? displayEnd
          : start;

      onChangeDraft({
        ...draft,
        allDay: true,
        start,
        end: addDaysToCalendarDate(normalizedDisplayEnd, 1),
      });
      return;
    }

    const baseDate = toDateInputValue(draft.start);
    if (!baseDate) return;

    const nextStart = combineDateAndTime(baseDate, timedStartTimeValue);
    const nextEnd = combineDateAndTime(baseDate, timedEndTimeValue || '10:00');

    if (!nextStart) return;

    onChangeDraft({
      ...draft,
      allDay: false,
      start: nextStart,
      end: nextEnd || addHoursToCalendarDateTime(nextStart, 1),
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
          onClick={handleClosePopover}
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
              <CalendarLineIcon width={16} height={16} />
            </FieldIcon>

            <DisplayDateField value={draft.start} onChange={updateAllDayStart} />

            <span className="text-center text-[12px] text-[#A8AFB8]">-</span>

            <DisplayDateField value={allDayDisplayEndValue} onChange={updateAllDayEnd} />
          </div>
        ) : showDateOnlyTimedField ? (
          <div className="grid grid-cols-[14px_1fr] items-center gap-2">
            <FieldIcon>
              <CalendarLineIcon width={16} height={16} />
            </FieldIcon>

            <DisplayDateField value={draft.start} onChange={updateTimedDateOnlyDraft} />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="grid grid-cols-[14px_1fr_10px_1fr] items-center gap-2">
              <FieldIcon>
                <ClockLineIcon width={16} height={16} />
              </FieldIcon>

              <DisplayTimeField
                value={draft.start}
                onChange={(nextValue) => updateTimedStart(timedStartDateValue, nextValue)}
              />

              <span className="text-center text-[12px] text-[#A8AFB8]">-</span>

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

        <label className="flex items-center gap-2 text-[12px] leading-[14px] text-[#6B7280]">
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={(e) => handleToggleAllDay(e.target.checked)}
            className="h-[14px] w-[14px] rounded-[4px] border border-[#D4D9E0] accent-[#F59E0B]"
          />
          <span>종일</span>
        </label>

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

          <div ref={colorPickerRef} className="flex items-center">
            <div
              className="overflow-hidden"
              style={{
                width: `${isColorPaletteOpen ? colorPaletteWidth : COLOR_SWATCH_SIZE}px`,
                transition: 'width 240ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleColorTriggerClick}
                  className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border border-[#C5CCD5] transition-transform duration-200"
                  style={{
                    backgroundColor: selectedColor.hex,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.68)',
                    transform: isColorPaletteOpen ? 'scale(1.04)' : 'scale(1)',
                  }}
                  aria-label="색상 팔레트 열기"
                  aria-expanded={isColorPaletteOpen}
                />

                <div
                  className="flex min-w-0 items-center gap-[8px]"
                  style={{
                    marginLeft: `${COLOR_SWATCH_GAP}px`,
                    opacity: isColorPaletteOpen ? 1 : 0,
                    transform: `translateX(${isColorPaletteOpen ? '0px' : '-10px'})`,
                    pointerEvents: isColorPaletteOpen ? 'auto' : 'none',
                    transition:
                      'opacity 180ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {paletteColors.map((color) => {
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleSelectColor(color.id)}
                        className="h-[20px] w-[20px] shrink-0 rounded-[6px] border border-transparent transition-transform duration-150 hover:scale-105 hover:border-[#C5CCD4]"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.52)',
                        }}
                        aria-label={color.id}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="grid grid-cols-[14px_1fr] items-center gap-2 rounded-[8px] border border-[#E5E7EB] px-2.5">
            <FieldIcon>
              <LocationLineIcon width={16} height={16} />
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
              <LinkLineIcon width={16} height={16} />
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
      </div>
    </div>
  );
}
