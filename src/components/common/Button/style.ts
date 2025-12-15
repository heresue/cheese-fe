import type { CSSProperties } from 'react';
import type { ButtonProps } from './type';

const base =
  'inline-flex items-center justify-center font-bold disabled:cursor-not-allowed disabled:opacity-50';

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
      className: [base, 'rounded-full', 'bg-bw-100', className ?? ''].filter(Boolean).join(' '),
      style: { width: px, height: px },
    };
  }

  // contained 버튼
  return {
    className: [base, 'rounded-[10px]', 'bg-primary-300 text-bw-0', className ?? '']
      .filter(Boolean)
      .join(' '),
    style: {
      width: width ?? '100%',
      height: height ?? 52,
    },
  };
}
