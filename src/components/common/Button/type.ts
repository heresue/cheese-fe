import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'contained' | 'circle';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode;

  variant?: ButtonVariant;
  isLoading?: boolean;

  /** circle */
  size?: number; // default: 48px

  /**
   * circle 버튼은 접근성을 위해 aria-label을 강력 권장합니다.
   */
  'aria-label'?: string;

  /** contained */
  width?: number; // default: 100%
  height?: number; // default: 52px
}
