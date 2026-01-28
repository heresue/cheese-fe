import type { CSSProperties } from 'react';
import clsx from 'clsx';
import type { ButtonProps } from './type';

const base =
  'inline-flex items-center justify-center font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

export function getButtonStyle({
  variant = 'contained',
  width,
  height,
  size,
  className,
}: Pick<ButtonProps, 'variant' | 'width' | 'height' | 'size' | 'className'>): {
  className: string;
  style: CSSProperties;
} {
  // circle 버튼
  if (variant === 'circle') {
    const px = size ?? 48;

    return {
      className: clsx(base, 'rounded-full', 'bg-gray-200', className),
      style: { width: px, height: px },
    };
  }

  // contained 버튼
  return {
    className: clsx(base, 'rounded-[10px]', 'bg-primary-800 text-gray-800', className),
    style: {
      width: width ?? '100%',
      height: height ?? 40,
    },
  };
}
