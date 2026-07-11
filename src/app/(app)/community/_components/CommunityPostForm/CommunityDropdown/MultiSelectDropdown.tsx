'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

import ArrowIcon from '@/assets/icons/common/arrow.svg';
import CheckIcon from '@/assets/icons/common/check.svg';

type MultiSelectDropdownProps<TValue extends string = string> = {
  value: TValue[];
  options: {
    label: string;
    value: TValue;
  }[];
  placeholder?: string;
  onChange: (value: TValue[]) => void;
};

export default function MultiSelectDropdown<TValue extends string = string>({
  value,
  options,
  placeholder = '선택',
  onChange,
}: MultiSelectDropdownProps<TValue>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const selectedLabel =
    selectedOptions.length > 0 ? selectedOptions.map((option) => option.label).join(', ') : null;

  const handleSelectOption = (optionValue: TValue) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((value) => value !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;

      setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-[30px] w-full items-center justify-between pr-5 font-medium',
          open ? 'border-secondary-600 rounded-[10px] border-2 pl-5' : 'border-b border-gray-400',
        )}
      >
        <span className={cn(!selectedLabel && 'text-gray-500')}>
          {selectedLabel ?? placeholder}
        </span>

        <ArrowIcon
          className={cn(
            'h-[10px] rotate-[-90deg] text-gray-500 transition-transform',
            open && 'rotate-90',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="absolute top-full left-0 z-20 mt-2 flex w-full flex-col gap-2 overflow-hidden rounded-[10px] border border-gray-400 bg-white p-3"
        >
          {options.map((option) => {
            const selected = value.includes(option.value);

            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  className={cn(
                    'flex h-5 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[12px] font-medium hover:bg-gray-200',
                    selected ? 'text-secondary-800' : 'text-gray-700',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center',
                      'rounded-[2px] border',
                      selected ? '' : 'border-gray-400 text-gray-400',
                    )}
                  >
                    <CheckIcon
                      className={cn('w-[10px] rounded-[3px]', selected ? '' : 'text-gray-400')}
                    />
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
