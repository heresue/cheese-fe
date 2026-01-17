'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export type InputActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function InputActionButton({
  className,
  children,
  type = 'button',
  ...rest
}: InputActionButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center',
        'h-[30px] px-2',
        'whitespace-nowrap',
        'rounded-[5px]',
        'bg-p2',
        'text-g1 text-[12px] font-medium',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
