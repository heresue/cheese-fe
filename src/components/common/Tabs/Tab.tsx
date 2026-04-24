'use client';

import { useTabs } from './Tabs';
import clsx from 'clsx';

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tab({ value, children, className }: TabProps) {
  const { value: active, onChange } = useTabs();

  const isActive = active === value;

  return (
    <button
      onClick={() => onChange(value)}
      className={clsx(
        'inline-flex items-center gap-2 rounded-[10px] border px-3 py-2',
        isActive
          ? 'border-secondary-600 text-secondary-800 border-2 font-bold'
          : 'border-gray-400 font-medium text-gray-800 [&>svg]:text-gray-500',
        className,
      )}
    >
      {children}
    </button>
  );
}
