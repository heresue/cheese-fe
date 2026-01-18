import type { InputHTMLAttributes, ReactNode } from 'react';

export interface UnderlinedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  errorMessage?: string;
  successMessage?: string;
  rightAddon?: ReactNode;
  inputClassName?: string;
}
