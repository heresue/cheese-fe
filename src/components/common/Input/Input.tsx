'use client';

import { useId } from 'react';
import clsx from 'clsx';
import type { UnderlinedInputProps } from './type';
import InputActionButton from '@/components/common/Input/InputActionButton';

export default function Input({
  label,
  error,
  rightAddon,
  id,
  className,
  inputClassName,
  ...rest
}: UnderlinedInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const isDisabled = !!rest.disabled;
  const hasError = !!error;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      ) : null}

      <div
        className={clsx(
          'flex items-center justify-between',
          'gap-2 px-2 py-[5px]',
          'border-b transition-[border-color] duration-150',
          !isDisabled && 'border-g7',
          !isDisabled && 'focus-within:border-g3',
          isDisabled && 'border-g8',
          className,
        )}
      >
        <input
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={clsx(
            'h-[19px] min-w-0 flex-1',
            'border-0 bg-transparent',
            'placeholder:text-g6',
            'focus:outline-none',
            isDisabled && 'text-g6 placeholder:text-g7',
            inputClassName,
          )}
          {...rest}
        />

        {rightAddon ? (
          <div className="flex shrink-0 items-center">
            <InputActionButton>{rightAddon}</InputActionButton>
          </div>
        ) : null}
      </div>

      {/* error message */}
      {error ? (
        <p id={errorId} className="text-er1 mt-2 text-[12px] font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}
