import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type DashboardSectionHeaderProps = {
  icon: ReactNode;
  title: string;
  className?: string;
};

export default function DashboardSectionHeader({
  icon,
  title,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <header className={cn('mb-5 flex items-center gap-2', className)}>
      <span className="text-dashboard-gray flex h-6 w-6 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <h2 className="text-dashboard-black text-[16px] leading-[20px] font-bold">{title}</h2>
    </header>
  );
}
