import Link from 'next/link';

import { getDashboardCategoryMeta } from '@/app/(app)/calendar/_lib/dashboard-category';
import {
  formatDashboardDeadlineLabel,
  formatDashboardTimeRange,
  getDashboardEventLocation,
} from '@/app/(app)/calendar/_lib/dashboard-events';
import { getEventColorTokens } from '@/app/(app)/calendar/_model/constants';
import type { CalendarEvent } from '@/app/(app)/calendar/_model/types';
import { Chip } from '@/components/common/Chip';
import { cn } from '@/lib/cn';

type DashboardEventCardProps = {
  event: CalendarEvent;
};

export default function DashboardEventCard({ event }: DashboardEventCardProps) {
  const categoryMeta = getDashboardCategoryMeta(event);
  const deadlineLabel = formatDashboardDeadlineLabel(event);
  const timeRange = formatDashboardTimeRange(event);
  const location = getDashboardEventLocation(event);
  const colorTokens = getEventColorTokens(event.colorId);

  return (
    <Link
      href="/calendar"
      className="border-border hover:border-secondary-600 flex min-h-[188px] w-full flex-col rounded-[10px] border bg-white p-5 transition-colors"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <Chip variant={categoryMeta.chipVariant} size="sm">
          {categoryMeta.label}
        </Chip>

        <span
          className={cn(
            'text-[12px] leading-[18px] font-bold whitespace-nowrap',
            deadlineLabel.startsWith('오늘') ? 'text-dashboard-red' : 'text-dashboard-gray',
          )}
        >
          {deadlineLabel}
        </span>
      </div>

      <h3 className="text-dashboard-black mb-2 truncate text-[16px] leading-[24px] font-bold">
        {event.title}
      </h3>

      <p className="text-dashboard-gray text-[13px] leading-[20px] font-medium">{timeRange}</p>

      {location ? (
        <p className="text-dashboard-gray mt-1 truncate text-[13px] leading-[20px] font-medium">
          {location}
        </p>
      ) : null}

      {event.memo ? (
        <div
          className="mt-auto flex items-center gap-2 rounded-[6px] px-3 py-2"
          style={{
            backgroundColor: colorTokens.defaultBg,
            border: `1px solid ${colorTokens.defaultBorder}`,
          }}
        >
          <span className="text-[12px] leading-none" aria-hidden="true">
            📝
          </span>
          <p className="truncate text-[12px] leading-[18px] font-medium text-gray-800">
            {event.memo}
          </p>
        </div>
      ) : (
        <div className="mt-auto" />
      )}
    </Link>
  );
}
