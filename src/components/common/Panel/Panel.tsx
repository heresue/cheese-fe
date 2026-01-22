import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type PanelProps = {
  children: ReactNode;
  className?: string;
  rounded?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Panel({ children, className, rounded = true, ...rest }: PanelProps) {
  return (
    <div
      className={clsx(
        rounded ? 'rounded-lg' : 'rounded-none',
        'bg-bg-surface',
        'shadow-[0_0_4px_rgba(0,0,0,0.25)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
