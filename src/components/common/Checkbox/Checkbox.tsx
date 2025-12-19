'use client';

import type { InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

export default function Checkbox({ id, label, className, ...rest }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={[
        'inline-flex cursor-pointer items-center gap-[5px] select-none',
        className ?? '',
      ].join(' ')}
    >
      <input id={id} type="checkbox" className="peer sr-only" {...rest} />

      <span
        className={[
          'relative flex items-center justify-center',
          'h-[20px] w-[20px] rounded-[2px]',
          'border-primary-400 border',
          'peer-checked:bg-primary-400',
          'peer-checked:[&>img]:opacity-100',
        ].join(' ')}
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
