'use client';

import { useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

export default function Checkbox({ id, label, className, ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      htmlFor={inputId}
      className={clsx('inline-flex cursor-pointer items-center gap-[5px] select-none', className)}
    >
      <input id={inputId} type="checkbox" className="peer sr-only" {...rest} />

      <span
        className={clsx(
          'relative flex items-center justify-center',
          'h-[20px] w-[20px] rounded-[2px]',
          'border-primary-700 border',
          'peer-checked:bg-primary-700',
          'peer-checked:[&>img]:opacity-100',
        )}
      >
        <img
          src="/icons/check.svg"
          alt=""
          className="h-[12px] w-[12px] opacity-0 transition-opacity"
        />
      </span>

      {label ? <span className="text-sm font-normal">{label}</span> : null}
    </label>
  );
}
