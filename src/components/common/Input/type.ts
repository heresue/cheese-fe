import type { InputHTMLAttributes, ReactNode } from 'react';

export interface UnderlinedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  rightAddon?: ReactNode;
}
