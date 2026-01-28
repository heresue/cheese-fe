'use client';

import { useId } from 'react';
import clsx from 'clsx';
import type { UnderlinedInputProps } from './type';

export default function Input({
  label,
  errorMessage,
  successMessage,
  rightAddon,
  id,
  className,
  inputClassName,
  ...rest
}: UnderlinedInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const isDisabled = !!rest.disabled;

  const hasError = !!errorMessage;
  const hasSuccess = !hasError && !!successMessage;
  const messageId = `${inputId}-message`;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      ) : null}

      <div
        className={clsx(
          'flex items-center',
          'gap-2 px-2 py-[5px]',
          'border-b transition-[border-color] duration-150',
          !isDisabled && 'border-gray-400',
          !isDisabled && 'focus-within:border-gray-800',
          isDisabled && 'border-gray-300',
          className,
        )}
      >
        <input
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? messageId : undefined}
          className={clsx(
            'h-[19px] min-w-0 flex-1',
            'border-0 bg-transparent',
            'placeholder:text-gray-500',
            'focus:outline-none',
            isDisabled && 'text-gray-500 placeholder:text-gray-400',
            inputClassName,
          )}
          {...rest}
        />

        {rightAddon ? <div className="flex shrink-0 items-center">{rightAddon}</div> : null}
      </div>

      {/* message (optional) */}
      {hasError ? (
        <p id={messageId} className="text-text-error mt-2 text-left text-[12px] font-medium">
          {errorMessage}
        </p>
      ) : hasSuccess ? (
        <p className="text-text-success mt-2 text-[12px] font-medium">{successMessage}</p>
      ) : null}
    </div>
  );
}
