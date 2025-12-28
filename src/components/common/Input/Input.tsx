'use client';

import { useId } from 'react';
import clsx from 'clsx';
import type { UnderlinedInputProps } from './type';

export default function Input({
  label,
  error,
  rightAddon,
  id,
  className,
  ...rest
}: UnderlinedInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      ) : null}

      <div className="group">
        <div className="flex items-center gap-3">
          <input
            id={inputId}
            className={clsx(
              'h-[47px] w-full min-w-0 bg-transparent outline-none',
              'text-bw-900 text-base font-normal',
              'placeholder:text-bw-400 placeholder:text-base placeholder:font-normal',
              'disabled:opacity-50',
              className,
            )}
            {...rest}
          />

          {rightAddon ? <div className="shrink-0">{rightAddon}</div> : null}
        </div>

        {/* underline */}
        <div className="bg-bw-100 mt-3 h-px w-full transition-all group-focus-within:h-[2px]" />
      </div>

      {/* error message */}
      {error ? <p className="text-error-100 mt-[5px] text-[12px] font-medium">{error}</p> : null}
    </div>
  );
}
