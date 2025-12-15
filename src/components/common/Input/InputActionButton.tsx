'use client';

import type { ButtonHTMLAttributes } from 'react';

export type InputActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function InputActionButton({
  className,
  children,
  ...rest
}: InputActionButtonProps) {
  return (
    <button
      type="button"
      className={[
        'shrink-0',
        'h-[26px] px-[10px]',
        'rounded-[5px]',
        'bg-primary-0',
        'border-primary-400 border',
        'text-bw-400 text-[12px] font-bold',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
